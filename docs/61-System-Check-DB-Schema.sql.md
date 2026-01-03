# Supabase Setup (Step-by-step für Anfänger)

## 1) Supabase Account & Projekt
1. Gehe zu Supabase und logge dich ein.
2. Klick: "New project"
3. Name: z.B. "founder-website-mvp"
4. Database Password setzen und speichern (Passwort Manager).
5. Region: möglichst nahe (EU/CH).
6. Projekt erstellen.

Warte bis Status "Healthy" oder "Ready" ist.

## 2) SQL Editor öffnen
1. Links im Menü: "SQL Editor"
2. "New query"

## 3) Tabellen erstellen (Schema ausführen)
- Öffne docs/62-System-Check-DB-Schema.sql.md
- Copy alles in Supabase SQL Editor
- Run

## 4) Keys & URL holen (für .env.local)
1. Links: "Project Settings" (Zahnrad)
2. "API"
3. Kopiere:
   - Project URL => SUPABASE_URL
   - service_role key => SUPABASE_SERVICE_ROLE_KEY
     (Wichtig: NICHT im Client verwenden, nur server-side)

## 5) (Optional) Table View prüfen
1. Links: "Table Editor"
2. Du solltest sehen:
   - audit_sessions
   - audit_answers
   - audit_reports

## 6) Test: Session manuell anlegen (optional)
In "Table Editor" -> audit_sessions -> Insert row
- token: "test"
- status: "started"
Speichern
Wenn das geht, DB ist ok.

## 7) Auto-delete nach 30 Tagen (MVP easy mode)
Im MVP machen wir es simpel:
- Wir bauen eine Server-Route oder Script, das bei Bedarf cleanup ausführt,
- Später: Supabase scheduled jobs / cron.

SQL für cleanup ist im Schema doc enthalten.

## 8) Sicherheit / RLS (MVP)
Für MVP:
- Wir verwenden server-side Service Role Key (admin client).
- RLS kann AN sein, weil Service Role bypassed RLS.
- Wichtig: Niemals service_role key ins Frontend leaken.

Später, wenn Public Reads erlaubt werden sollen, machen wir richtige RLS Policies.
