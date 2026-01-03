# Supabase SQL Schema (MVP)

> Copy & Run im Supabase SQL Editor

```sql
-- Extensions (optional)
create extension if not exists pgcrypto;

-- 1) audit_sessions
create table if not exists public.audit_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  token text not null unique,
  status text not null default 'started', -- 'started' | 'submitted'
  name text,
  email text,
  company text,
  phone text,
  ip_hash text
);

create index if not exists idx_audit_sessions_token on public.audit_sessions(token);
create index if not exists idx_audit_sessions_created_at on public.audit_sessions(created_at);

-- 2) audit_answers
create table if not exists public.audit_answers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id uuid not null references public.audit_sessions(id) on delete cascade,
  question_id text not null,
  axis text not null,
  score int not null check (score between 1 and 5),
  free_text text
);

create index if not exists idx_audit_answers_session_id on public.audit_answers(session_id);
create index if not exists idx_audit_answers_question_id on public.audit_answers(question_id);

-- One answer per question per session (upsert friendly)
create unique index if not exists uq_audit_answers_session_question
on public.audit_answers(session_id, question_id);

-- 3) audit_reports
create table if not exists public.audit_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id uuid not null unique references public.audit_sessions(id) on delete cascade,
  scores_json jsonb not null,
  insights_json jsonb not null,
  ai_json jsonb not null
);

create index if not exists idx_audit_reports_session_id on public.audit_reports(session_id);

-- Cleanup helper (run manually in MVP; later schedule)
-- Deletes sessions older than 30 days + cascades answers/reports
-- (only deletes if created_at older than 30 days)
-- run:
-- delete from public.audit_sessions where created_at < now() - interval '30 days';
