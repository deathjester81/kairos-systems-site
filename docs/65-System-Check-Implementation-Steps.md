
## docs/65-System-Check-Implementation-Steps.md
```md
# System-Check MVP Implementation – Step by Step (Cursor SOP)

## Phase 1: Config & Types
1) Erstelle src/lib/system-check/types.ts (Axis enum, Question type, Report type)
2) Erstelle src/lib/system-check/system-check.config.ts (Limits, thresholds, mapping)
3) Erstelle src/lib/system-check/questions.v1.json (aus docs/63)

Ziel: Fragen & Regeln sind NICHT im UI hardcoded.

## Phase 2: Supabase admin client
4) Erstelle src/lib/supabase/admin.ts (createClient mit service role key)
5) Env Vars in .env.local setzen:
   - SUPABASE_URL=
   - SUPABASE_SERVICE_ROLE_KEY=
   - OPENAI_API_KEY=
   - RESEND_API_KEY=
   - INTERNAL_NOTIFY_EMAIL=

## Phase 3: API Routes
6) POST /api/system-check/start
   - create session row (token random)
   - return { token }

7) POST /api/system-check/answer
   - input: token, question_id, score, free_text?
   - validate score 1..5, free_text length cap
   - lookup session by token
   - upsert into audit_answers (session_id, question_id)

8) POST /api/system-check/submit
   - input: token, optional contact fields (name,email,company,phone)
   - validate
   - load all answers for session
   - compute axis scores + deterministic insights
   - call AI (GPT-5.2) -> ai_json
   - save audit_reports
   - update session status submitted + contact fields
   - send internal notification email

9) GET /api/system-check/report?token=
   - load session + report (by token)
   - return JSON payload for report page

## Phase 4: Wizard UI
10) /system-check (Landing page)
    - explain is/is-not
    - start button -> call start -> push /system-check/run?token=...

11) /system-check/run (Wizard)
    - load questions from questions.v1.json
    - 1 question per screen
    - on answer: call /answer immediately (upsert)
    - allow back/next
    - progress indicator
    - at end: contact form (optional email in MVP)
    - submit -> call /submit -> redirect to /system-check/report/[token]

## Phase 5: Report UI
12) /system-check/report/[token]
    - fetch /api/system-check/report?token=...
    - render:
      - Radar chart (Recharts)
      - Ebene 1 blocks (deterministic)
      - Ebene 2+3 blocks (AI)
    - footer disclaimer

## Phase 6: Minimal Abuse Protection
13) Rate limit submit + report routes (simple in-memory or DB-based)
14) token random, long enough (>= 32 bytes)
15) validation everywhere

## Phase 7: Manual QA
16) Happy path: complete wizard, see report
17) Reload mid wizard: answers preserved (because upsert per step)
18) Submit without email: still works, internal mail says "no email provided"
19) Token invalid -> 404 page
20) Free_text over limit -> error message
