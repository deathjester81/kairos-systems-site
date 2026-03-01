import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdminFromBearer } from "@/lib/admin/requireAdmin";

export const runtime = "nodejs";

export async function GET(req: Request, context: { params: Promise<{ token: string }> }) {
  const auth = await requireAdminFromBearer(req);
  if ("error" in auth) return auth.error;

  const { token } = await context.params;
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const { data: session, error: sessionError } = await supabaseAdmin
    .from("audit_sessions")
    .select("id,token,status,created_at,name,email,company,phone,additional_feedback")
    .eq("token", token)
    .single();

  if (sessionError || !session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  const { data: report, error: reportError } = await supabaseAdmin
    .from("audit_reports")
    .select("created_at,scores_json,insights_json,ai_json")
    .eq("session_id", session.id)
    .single();

  if (reportError || !report) return NextResponse.json({ error: "Report not found" }, { status: 404 });

  return NextResponse.json({ session, report });
}

export async function DELETE(req: Request, context: { params: Promise<{ token: string }> }) {
  const auth = await requireAdminFromBearer(req);
  if ("error" in auth) return auth.error;

  const { token } = await context.params;
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const { data: session, error: sessionError } = await supabaseAdmin
    .from("audit_sessions")
    .select("id")
    .eq("token", token)
    .single();

  if (sessionError || !session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  const sessionId = session.id;

  const { error: reportDeleteError } = await supabaseAdmin
    .from("audit_reports")
    .delete()
    .eq("session_id", sessionId);
  if (reportDeleteError) return NextResponse.json({ error: reportDeleteError.message }, { status: 500 });

  const { error: answerDeleteError } = await supabaseAdmin
    .from("audit_answers")
    .delete()
    .eq("session_id", sessionId);
  if (answerDeleteError) return NextResponse.json({ error: answerDeleteError.message }, { status: 500 });

  const { error: sessionDeleteError } = await supabaseAdmin
    .from("audit_sessions")
    .delete()
    .eq("id", sessionId);
  if (sessionDeleteError) return NextResponse.json({ error: sessionDeleteError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
