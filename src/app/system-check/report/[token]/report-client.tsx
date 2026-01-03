"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
} from "recharts";
import Nav from "@/components/Nav";

type ApiPayload = any;

export default function ReportClient({ token }: { token: string }) {
  const [data, setData] = useState<ApiPayload | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setErr(null);
        const res = await fetch(`/api/system-check/report?token=${token}`);
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.error || `Fetch failed: ${res.status}`);
        setData(json);
      } catch (e: any) {
        setErr(e.message || "Failed to load report");
      }
    })();
  }, [token]);

  if (err) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-neutral-50">
        <Nav />
        <main className="mx-auto max-w-3xl px-6 pt-44 pb-32">
          <h1 className="text-2xl font-semibold">Report</h1>
          <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-4 text-sm text-red-400 flex items-center gap-3">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {err}
          </div>
          <p className="mt-6 text-sm text-neutral-500">
            Sollte der Report gerade erst erzeugt worden sein, laden Sie die Seite bitte in einigen Sekunden neu.
          </p>
        </main>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-neutral-50">
        <Nav />
        <main className="mx-auto max-w-3xl px-6 pt-44 pb-32">
          <div className="flex items-center gap-3 text-neutral-400">
            <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
            Lade Report-Daten…
          </div>
        </main>
      </div>
    );
  }

  const axisScoresArr = data.report?.scores_json?.axisScores?.axisScores ?? data.report?.scores_json?.axisScores ?? [];

  const radarData = (axisScoresArr ?? []).map((a: any) => ({
    axis: a.label,
    score: a.score_0_100,
  }));

  const insights = data.report?.insights_json;
  const ai = data.report?.ai_json;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-50 font-sans">
      <Nav onOpenCalendly={() => {}} />

      <main className="relative pt-44 pb-32 px-6 overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-[#0a0a0a]"></div>
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/3 rounded-full blur-[100px]"></div>

        <div className="relative mx-auto max-w-5xl w-full space-y-20">
          {/* Header */}
          <div className="space-y-4">
            <div className="inline-block">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-500/80 border-b border-amber-500/30 pb-1">
                Analyse-Ergebnis
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-50">System-Check Report</h1>
            <p className="text-sm text-neutral-500 font-mono">ID: {token}</p>
          </div>

          {/* Radar Chart Section */}
          <section className="rounded-2xl border border-white/5 bg-[#111111] p-8 md:p-12 transition-all hover:border-amber-500/10">
            <div className="grid lg:grid-cols-[1fr_300px] gap-12 items-center">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#333" />
                    <PolarAngleAxis 
                      dataKey="axis" 
                      tick={{ fill: '#999', fontSize: 10, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]} 
                      tick={false}
                      axisLine={false}
                    />
                    <Radar
                      name="System-Score"
                      dataKey="score"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 border-b border-white/5 pb-4">Werte nach Achsen</h2>
                <div className="space-y-4">
                  {(insights?.axis_scores ?? axisScoresArr).map((a: any) => (
                    <div key={a.label} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-500 uppercase tracking-tighter">{a.label}</span>
                        <span className="font-mono text-amber-500">{a.score_0_100}%</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500/50" 
                          style={{ width: `${a.score_0_100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Ebene 1: Analytische Einordnung */}
          <div className="grid md:grid-cols-2 gap-8">
            <section className="rounded-2xl border border-white/5 bg-[#111111] p-8 space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-amber-500">Stärken</h2>
              <ul className="space-y-4">
                {(insights?.strengths ?? []).map((s: any, i: number) => (
                  <li key={i} className="flex gap-4 group">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-neutral-200">{s.label}</div>
                      <div className="text-xs text-neutral-500 font-light italic">Systemischer Ankerpunkt ({s.score_0_100}%)</div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-white/5 bg-[#111111] p-8 space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-amber-600">Hebel</h2>
              <ul className="space-y-4">
                {(insights?.levers ?? []).map((s: any, i: number) => (
                  <li key={i} className="flex gap-4">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-600 shrink-0 shadow-[0_0_8px_rgba(217,119,6,0.4)]"></span>
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-neutral-200">{s.label}</div>
                      <div className="text-xs text-neutral-500 font-light italic">Entwicklungspotenzial ({s.score_0_100}%)</div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Spannungen */}
          <section className="rounded-2xl border border-white/5 bg-[#111111] p-8 space-y-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400">Systemische Spannungen</h2>
            <div className="grid gap-4">
              {(insights?.tensions ?? []).map((t: any, i: number) => (
                <div key={i} className="group p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:border-amber-500/20 transition-all">
                  <div className="text-base font-semibold text-neutral-200 mb-2">{t.title}</div>
                  <div className="text-sm text-neutral-400 font-light leading-relaxed">{t.text}</div>
                </div>
              ))}
              {(insights?.tensions ?? []).length === 0 && (
                <div className="text-sm text-neutral-500 italic">Keine unmittelbaren strukturellen Spannungen erkannt.</div>
              )}
            </div>
          </section>

          {/* KI Analyse Ebenen */}
          <section className="space-y-16">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-500/80 border-b border-amber-500/30 pb-1">
                  Ebene 2 — Vertiefung
                </span>
              </div>
              
              <div className="grid gap-12">
                <div className="space-y-6">
                  <h2 className="text-2xl font-medium text-neutral-100">Gesamtbild</h2>
                  <div className="prose prose-invert prose-sm max-w-none text-neutral-400 font-light leading-relaxed prose-headings:text-neutral-200 prose-strong:text-amber-500/90 prose-p:mb-4">
                    <ReactMarkdown>{ai?.summary_md ?? ""}</ReactMarkdown>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-2xl font-medium text-neutral-100">Dynamiken & Widersprüche</h2>
                  <div className="prose prose-invert prose-sm max-w-none text-neutral-400 font-light leading-relaxed prose-headings:text-neutral-200 prose-strong:text-amber-500/90 prose-p:mb-4">
                    <ReactMarkdown>{ai?.tensions_md ?? ""}</ReactMarkdown>
                  </div>
                </div>

                <div className="space-y-6 p-8 rounded-2xl bg-amber-500/[0.03] border border-amber-500/10">
                  <h2 className="text-2xl font-medium text-amber-500/90">Quick Wins</h2>
                  <div className="prose prose-invert prose-sm max-w-none text-neutral-400 font-light leading-relaxed prose-headings:text-neutral-200 prose-strong:text-amber-500/90 prose-p:mb-4">
                    <ReactMarkdown>{ai?.quick_wins_md ?? ""}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8 pt-16 border-t border-white/5">
              <div className="inline-block">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-500/80 border-b border-amber-500/30 pb-1">
                  Ebene 3 — Reflexion
                </span>
              </div>
              <div className="space-y-6">
                <h2 className="text-2xl font-medium text-neutral-100">Fragen zur Organisationsentwicklung</h2>
                <div className="prose prose-invert prose-sm max-w-none text-neutral-400 font-light leading-relaxed prose-headings:text-neutral-200 prose-strong:text-amber-500/90 prose-p:mb-4">
                  <ReactMarkdown>{ai?.reflection_questions_md ?? ""}</ReactMarkdown>
                </div>
              </div>
            </div>
          </section>

          <footer className="pt-12 border-t border-white/5 text-center">
            <p className="text-xs text-neutral-600 font-light leading-relaxed max-w-2xl mx-auto">
              Dieser Report wurde automatisiert auf Basis Ihrer Selbsteinschätzung erstellt. 
              Er dient der systemischen Reflexion und ersetzt keine professionelle Organisationsberatung.
              Alle Daten werden nach 30 Tagen gelöscht.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
