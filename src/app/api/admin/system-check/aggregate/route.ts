import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { requireAdminFromBearer } from "@/lib/admin/requireAdmin";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = await requireAdminFromBearer(req);
  if ("error" in auth) return auth.error;

  const { data: reports, error: reportsError } = await supabaseAdmin
    .from("audit_reports")
    .select("scores_json,created_at");
  if (reportsError) return NextResponse.json({ error: reportsError.message }, { status: 500 });

  const axisAggregation = new Map<string, { total: number; count: number }>();
  let overallTotal = 0;
  let overallCount = 0;

  for (const report of reports ?? []) {
    const axisScores = report?.scores_json?.axisScores?.axisScores ?? report?.scores_json?.axisScores ?? [];
    if (!Array.isArray(axisScores)) continue;

    let reportSum = 0;
    let reportCount = 0;

    for (const axis of axisScores) {
      const label = String(axis?.label ?? "Unbekannt");
      const score = Number(axis?.score_0_100);
      if (!Number.isFinite(score)) continue;

      const current = axisAggregation.get(label) ?? { total: 0, count: 0 };
      current.total += score;
      current.count += 1;
      axisAggregation.set(label, current);

      reportSum += score;
      reportCount += 1;
    }

    if (reportCount > 0) {
      overallTotal += reportSum / reportCount;
      overallCount += 1;
    }
  }

  const axisAverages = Array.from(axisAggregation.entries())
    .map(([label, values]) => ({
      label,
      average: Math.round(values.total / values.count),
      samples: values.count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return NextResponse.json({
    total_reports: reports?.length ?? 0,
    overall_average: overallCount > 0 ? Math.round(overallTotal / overallCount) : null,
    axis_averages: axisAverages,
  });
}
