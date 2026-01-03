import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { rateLimit, getIpFromRequest, hashIp } from "@/lib/rateLimit";
import { SYSTEM_CHECK_CONFIG } from "@/lib/system-check/system-check.config";

export const runtime = "nodejs";

function newToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function POST(req: Request) {
  const ip = getIpFromRequest(req);

  const rl = rateLimit(
    `start:${ip}`,
    SYSTEM_CHECK_CONFIG.rateLimit.startPerIpPerHour,
    60 * 60 * 1000
  );
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const token = newToken();
  const ip_hash = hashIp(ip);

  const { error } = await supabaseAdmin
    .from("audit_sessions")
    .insert({ token, status: "started", ip_hash });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ token });
}
