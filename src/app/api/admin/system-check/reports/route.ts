import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdminFromBearer } from "@/lib/admin/requireAdmin";

export const runtime = "nodejs";

function getOverallScore(scoresJson: any): number | null {
  const axisScores = scoresJson?.axisScores?.axisScores ?? scoresJson?.axisScores ?? [];
  if (!Array.isArray(axisScores) || axisScores.length === 0) return null;

  const values = axisScores
    .map((entry: any) => Number(entry?.score_0_100))
    .filter((value: number) => Number.isFinite(value));

  if (values.length === 0) return null;
  const avg = values.reduce((acc: number, value: number) => acc + value, 0) / values.length;
  return Math.round(avg);
}

export async function GET(req: Request) {
  const auth = await requireAdminFromBearer(req);
  if ("error" in auth) return auth.error;

  const url = new URL(req.url);
  const search = (url.searchParams.get("search") ?? "").trim();
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 30), 1), 100);
  const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);

  let sessionsQuery = supabaseAdmin
    .from("audit_sessions")
    .select("id,token,status,created_at,name,email,company,phone,additional_feedback", { count: "exact" })
    .eq("status", "submitted")
    .order("created_at", { ascending: false });

  if (search) {
    sessionsQuery = sessionsQuery.or(
      `token.ilike.%${search}%,name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`
    );
  }

  const { data: sessions, error: sessionsError, count } = await sessionsQuery.range(offset, offset + limit - 1);
  if (sessionsError) return NextResponse.json({ error: sessionsError.message }, { status: 500 });

  if (!sessions || sessions.length === 0) {
    return NextResponse.json({ items: [], total: count ?? 0, limit, offset });
  }

  const sessionIds = sessions.map((session) => session.id);
  const { data: reports, error: reportsError } = await supabaseAdmin
    .from("audit_reports")
    .select("session_id,created_at,scores_json,insights_json")
    .in("session_id", sessionIds);

  if (reportsError) return NextResponse.json({ error: reportsError.message }, { status: 500 });

  const reportBySessionId = new Map((reports ?? []).map((report) => [report.session_id, report]));

  const items = sessions.map((session) => {
    const report = reportBySessionId.get(session.id);
    return {
      token: session.token,
      status: session.status,
      created_at: session.created_at,
      report_created_at: report?.created_at ?? null,
      name: session.name,
      email: session.email,
      company: session.company,
      phone: session.phone,
      additional_feedback: session.additional_feedback,
      overall_score: getOverallScore(report?.scores_json),
      top_lever: report?.insights_json?.levers?.[0]?.label ?? null,
    };
  });

  return NextResponse.json({
    items,
    total: count ?? items.length,
    limit,
    offset,
  });
}
