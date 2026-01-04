export const SYSTEM_CHECK_CONFIG = {
  version: "v1",

  // Likert mapping: 1..5 -> 0..100
  likertToScore: (v: number) => (v - 1) * 25,

  freeTextMaxLen: 400,
  contact: {
    nameMaxLen: 80,
    emailMaxLen: 120,
    companyMaxLen: 120,
    phoneMaxLen: 40,
  },

  thresholds: {
    criticalMax: 39,
    fragileMax: 59,
    solidMax: 79,
    strongMax: 100,
  },

  topStrengthsCount: 3,
  topLeversCount: 3,
  tensionsMax: 5,
  quickWinsMax: 5,
  reflectionQuestionsMin: 5,
  reflectionQuestionsMax: 7,

  dataRetentionDays: 30,

  runtime: "nodejs" as const,

  rateLimit: {
    submitPerIpPerHour: 5,
    reportPerIpPerHour: 30,
    answerPerIpPerHour: 300,
    startPerIpPerHour: 60,
  },
};
