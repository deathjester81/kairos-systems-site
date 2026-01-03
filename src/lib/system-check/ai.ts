import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";
import { AiJson, DeterministicInsights, AnswerInput, QuestionsConfig } from "./types";

function readPrompt(relPath: string) {
  const p = path.join(process.cwd(), relPath);
  return fs.readFileSync(p, "utf-8");
}

export async function generateAiJson(args: {
  cfg: QuestionsConfig;
  insights: DeterministicInsights;
  answers: AnswerInput[];
}) : Promise<AiJson> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("Missing OPENAI_API_KEY");

  const system = readPrompt("src/lib/system-check/prompts/system.md");
  const userTemplate = readPrompt("src/lib/system-check/prompts/user.md");

  const client = new OpenAI({ apiKey });

  const input = {
    axes: args.cfg.axes,
    questions: args.cfg.questions,
    insights: args.insights,
    answers: args.answers,
  };

  const user = `${userTemplate}\n\nDATA:\n${JSON.stringify(input, null, 2)}`;

  const resp = await client.chat.completions.create({
    model: "gpt-5.2", // wie von dir entschieden
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.4,
  });

  const text = resp.choices[0]?.message?.content?.trim() ?? "";
  // Erwartung: JSON only
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch {
    // harte Fallback-Policy: niemals crashen -> sehr konservativ
    return {
      summary_md: "Die KI-Auswertung konnte nicht sauber erzeugt werden. (MVP-Fallback)",
      tensions_md: "",
      quick_wins_md: "",
      reflection_questions_md: "1) Wo ist euer größter Engpass im Alltag?\n2) Was würdet ihr als erstes stabilisieren, wenn eine Schlüsselperson 2 Wochen ausfällt?",
    };
  }

  return {
    summary_md: String(parsed.summary_md ?? ""),
    tensions_md: String(parsed.tensions_md ?? ""),
    quick_wins_md: String(parsed.quick_wins_md ?? ""),
    reflection_questions_md: String(parsed.reflection_questions_md ?? ""),
  };
}
