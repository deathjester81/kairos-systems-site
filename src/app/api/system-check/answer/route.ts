import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { rateLimit, getIpFromRequest } from "@/lib/rateLimit";
import { SYSTEM_CHECK_CONFIG } from "@/lib/system-check/system-check.config";
import { loadQuestionsConfig } from "@/lib/system-check/loadQuestions";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = getIpFromRequest(req);
  const rl = rateLimit(
    `answer:${ip}`,
    SYSTEM_CHECK_CONFIG.rateLimit.answerPerIpPerHour,
    60 * 60 * 1000
  );
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { token, question_id, score, free_text } = body as {
    token?: string;
    question_id?: string;
    score?: number;
    free_text?: string | null;
  };

  if (!token || !question_id) return NextResponse.json({ error: "Missing token/question_id" }, { status: 400 });
  if (typeof score !== "number" || score < 1 || score > 5) return NextResponse.json({ error: "Score must be 1..5" }, { status: 400 });
  if (free_text && free_text.length > SYSTEM_CHECK_CONFIG.freeTextMaxLen) return NextResponse.json({ error: "Free text too long" }, { status: 400 });

  const cfg = loadQuestionsConfig();
  const q = cfg.questions.find((qq) => qq.id === question_id);
  if (!q) return NextResponse.json({ error: "Unknown question_id" }, { status: 400 });

  const { data: session, error: sErr } = await supabaseAdmin
    .from("audit_sessions")
    .select("id,status")
    .eq("token", token)
    .single();

  if (sErr || !session) return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  if (session.status === "submitted") return NextResponse.json({ error: "Session already submitted" }, { status: 409 });

  const { error } = await supabaseAdmin
    .from("audit_answers")
    .upsert(
      { session_id: session.id, question_id, axis: q.axis, score, free_text: free_text ?? null },
      { onConflict: "session_id,question_id" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
