"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { QuestionsConfig, Question } from "@/lib/system-check/types";
import Nav from "@/components/Nav";

type AnswerState = {
  score?: number;      // 1..5
  free_text?: string;  // optional
};

async function postJson(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || `Request failed: ${res.status}`);
  return json;
}

export default function SystemCheckWizard({ config }: { config: QuestionsConfig }) {
  const router = useRouter();
  const sp = useSearchParams();

  const [token, setToken] = useState<string | null>(sp.get("token"));
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questions = config.questions;
  const q: Question = questions[index];

  // Start session if no token in URL
  useEffect(() => {
    const t = sp.get("token");
    if (t) return;

    (async () => {
      try {
        setBusy(true);
        const { token } = await postJson("/api/system-check/start", {});
        setToken(token);
        router.replace(`/system-check/run?token=${token}`);
      } catch (e: any) {
        setError(e.message || "Start failed");
      } finally {
        setBusy(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = answers[q?.id] ?? {};

  const progress = useMemo(() => {
    const answered = Object.values(answers).filter(a => typeof a.score === "number").length;
    return { answered, total: questions.length };
  }, [answers, questions.length]);

  async function setScore(score: number) {
    if (busy) return; // Prevent multiple clicks
    
    // Update score immediately for visual feedback
    setAnswers(prev => ({ ...prev, [q.id]: { ...prev[q.id], score } }));
    
    // Auto-advance only if there's no free text field (user can still go back if needed)
    if (!q.freeTextEnabled) {
      // Auto-advance after a short delay (gives visual feedback)
      setTimeout(async () => {
        try {
          setError(null);
          setBusy(true);
          
          // Persist the answer
          if (!token) return;
          await postJson("/api/system-check/answer", {
            token,
            question_id: q.id,
            score,
            free_text: null,
          });
          
          // Move to next question
          setIndex(i => Math.min(i + 1, questions.length));
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (e: any) {
          setError(e.message || "Save failed");
        } finally {
          setBusy(false);
        }
      }, 300); // 300ms delay for visual feedback
    }
    // If freeTextEnabled, user can still click "Weiter" manually after entering text
  }

  function setFreeText(v: string) {
    setAnswers(prev => ({ ...prev, [q.id]: { ...prev[q.id], free_text: v } }));
  }

  async function persistCurrent() {
    if (!token) throw new Error("Missing token");
    if (typeof current.score !== "number") throw new Error("Bitte eine Antwort wählen.");

    await postJson("/api/system-check/answer", {
      token,
      question_id: q.id,
      score: current.score,
      free_text: q.freeTextEnabled ? (current.free_text ?? null) : null,
    });
  }

  async function next() {
    try {
      setError(null);
      setBusy(true);
      await persistCurrent();
      setIndex(i => Math.min(i + 1, questions.length)); // allow end state
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      setError(e.message || "Save failed");
    } finally {
      setBusy(false);
    }
  }

  function back() {
    setError(null);
    setIndex(i => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // End screen (contact + submit)
  const isDone = index >= questions.length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-50">
      <Nav />

      <main className="relative pt-44 pb-32 px-6 overflow-hidden min-h-screen flex flex-col">
        {/* Subtle background atmosphere */}
        <div className="absolute inset-0 bg-[#0a0a0a]"></div>
        <div className="absolute top-[20%] left-[-10%] w-[60%] h-[60%] bg-amber-500/5 rounded-full blur-[120px]"></div>

        <div className="relative mx-auto max-w-3xl w-full flex-1 flex flex-col">
          {/* Header & Progress */}
          <div className="mb-16">
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-500/80 mb-1">
                  System-Check
                </div>
                <h1 className="text-2xl font-semibold tracking-tight">
                  {isDone ? "Abschluss" : axisLabel(config, q.axis)}
                </h1>
              </div>
              <div className="text-[11px] uppercase tracking-widest text-neutral-500 font-bold">
                {isDone ? "Fertig" : `${index + 1} von ${questions.length}`}
              </div>
            </div>
            
            <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-amber-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                style={{ width: `${Math.round((Math.min(progress.answered, questions.length) / questions.length) * 100)}%` }}
              />
            </div>
          </div>

          {error && (
            <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-4 text-sm text-red-400 flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {!token && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-neutral-400 font-light flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
                {busy ? "Initialisiere Session…" : "Verbindung wird aufgebaut…"}
              </div>
            </div>
          )}

          {token && !isDone && (
            <section className="flex-1 flex flex-col">
              <div className="flex-1 space-y-12">
                <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-neutral-50 leading-tight">
                  {q.text}
                </h2>

                <div className="space-y-8">
                  <div className="grid grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setScore(v)}
                        className={`
                          group relative h-20 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-1
                          ${current.score === v 
                            ? "bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]" 
                            : "bg-[#111111] border-white/5 text-neutral-500 hover:border-white/10 hover:text-neutral-300"}
                        `}
                        disabled={busy}
                      >
                        <span className="text-2xl font-bold">{v}</span>
                        {current.score === v && (
                          <div className="absolute inset-0 rounded-2xl bg-amber-500/5 animate-pulse"></div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-neutral-600 px-1">
                    <span>trifft gar nicht zu</span>
                    <span>trifft voll zu</span>
                  </div>
                </div>

                {q.freeTextEnabled && (
                  <div className="pt-8 border-t border-white/5">
                    <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500 mb-4">
                      {q.freeTextPrompt || "Ergänzender Kontext (optional)"}
                    </div>
                    <textarea
                      className="w-full bg-[#111111] rounded-2xl border border-white/5 p-6 text-base text-neutral-200 focus:outline-none focus:border-amber-500/30 transition-colors placeholder:text-neutral-700"
                      rows={4}
                      value={current.free_text ?? ""}
                      onChange={(e) => setFreeText(e.target.value)}
                      placeholder="Was ist hier wichtig zu wissen?"
                      disabled={busy}
                    />
                  </div>
                )}
              </div>

              <div className="mt-16 flex items-center justify-between pt-8 border-t border-white/5">
                <button
                  type="button"
                  onClick={back}
                  className="px-8 py-3 text-[11px] uppercase tracking-widest font-bold text-neutral-500 hover:text-neutral-50 transition-colors disabled:opacity-0"
                  disabled={busy || index === 0}
                >
                  Zurück
                </button>

                {/* Manual "Weiter" Button - nur sichtbar wenn bereits eine Auswahl getroffen wurde, aber noch nicht auto-advanced */}
                {typeof current.score === "number" && !busy && (
                  <button
                    type="button"
                    onClick={next}
                    className="group relative inline-flex items-center rounded-full glass border border-amber-500/20 px-10 py-4 text-sm font-bold text-neutral-50 transition-all hover:border-amber-500/50 hover:bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                  >
                    <span className="relative z-10">Weiter</span>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                )}
                
                {/* Loading indicator während auto-advance */}
                {busy && (
                  <div className="flex items-center gap-3 text-sm text-neutral-400">
                    <div className="h-4 w-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Speichere…</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {token && isDone && <SubmitScreen token={token} config={config} />}
        </div>
      </main>
    </div>
  );
}

function axisLabel(cfg: QuestionsConfig, axisId: any) {
  return cfg.axes.find(a => a.id === axisId)?.label ?? String(axisId);
}

function SubmitScreen({ token, config }: { token: string; config: QuestionsConfig }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");

  async function submit() {
    try {
      setErr(null);
      setBusy(true);

      const res = await fetch("/api/system-check/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, name, email, company, phone }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || `Submit failed: ${res.status}`);

      router.push(`/system-check/report/${token}`);
    } catch (e: any) {
      setErr(e.message || "Submit failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="flex-1 flex flex-col space-y-12">
      <div className="space-y-6">
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-neutral-50 leading-tight">
          Alle Fragen beantwortet.
        </h2>
        <p className="text-lg text-neutral-400 font-light leading-relaxed max-w-2xl">
          Das System erzeugt nun Ihren persönlichen Report. 
          Wenn Sie möchten, können Sie unten Kontaktinformationen angeben – dies ist jedoch rein optional.
        </p>
        <div className="mt-6 p-6 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <p className="text-sm text-neutral-300 leading-relaxed">
            <strong className="text-amber-500/90">Hinweis:</strong> Die Analyse und Erstellung Ihres Reports kann einige Sekunden bis zu einer Minute dauern. Bitte haben Sie einen Moment Geduld – Sie werden automatisch zum Ergebnis weitergeleitet.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 pt-8 border-t border-white/5">
        <div className="space-y-4">
          <div className="group relative">
            <input 
              className="w-full bg-[#111111] rounded-xl border border-white/5 p-4 text-sm text-neutral-200 focus:outline-none focus:border-amber-500/30 transition-colors placeholder:text-neutral-700" 
              placeholder="Ihr Name (optional)" 
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
          </div>
          <div className="group relative">
            <input 
              className="w-full bg-[#111111] rounded-xl border border-white/5 p-4 text-sm text-neutral-200 focus:outline-none focus:border-amber-500/30 transition-colors placeholder:text-neutral-700" 
              placeholder="E-Mail Adresse (optional)" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="group relative">
            <input 
              className="w-full bg-[#111111] rounded-xl border border-white/5 p-4 text-sm text-neutral-200 focus:outline-none focus:border-amber-500/30 transition-colors placeholder:text-neutral-700" 
              placeholder="Firma (optional)" 
              value={company} 
              onChange={e => setCompany(e.target.value)} 
            />
          </div>
          <div className="group relative">
            <input 
              className="w-full bg-[#111111] rounded-xl border border-white/5 p-4 text-sm text-neutral-200 focus:outline-none focus:border-amber-500/30 transition-colors placeholder:text-neutral-700" 
              placeholder="Telefonnummer (optional)" 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
            />
          </div>
        </div>
      </div>

      {err && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-4 text-sm text-red-400 flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {err}
        </div>
      )}

      <div className="flex flex-col items-center gap-6 pt-12 border-t border-white/5">
        <button
          type="button"
          onClick={submit}
          className="group relative inline-flex items-center rounded-full glass border border-amber-500/20 px-16 py-5 text-sm font-bold text-neutral-50 transition-all hover:border-amber-500/50 hover:bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:shadow-[0_0_40px_rgba(245,158,11,0.2)] disabled:opacity-50 disabled:cursor-wait"
          disabled={busy}
        >
          {busy ? (
            <>
              <div className="h-4 w-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="relative z-10">Analysiere Systemfähigkeit…</span>
            </>
          ) : (
            <span className="relative z-10">Report erzeugen</span>
          )}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
        
        <p className="text-xs text-neutral-600 font-light text-center max-w-sm">
          Hinweis: Ihre Daten werden im Rahmen der MVP-Policy nach 30 Tagen gelöscht. 
          Der Report basiert auf Ihren Selbsteinschätzungen.
        </p>
      </div>
    </section>
  );
}
