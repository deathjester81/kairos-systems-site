# System-Check MVP Plan

## Ziel
Ein Self-Audit Modul (ca. 12–15 Minuten, 30 Fragen), das:
- Nutzer:innen ein echtes Spiegelbild gibt (Radar + Einordnung + Reflexionsfragen)
- Kompetenz zeigt ohne Hype
- optional Lead-Daten einsammelt (Email optional im MVP)
- später leicht ausbaubar ist (PDF, Email, n8n, CRM)

## Non-Goals (MVP)
- Kein Chatbot
- Kein PDF
- Kein Versand an User
- Keine Zertifizierung / Diagnose / Beratung
- Kein Marketing-CTA im Report

## UX Routes
- /system-check
  Landing: Was es ist / Was es nicht ist, Dauer, Datenschutz, Start Button
- /system-check/run
  Wizard: 1 Frage pro Screen, Progress, Back/Next, optional Freitext bei ausgewählten Fragen
- /system-check/report/[token]
  Report per Token (loginlos), immer sichtbar auch ohne Email

## Achsen (5)
1) Systemfähigkeit
2) Prozesse
3) Führung & Kultur
4) Digitalisierung & Daten
5) KI-Integration

Jede Frage gehört genau 1 Achse.

## Scoring
- Likert 1–5
- Mapping: 1→20, 2→40, 3→60, 4→80, 5→100
- Reverse items: score = 6 - score
- Achsen-Score: Mittelwert der 6 Fragen pro Achse (0–100)

Stufen:
- 0–39 kritisch
- 40–59 fragil
- 60–79 solide
- 80–100 stark

## Report Ebenen
### Ebene 1 — Deterministisch (Pflicht)
- Radar Chart (5 Achsen)
- Achsen-Scores + kurze regelbasierte Interpretation
- Top 3 Stärken / Top 3 Hebel (aus Scores + ggf. stärksten/schwächsten Items)
- Spannungen/Widersprüche (regelbasiert)

### Ebene 2 — KI-Interpretation (GPT-5.2)
- 1–2 Absätze Gesamtbild (ruhig, präzise, leicht unbequem)
- Hypothesen, keine Diagnosen (“Es könnte sein…”)
- Keine Tools, keine CTAs, keine Versprechen, keine Buzzwords

### Ebene 3 — KI-Reflexionsfragen
- 5–7 maßgeschneiderte Reflexionsfragen (basierend auf Mustern + optionalen Freitexten)
- Optional: 3–5 Quick Wins (sanft, keine radikalen Anweisungen)

## Techstack MVP
- Next.js (App Router)
- Supabase (Postgres)
- Recharts (RadarChart)
- OpenAI API (GPT-5.2) server-side in Next Route Handler
- Interne Notification Email (z.B. Resend)
- Keine User-Email im MVP

## Datenmodell
- audit_sessions: id, created_at, token, status, name?, email?, company?, phone?, ip_hash?
- audit_answers: session_id, question_id, axis, score (1–5), free_text?
- audit_reports: session_id, scores_json, insights_json, ai_json, created_at

## Minimal Security / Anti-Abuse
- Token unguessable (random)
- Rate limiting: submit + report
- Input validation: score 1–5, free_text max length
- Auto-delete nach 30 Tagen (DB cleanup job later)

## Erweiterbarkeit (Post-MVP)
- PDF export
- Email an User
- n8n Workflow: CRM push + followup sequences
- Auth / dashboard
- Mehrsprachigkeit
- Fragen-Versionierung
