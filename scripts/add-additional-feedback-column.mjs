/**
 * Script to add additional_feedback column to audit_sessions table
 * 
 * Run with: node scripts/add-additional-feedback-column.mjs
 * 
 * Requires:
 * - SUPABASE_URL environment variable
 * - SUPABASE_SERVICE_ROLE_KEY environment variable
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  console.error("   Make sure .env.local exists with these variables");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

async function addColumn() {
  console.log("🔄 Adding additional_feedback column to audit_sessions...");

  try {
    // Use RPC to execute raw SQL (if you have a function for it)
    // Or use the REST API directly
    const { data, error } = await supabase.rpc("exec_sql", {
      sql: "ALTER TABLE audit_sessions ADD COLUMN IF NOT EXISTS additional_feedback TEXT;",
    });

    if (error) {
      // RPC might not exist, try direct SQL via REST API
      console.log("⚠️  RPC not available, trying direct approach...");
      console.log("   Please run this SQL manually in Supabase Dashboard:");
      console.log("");
      console.log("   ALTER TABLE audit_sessions");
      console.log("   ADD COLUMN IF NOT EXISTS additional_feedback TEXT;");
      console.log("");
      process.exit(1);
    }

    console.log("✅ Column added successfully!");
  } catch (err) {
    console.error("❌ Error:", err.message);
    console.log("");
    console.log("   Please run this SQL manually in Supabase Dashboard:");
    console.log("");
    console.log("   ALTER TABLE audit_sessions");
    console.log("   ADD COLUMN IF NOT EXISTS additional_feedback TEXT;");
    console.log("");
    process.exit(1);
  }
}

addColumn();
