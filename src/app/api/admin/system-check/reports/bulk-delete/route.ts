import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdminFromBearer } from "@/lib/admin/requireAdmin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const auth = await requireAdminFromBearer(req);
  if ("error" in auth) return auth.error;

  const body = await req.json().catch(() => null);
  const tokens = Array.isArray(body?.tokens)
    ? body.tokens.filter((value: unknown): value is string => typeof value === "string")
    : [];

  if (tokens.length === 0) {
    return NextResponse.json({ error: "No tokens provided" }, { status: 400 });
  }
  if (tokens.length > 200) {
    return NextResponse.json({ error: "Too many tokens (max 200)" }, { status: 400 });
  }

  const { data: sessions, error: sessionsError } = await supabaseAdmin
    .from("audit_sessions")
    .select("id,token")
    .in("token", tokens);

  if (sessionsError) return NextResponse.json({ error: sessionsError.message }, { status: 500 });

  const sessionIds = (sessions ?? []).map((session) => session.id);
  if (sessionIds.length === 0) return NextResponse.json({ ok: true, deleted: 0 });

  const { error: reportDeleteError } = await supabaseAdmin
    .from("audit_reports")
    .delete()
    .in("session_id", sessionIds);
  if (reportDeleteError) return NextResponse.json({ error: reportDeleteError.message }, { status: 500 });

  const { error: answerDeleteError } = await supabaseAdmin
    .from("audit_answers")
    .delete()
    .in("session_id", sessionIds);
  if (answerDeleteError) return NextResponse.json({ error: answerDeleteError.message }, { status: 500 });

  const { error: sessionDeleteError } = await supabaseAdmin
    .from("audit_sessions")
    .delete()
    .in("id", sessionIds);
  if (sessionDeleteError) return NextResponse.json({ error: sessionDeleteError.message }, { status: 500 });

  return NextResponse.json({ ok: true, deleted: sessionIds.length });
}
