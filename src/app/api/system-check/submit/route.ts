import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { rateLimit, getIpFromRequest } from "@/lib/rateLimit";
import { SYSTEM_CHECK_CONFIG } from "@/lib/system-check/system-check.config";
import { loadQuestionsConfig } from "@/lib/system-check/loadQuestions";
import { computeAxisScores } from "@/lib/system-check/scoring";
import { buildDeterministicInsights } from "@/lib/system-check/rules";
import { generateAiJson } from "@/lib/system-check/ai";
import { sendInternalNotification, formatReportAsHtml } from "@/lib/system-check/notify";

export const runtime = "nodejs";

function clampLen(v: unknown, max: number) {
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (!s) return null;
  return s.length > max ? s.slice(0, max) : s;
}

export async function POST(req: Request) {
  const ip = getIpFromRequest(req);

  const rl = rateLimit(
    `submit:${ip}`,
    SYSTEM_CHECK_CONFIG.rateLimit.submitPerIpPerHour,
    60 * 60 * 1000
  );
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const token = body.token as string | undefined;
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const name = clampLen(body.name, SYSTEM_CHECK_CONFIG.contact.nameMaxLen);
  const email = clampLen(body.email, SYSTEM_CHECK_CONFIG.contact.emailMaxLen);
  const company = clampLen(body.company, SYSTEM_CHECK_CONFIG.contact.companyMaxLen);
  const phone = clampLen(body.phone, SYSTEM_CHECK_CONFIG.contact.phoneMaxLen);

  const { data: session, error: sErr } = await supabaseAdmin
    .from("audit_sessions")
    .select("id,status,token,created_at")
    .eq("token", token)
    .single();

  if (sErr || !session) return NextResponse.json({ error: "Invalid token" }, { status: 404 });

  // Idempotent: wenn schon submitted, dann ok zurückgeben
  if (session.status === "submitted") {
    return NextResponse.json({ ok: true, token });
  }

  const { data: answers, error: aErr } = await supabaseAdmin
    .from("audit_answers")
    .select("question_id,axis,score,free_text")
    .eq("session_id", session.id);

  if (aErr) return NextResponse.json({ error: aErr.message }, { status: 500 });

  const cfg = loadQuestionsConfig();

  // MVP: require all answered
  if (!answers || answers.length < cfg.questions.length) {
    return NextResponse.json(
      { error: `Not all questions answered (${answers?.length ?? 0}/${cfg.questions.length})` },
      { status: 400 }
    );
  }

  // Deterministic
  const axisScores = computeAxisScores(cfg, answers as any);
  const insights = buildDeterministicInsights(axisScores);

  // AI
  const ai_json = await generateAiJson({ cfg, insights, answers: answers as any });

  // Save report (upsert so reruns overwrite)
  const scores_json = { axisScores, version: SYSTEM_CHECK_CONFIG.version };
  const insights_json = insights;

  const { error: rErr } = await supabaseAdmin
    .from("audit_reports")
    .upsert({
      session_id: session.id,
      scores_json,
      insights_json,
      ai_json,
    });

  if (rErr) return NextResponse.json({ error: rErr.message }, { status: 500 });

  // Update session -> submitted + contact fields
  const { error: uErr } = await supabaseAdmin
    .from("audit_sessions")
    .update({
      status: "submitted",
      name,
      email,
      company,
      phone,
    })
    .eq("id", session.id);

  if (uErr) return NextResponse.json({ error: uErr.message }, { status: 500 });

  // Fetch the created report for email
  const { data: finalReport, error: reportErr } = await supabaseAdmin
    .from("audit_reports")
    .select("scores_json,insights_json,ai_json")
    .eq("session_id", session.id)
    .single();

  // Get updated session with contact info
  const { data: finalSession } = await supabaseAdmin
    .from("audit_sessions")
    .select("token,name,email,company,phone")
    .eq("id", session.id)
    .single();

  // Internal notify (Resend) with full report. If not configured, notify.ts logs and skips without failing.
  let notifyResult;
  if (finalReport && finalSession) {
    const reportHtml = formatReportAsHtml(finalReport, finalSession);
    notifyResult = await sendInternalNotification({
      subject: `System-Check Submission: ${finalSession.name || finalSession.company || "Anonym"} (${token.slice(0, 8)}...)`,
      html: reportHtml,
    });
  } else {
    // Fallback if report fetch failed (shouldn't happen, but safe)
    notifyResult = await sendInternalNotification({
      subject: "System-Check Submission",
      html: `
        <p><b>Token:</b> ${token}</p>
        <p><b>Name:</b> ${name ?? "(none)"}</p>
        <p><b>Email:</b> ${email ?? "(none)"}</p>
        <p><b>Company:</b> ${company ?? "(none)"}</p>
        <p><b>Phone:</b> ${phone ?? "(none)"}</p>
        <p><b>Status:</b> submitted</p>
        <p>Report URL: /system-check/report/${token}</p>
        <p><em>Note: Report HTML generation failed. Check logs.</em></p>
      `,
    });
  }

  // Log notification result for debugging
  if (notifyResult?.skipped) {
    console.warn("[submit] Email notification skipped:", notifyResult.error);
  } else if (notifyResult?.error) {
    console.error("[submit] Email notification failed:", notifyResult.error);
  } else {
    console.log("[submit] Email notification sent:", notifyResult?.id);
  }

  return NextResponse.json({ ok: true, token });
}
