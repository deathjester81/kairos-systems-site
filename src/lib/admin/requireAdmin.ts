import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const DEFAULT_ADMIN_EMAIL = "fabrizio@struqtera.ch";

export async function requireAdminFromBearer(req: Request) {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";

  if (!token) {
    return { error: NextResponse.json({ error: "Missing bearer token" }, { status: 401 }) };
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user?.email) {
    return { error: NextResponse.json({ error: "Invalid auth token" }, { status: 401 }) };
  }

  const allowedEmail = (process.env.ADMIN_DASHBOARD_EMAIL ?? DEFAULT_ADMIN_EMAIL).toLowerCase();
  const currentEmail = data.user.email.toLowerCase();
  if (currentEmail !== allowedEmail) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { user: data.user, token };
}
