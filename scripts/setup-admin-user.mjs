import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const rows = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const row of rows) {
    if (!row || row.trim().startsWith("#")) continue;
    const eqIndex = row.indexOf("=");
    if (eqIndex <= 0) continue;
    const key = row.slice(0, eqIndex).trim();
    const value = row.slice(eqIndex + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

const email = "fabrizio@struqtera.ch";
const redirectTo = process.env.ADMIN_RESET_REDIRECT_URL || "http://localhost:3000/internal/auth/update-password";

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });

const list = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
if (list.error) {
  console.error("listUsers error:", list.error.message);
  process.exit(1);
}

const existing = list.data.users.find((user) => user.email?.toLowerCase() === email);
if (!existing) {
  const created = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { role: "admin-dashboard" },
    app_metadata: { role: "admin-dashboard" },
    password: randomUUID() + randomUUID(),
  });

  if (created.error) {
    console.error("createUser error:", created.error.message);
    process.exit(1);
  }
  console.log(`Admin user created: ${email}`);
} else {
  console.log(`Admin user already exists: ${email}`);
}

const reset = await supabase.auth.admin.generateLink({
  type: "recovery",
  email,
  options: { redirectTo },
});

if (reset.error) {
  console.error("generateLink error:", reset.error.message);
  process.exit(1);
}

console.log("Password recovery link generated. Open this once to set password:");
console.log(reset.data.properties.action_link);
