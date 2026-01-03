import { DeterministicInsights, AxisScore, AxisId } from "./types";
import { SYSTEM_CHECK_CONFIG } from "./system-check.config";

function sortDesc(a: AxisScore, b: AxisScore) {
  return b.score_0_100 - a.score_0_100;
}
function sortAsc(a: AxisScore, b: AxisScore) {
  return a.score_0_100 - b.score_0_100;
}

function get(scores: AxisScore[], axis: AxisId) {
  return scores.find((s) => s.axis === axis)?.score_0_100 ?? 0;
}

/**
 * Spannungsregeln (editierbar)
 * Output: kurze, klare Spiegel-Sätze ohne Hype.
 */
export function computeTensions(scores: AxisScore[]) {
  const out: { code: string; title: string; text: string }[] = [];

  const sys = get(scores, "systemfaehigkeit");
  const proc = get(scores, "prozesse");
  const lead = get(scores, "fuehrung_kultur");
  const digi = get(scores, "digitalisierung_daten");
  const ai = get(scores, "ki_integration");

  // 1) KI Ambition > Fundament
  if (ai >= 70 && (digi <= 50 || sys <= 50)) {
    out.push({
      code: "AI_GT_FOUNDATION",
      title: "Ambition ohne Fundament",
      text: "KI wirkt bei euch eher wie ein Wunsch nach Entlastung – aber Daten/Systemgrundlagen könnten noch zu wacklig sein, damit KI stabil im Alltag trägt.",
    });
  }

  // 2) Prozesse hoch, Führung niedrig
  if (proc >= 70 && lead <= 50) {
    out.push({
      code: "PROCESS_GT_LEAD",
      title: "Prozess auf Papier, nicht im Verhalten",
      text: "Es könnte sein, dass Prozesse existieren – aber Führung/Rahmenbedingungen sorgen noch nicht dafür, dass sie im Alltag wirklich gelebt werden.",
    });
  }

  // 3) Führung hoch, System niedrig
  if (lead >= 70 && sys <= 50) {
    out.push({
      code: "HEROIC_LEAD",
      title: "Starke Menschen kompensieren Systemlücken",
      text: "Führung scheint zu tragen – aber das System dahinter könnte noch nicht so stabil sein, dass es ohne persönliche Kompensation zuverlässig läuft.",
    });
  }

  // 4) Digitalisierung hoch, Prozesse niedrig
  if (digi >= 70 && proc <= 50) {
    out.push({
      code: "TOOLS_NO_FLOW",
      title: "Tools ohne Fluss",
      text: "Es wirkt, als ob Tools da sind – aber der End-to-End-Fluss ist noch nicht sauber genug, damit die Tools wirklich Reibung rausnehmen.",
    });
  }

  // 5) System niedrig generell
  if (sys <= 40) {
    out.push({
      code: "SYSTEM_CRITICAL",
      title: "Systemfähigkeit als Engpass",
      text: "Euer größter Hebel könnte gerade nicht ein Tool oder eine Methode sein, sondern die Fähigkeit, als Gesamt-System verlässlich zu funktionieren (weniger Personenabhängigkeit, klarere Spielregeln, sauberere Schnittstellen).",
    });
  }

  return out.slice(0, SYSTEM_CHECK_CONFIG.tensionsMax);
}

export function buildDeterministicInsights(axisScores: AxisScore[]): DeterministicInsights {
  const strengths = [...axisScores].sort(sortDesc).slice(0, SYSTEM_CHECK_CONFIG.topStrengthsCount)
    .map(s => ({ axis: s.axis, label: s.label, score_0_100: s.score_0_100 }));

  const levers = [...axisScores].sort(sortAsc).slice(0, SYSTEM_CHECK_CONFIG.topLeversCount)
    .map(s => ({ axis: s.axis, label: s.label, score_0_100: s.score_0_100 }));

  return {
    axis_scores: axisScores,
    strengths,
    levers,
    tensions: computeTensions(axisScores),
  };
}
