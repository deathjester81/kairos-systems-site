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
  const [additionalFeedback, setAdditionalFeedback] = useState<string>("");
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
    if (busy) return; 
    
    setAnswers(prev => ({ ...prev, [q.id]: { ...prev[q.id], score } }));
    
    // Alle Fragen 1-30: Auto-advance nach Klick (keine Freitext-Felder mehr)
    setBusy(true); // Lock immediately to prevent multiple clicks skipping questions
    setTimeout(async () => {
      try {
        setError(null);
        
        if (!token) {
          setBusy(false);
          return;
        }

        await postJson("/api/system-check/answer", {
          token,
          question_id: q.id,
          score,
          free_text: null,
        });
        
        setIndex(i => Math.min(i + 1, questions.length));
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (e: any) {
        setError(e.message || "Save failed");
      } finally {
        setBusy(false);
      }
    }, 400); 
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
      setIndex(i => Math.min(i + 1, questions.length)); 
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: any) {
      setError(e.message || "Save failed");
    } finally {
      setBusy(false);
    }
  }

  function back() {
    setError(null);
    // Wenn wir auf dem Freitext-Screen sind (index === questions.length), zurück zur letzten Frage
    if (index === questions.length) {
      setIndex(questions.length - 1);
    } else {
      setIndex(i => Math.max(i - 1, 0));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const isDone = index >= questions.length;
  const isOnFeedbackScreen = index === questions.length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-50 selection:bg-amber-500/30">
      <Nav />

      <main className="relative pt-32 pb-32 px-6 overflow-hidden min-h-screen flex flex-col">
        {/* Tech Background */}
        <div className="absolute inset-0 bg-[#0a0a0a]"></div>
        <div className="absolute top-[20%] left-[-10%] w-[60%] h-[60%] bg-amber-500/5 rounded-full blur-[120px]"></div>
        
        <div className="relative mx-auto max-w-6xl w-full flex-1 flex flex-col lg:flex-row gap-16">
          
          {/* Left Side: Progress & Context */}
          <div className="lg:w-72 shrink-0 space-y-10">
            <div className="space-y-4">
              <div className="text-[10px] uppercase tracking-[0.4em] font-black text-amber-500/80">
                Audit Progress
              </div>
              <div className="relative h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-amber-500 transition-all duration-700 ease-in-out shadow-[0_0_15px_rgba(245,158,11,0.6)]"
                  style={{ width: `${isOnFeedbackScreen ? 100 : Math.round((Math.min(progress.answered, questions.length) / questions.length) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-lg font-bold tracking-tighter text-neutral-50">
                  {isOnFeedbackScreen ? 100 : Math.round((Math.min(progress.answered, questions.length) / questions.length) * 100)}%
                </span>
                <span className="text-[8px] uppercase tracking-widest text-neutral-400 font-bold">
                  {isOnFeedbackScreen ? `${questions.length} / ${questions.length}` : `${index + 1} / ${questions.length}`}
                </span>
              </div>
            </div>

            {!isDone && !isOnFeedbackScreen && (
              <div className="hidden lg:block space-y-8 animate-in fade-in slide-in-from-left-4 duration-1000">
                <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] space-y-2">
                  <div className="text-[8px] uppercase tracking-[0.2em] font-bold text-neutral-400">Kategorie</div>
                  <div className="text-xs font-semibold text-neutral-300 tracking-tight italic">{axisLabel(config, q?.axis)}</div>
                </div>
                
                <div className="px-5 text-[10px] text-neutral-400 leading-relaxed font-bold tracking-[0.2em] uppercase">
                  Audit-Modus
                </div>
              </div>
            )}

            {isOnFeedbackScreen && (
              <div className="hidden lg:block space-y-8 animate-in fade-in slide-in-from-left-4 duration-1000">
                <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] space-y-2">
                  <div className="text-[8px] uppercase tracking-[0.2em] font-bold text-amber-500/60">Zusätzlicher Input</div>
                  <div className="text-xs font-semibold text-neutral-300 tracking-tight italic">Optional</div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Questions */}
          <div className="flex-1 flex flex-col max-w-3xl">
            {error && (
              <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-4 text-[10px] text-red-400 flex items-center gap-3 animate-in fade-in zoom-in-95">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {!token && (
              <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                  <div className="h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-neutral-400 font-bold text-[8px] uppercase tracking-[0.4em]">
                    Initialisiere Audit-Sitzung…
                  </div>
                </div>
              </div>
            )}

            {token && !isDone && !isOnFeedbackScreen && (
              <section className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex-1 space-y-12">
                  <h2 className="text-xl md:text-2xl font-medium tracking-tight text-neutral-50 leading-[1.4]">
                    {q.text}
                  </h2>

                  <div className="space-y-10">
                    <div className="grid grid-cols-5 gap-3 sm:gap-4">
                      {[1, 2, 3, 4, 5].map(v => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setScore(v)}
                          className={`
                            group relative aspect-square sm:h-16 sm:w-auto rounded-xl border transition-all duration-500 flex flex-col items-center justify-center gap-1
                            ${current.score === v 
                              ? "bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.15)] scale-105" 
                              : "bg-[#111111]/20 border-white/10 text-neutral-400 hover:border-white/15 hover:text-neutral-300 hover:bg-[#1a1a1a]"}
                          `}
                          disabled={busy}
                        >
                          <span className={`text-base sm:text-lg font-black tracking-tighter transition-transform duration-500 ${current.score === v ? 'scale-110' : 'group-hover:scale-110'}`}>
                            {v}
                          </span>
                          {current.score === v && (
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-between text-[8px] uppercase tracking-[0.3em] font-black text-neutral-500 px-2">
                      <span className="flex items-center gap-3">
                        <span className="h-px w-4 bg-neutral-600"></span> trifft nicht zu
                      </span>
                      <span className="flex items-center gap-3 text-right">
                        trifft voll zu <span className="h-px w-4 bg-neutral-600"></span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-16 flex items-center justify-between pt-6 border-t border-white/10">
                  <button
                    type="button"
                    onClick={back}
                    className="px-6 py-3 text-[9px] uppercase tracking-[0.3em] font-black text-neutral-500 hover:text-neutral-300 transition-colors disabled:opacity-0"
                    disabled={busy || index === 0}
                  >
                    Zurück
                  </button>

                  {busy && (
                    <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.2em] font-black text-amber-500/40">
                      <div className="h-2 w-2 border-[1.5px] border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                      Saving
                    </div>
                  )}
                </div>
              </section>
            )}

            {token && isOnFeedbackScreen && (
              <FeedbackScreen 
                onBack={back}
                onContinue={() => setIndex(i => i + 1)}
                token={token}
                onFeedbackChange={setAdditionalFeedback}
              />
            )}

            {token && isDone && <SubmitScreen token={token} config={config} additionalFeedback={additionalFeedback} />}
          </div>
        </div>
      </main>
    </div>
  );
}

function axisLabel(cfg: QuestionsConfig, axisId: any) {
  return cfg.axes.find(a => a.id === axisId)?.label ?? String(axisId);
}

function FeedbackScreen({ onBack, onContinue, token, onFeedbackChange }: { onBack: () => void; onContinue: () => void; token: string; onFeedbackChange: (feedback: string) => void }) {
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinue() {
    if (busy) return;
    
    // Feedback im Parent-State speichern
    onFeedbackChange(feedback);
    onContinue();
  }

  function handleFeedbackChange(value: string) {
    setFeedback(value);
    // Live-Update im Parent
    onFeedbackChange(value);
  }

  return (
    <section className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex-1 space-y-12">
        <div className="space-y-6">
          <div className="inline-block">
            <span className="text-[10px] uppercase tracking-[0.4em] font-black text-amber-500/80 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
              Optional
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-neutral-50 leading-tight">
            Gibt es noch <span className="text-amber-500">Inputs</span>, die Sie dem System-Check mitgeben möchten?
          </h2>
          <p className="text-lg text-neutral-400 font-light leading-relaxed max-w-2xl">
            Falls Sie noch zusätzliche Kontexte, Besonderheiten oder Hinweise haben, die für die Analyse relevant sein könnten.
          </p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <textarea
              className="w-full bg-[#111111]/30 backdrop-blur-sm rounded-3xl border border-white/10 p-8 text-base text-neutral-300 font-light focus:outline-none focus:border-amber-500/30 transition-all placeholder:text-neutral-600 resize-none min-h-[200px] leading-relaxed"
              value={feedback}
              onChange={(e) => handleFeedbackChange(e.target.value)}
              placeholder="Zum Beispiel: Besondere Branchenanforderungen, aktuelle Herausforderungen, spezifische Kontexte, die für die Bewertung relevant sind…"
              disabled={busy}
            />
            <div className="absolute bottom-4 right-4 text-[9px] text-neutral-600 font-bold uppercase tracking-widest">
              {feedback.length > 0 && `${feedback.length} Zeichen`}
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-4 text-sm text-red-400 flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}
      </div>

      <div className="mt-16 flex items-center justify-between pt-6 border-t border-white/10">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 text-[9px] uppercase tracking-[0.3em] font-black text-neutral-500 hover:text-neutral-300 transition-colors"
          disabled={busy}
        >
          Zurück
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="group relative inline-flex items-center rounded-full bg-amber-500 px-10 py-4 text-sm font-black uppercase tracking-[0.2em] text-neutral-950 transition-all hover:bg-amber-400 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(245,158,11,0.3)] disabled:opacity-50 disabled:cursor-wait"
          disabled={busy}
        >
          <span className="relative z-10 flex items-center gap-3">
            Weiter zum Abschluss
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>
      </div>
    </section>
  );
}

function SubmitScreen({ token, config, additionalFeedback }: { token: string; config: QuestionsConfig; additionalFeedback?: string }) {
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
        body: JSON.stringify({ token, name, email, company, phone, additionalFeedback }),
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
    <section className="flex-1 flex flex-col space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="space-y-8">
        <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-neutral-50 leading-tight">
          Audit abgeschlossen.
        </h2>
        <div className="space-y-6 text-xl text-neutral-400 font-light leading-relaxed max-w-2xl">
          <p>
            Vielen Dank für Ihre Zeit. Unser System wertet Ihre Antworten nun aus und erstellt eine individuelle AI-Analyse Ihrer Systemfähigkeit.
          </p>
          <div className="p-8 rounded-3xl bg-amber-500/5 border border-amber-500/20 space-y-4">
            <div className="flex items-center gap-3 text-amber-500 font-bold text-xs uppercase tracking-[0.3em]">
              <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Rechenprozess läuft
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Die Analyse dauert ca. 30–60 Sekunden. Bitte lassen Sie dieses Fenster geöffnet, Sie werden automatisch zum Report weitergeleitet.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-12 pt-12 border-t border-white/10">
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-400">Kontakt (Optional)</h3>
          <p className="text-xs text-neutral-400">Wenn Sie den Report später per E-Mail erhalten möchten oder wir uns bei Ihnen melden sollen.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="group space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold ml-1">Name</label>
              <input 
                className="w-full bg-[#111111]/50 rounded-2xl border border-white/10 p-5 text-base text-neutral-200 focus:outline-none focus:border-amber-500/30 transition-all placeholder:text-neutral-600" 
                placeholder="Ihr Name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
              />
            </div>
            <div className="group space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold ml-1">E-Mail</label>
              <input 
                className="w-full bg-[#111111]/50 rounded-2xl border border-white/10 p-5 text-base text-neutral-200 focus:outline-none focus:border-amber-500/30 transition-all placeholder:text-neutral-600" 
                placeholder="email@beispiel.de" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="group space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold ml-1">Firma</label>
              <input 
                className="w-full bg-[#111111]/50 rounded-2xl border border-white/10 p-5 text-base text-neutral-200 focus:outline-none focus:border-amber-500/30 transition-all placeholder:text-neutral-600" 
                placeholder="Unternehmensname" 
                value={company} 
                onChange={e => setCompany(e.target.value)} 
              />
            </div>
            <div className="group space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold ml-1">Telefon</label>
              <input 
                className="w-full bg-[#111111]/50 rounded-2xl border border-white/10 p-5 text-base text-neutral-200 focus:outline-none focus:border-amber-500/30 transition-all placeholder:text-neutral-600" 
                placeholder="+41 00 000 00 00" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
              />
            </div>
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

      <div className="flex flex-col items-center gap-10 pt-16 border-t border-white/10">
        <button
          type="button"
          onClick={submit}
          className="group relative inline-flex items-center rounded-full bg-amber-500 px-20 py-6 text-sm font-black uppercase tracking-[0.2em] text-neutral-950 transition-all hover:bg-amber-400 hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(245,158,11,0.3)] disabled:opacity-50 disabled:cursor-wait"
          disabled={busy}
        >
          {busy ? (
            <span className="flex items-center gap-4">
              <div className="h-4 w-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin"></div>
              Report wird erzeugt…
            </span>
          ) : (
            <span className="relative z-10">Report jetzt anzeigen</span>
          )}
        </button>
        
        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-[0.2em] text-center max-w-sm">
          MVP Policy: Datenlöschung nach 30 Tagen.
        </p>
      </div>
    </section>
  );
}
