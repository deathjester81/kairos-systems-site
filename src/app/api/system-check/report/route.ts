import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { rateLimit, getIpFromRequest } from "@/lib/rateLimit";
import { SYSTEM_CHECK_CONFIG } from "@/lib/system-check/system-check.config";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const ip = getIpFromRequest(req);
  const rl = rateLimit(
    `report:${ip}`,
    SYSTEM_CHECK_CONFIG.rateLimit.reportPerIpPerHour,
    60 * 60 * 1000
  );
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Missing token" }, { status: 400 });

  const { data: session, error: sErr } = await supabaseAdmin
    .from("audit_sessions")
    .select("token,status,created_at,name,email,company,phone,id")
    .eq("token", token)
    .single();

  if (sErr || !session) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: report, error: rErr } = await supabaseAdmin
    .from("audit_reports")
    .select("created_at,scores_json,insights_json,ai_json")
    .eq("session_id", session.id)
    .single();

  if (rErr || !report) return NextResponse.json({ error: "Report not ready" }, { status: 404 });

  return NextResponse.json({
    session: {
      token: session.token,
      status: session.status,
      created_at: session.created_at,
      name: session.name,
      email: session.email,
      company: session.company,
      phone: session.phone,
    },
    report,
  });
}
