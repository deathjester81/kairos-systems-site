import { SYSTEM_CHECK_CONFIG } from "./system-check.config";
import { AnswerInput, QuestionsConfig, AxisScore } from "./types";

function levelFor(score: number): AxisScore["level"] {
  const t = SYSTEM_CHECK_CONFIG.thresholds;
  if (score <= t.criticalMax) return "kritisch";
  if (score <= t.fragileMax) return "fragil";
  if (score <= t.solidMax) return "solide";
  return "stark";
}

export function computeAxisScores(
  cfg: QuestionsConfig,
  answers: AnswerInput[]
): AxisScore[] {
  // map question by id for reverse + axis + label
  const qById = new Map(cfg.questions.map((q) => [q.id, q]));
  const axisLabel = new Map(cfg.axes.map((a) => [a.id, a.label]));

  // accumulate per axis
  const sums = new Map<string, { total: number; count: number }>();

  for (const a of answers) {
    const q = qById.get(a.question_id);
    if (!q) continue;
    let v = a.score;
    if (q.reverse) v = 6 - v;
    const score0100 = SYSTEM_CHECK_CONFIG.likertToScore(v);

    const key = q.axis;
    const cur = sums.get(key) ?? { total: 0, count: 0 };
    cur.total += score0100;
    cur.count += 1;
    sums.set(key, cur);
  }

  return cfg.axes.map((ax) => {
    const cur = sums.get(ax.id) ?? { total: 0, count: 0 };
    const avg = cur.count ? Math.round(cur.total / cur.count) : 0;
    return {
      axis: ax.id,
      label: axisLabel.get(ax.id) ?? ax.id,
      score_0_100: avg,
      level: levelFor(avg),
    };
  });
}
