import fs from "node:fs";
import path from "node:path";
import { QuestionsConfig } from "./types";

export function loadQuestionsConfig(): QuestionsConfig {
  const p = path.join(process.cwd(), "src/lib/system-check/questions.v1.json");
  const raw = fs.readFileSync(p, "utf-8");
  return JSON.parse(raw) as QuestionsConfig;
}
