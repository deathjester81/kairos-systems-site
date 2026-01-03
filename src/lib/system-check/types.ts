export type AxisId =
  | "systemfaehigkeit"
  | "prozesse"
  | "fuehrung_kultur"
  | "digitalisierung_daten"
  | "ki_integration";

export type Axis = { id: AxisId; label: string };

export type Question = {
  id: string;
  axis: AxisId;
  text: string;
  reverse: boolean;
  freeTextEnabled: boolean;
  freeTextPrompt?: string;
};

export type QuestionsConfig = {
  version: string;
  axes: Axis[];
  questions: Question[];
};

export type AnswerInput = {
  question_id: string;
  score: number; // 1..5 raw
  free_text?: string | null;
};

export type AxisScore = {
  axis: AxisId;
  label: string;
  score_0_100: number;
  level: "kritisch" | "fragil" | "solide" | "stark";
};

export type DeterministicInsights = {
  axis_scores: AxisScore[];
  strengths: { axis: AxisId; label: string; score_0_100: number }[];
  levers: { axis: AxisId; label: string; score_0_100: number }[];
  tensions: { code: string; title: string; text: string }[];
};

export type AiJson = {
  summary_md: string;
  tensions_md: string;
  quick_wins_md: string;
  reflection_questions_md: string;
};

export type ReportPayload = {
  session: {
    token: string;
    status: string;
    created_at: string;
    name?: string | null;
    email?: string | null;
    company?: string | null;
    phone?: string | null;
  };
  report: {
    scores_json: any;
    insights_json: DeterministicInsights;
    ai_json: AiJson;
    created_at: string;
  };
};
