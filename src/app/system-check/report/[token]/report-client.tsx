"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer,
} from "recharts";
import Nav from "@/components/Nav";
import FadeOnScroll from "@/components/FadeOnScroll";

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
      <div className="min-h-screen bg-[#0a0a0a] text-neutral-50 selection:bg-amber-500/30">
        <Nav />
        <main className="mx-auto max-w-3xl px-6 pt-44 pb-32 flex flex-col items-center text-center">
          <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-8">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-4">Analyse fehlgeschlagen</h1>
          <p className="text-neutral-400 mb-8 max-w-md">{err}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-white text-black rounded-full text-sm font-bold hover:bg-amber-400 transition-colors"
          >
            Erneut versuchen
          </button>
        </main>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-neutral-50">
        <Nav />
        <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="relative h-24 w-24 mb-12">
            <div className="absolute inset-0 border-2 border-amber-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-4 bg-amber-500/10 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-bold uppercase tracking-[0.4em] text-amber-500">Analysiere Daten</h2>
            <p className="text-neutral-500 text-sm max-w-xs mx-auto leading-relaxed">
              Systemische Zusammenhänge werden berechnet. AI-Modell generiert Report-Struktur…
            </p>
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
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-50 font-sans selection:bg-amber-500/30">
      <Nav onOpenCalendly={() => {}} />

      <main className="relative pt-44 pb-44 px-6 overflow-hidden">
        {/* Technical Background */}
        <div className="absolute inset-0 bg-[#0a0a0a]"></div>
        <div className="absolute top-[5%] right-[-10%] w-[60%] h-[60%] bg-amber-500/5 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-[-5%] left-[-10%] w-[50%] h-[50%] bg-amber-600/3 rounded-full blur-[120px]"></div>
        
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
          style={{ 
            backgroundImage: `linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)`,
            backgroundSize: '100px 100px' 
          }}>
        </div>

        <div className="relative mx-auto max-w-6xl w-full space-y-32">
          
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-6 max-w-2xl">
              <div className="inline-block">
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-amber-500 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
                  Systemic Performance Report
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-50 leading-none">
                Ihr <span className="text-amber-500">System</span> Status.
              </h1>
              <p className="text-xl text-neutral-400 font-light leading-relaxed">
                Basierend auf Ihrer Selbsteinschätzung zeigt dieser Report die strukturelle Reife und systemische Belastbarkeit Ihres Unternehmens.
              </p>
            </div>
            
            <div className="shrink-0 flex flex-col items-start md:items-end gap-2 text-neutral-600 font-mono text-[10px] uppercase tracking-widest">
              <div>Session ID: <span className="text-neutral-400">{token.slice(0, 12)}...</span></div>
              <div>Generated: <span className="text-neutral-400">{new Date().toLocaleDateString('de-CH')}</span></div>
            </div>
          </header>

          {/* Radar & Summary Grid */}
          <div className="grid lg:grid-cols-2 gap-12">
            <FadeOnScroll className="rounded-[2.5rem] border border-white/5 bg-[#111111]/40 backdrop-blur-xl p-8 md:p-12 transition-all hover:border-amber-500/10 group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[60px] rounded-full"></div>
              
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-12 flex items-center gap-3">
                <span className="h-px w-4 bg-neutral-800"></span> System-Profil
              </h2>
              
              <div className="h-[450px] w-full -mx-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#222" />
                    <PolarAngleAxis 
                      dataKey="axis" 
                      tick={{ fill: '#666', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}
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
                      strokeWidth={3}
                      fill="#f59e0b"
                      fillOpacity={0.25}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </FadeOnScroll>

            <div className="space-y-6">
              <FadeOnScroll className="rounded-[2.5rem] border border-white/5 bg-[#111111]/40 backdrop-blur-xl p-12 space-y-8 h-full">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 flex items-center gap-3">
                  <span className="h-px w-4 bg-neutral-800"></span> Analytische Matrix
                </h2>
                
                <div className="space-y-8">
                  {(insights?.axis_scores ?? axisScoresArr).map((a: any) => (
                    <div key={a.label} className="space-y-3 group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest group-hover:text-neutral-200 transition-colors">{a.label}</span>
                        <span className="font-mono text-sm text-amber-500 font-black">{a.score_0_100}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000 ease-out" 
                          style={{ width: `${a.score_0_100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-white/5">
                  <p className="text-xs text-neutral-500 leading-relaxed font-light italic">
                    Ein ausgeglichenes Profil deutet auf hohe systemische Stabilität hin. Ausreißer nach unten sind kritische Engpässe.
                  </p>
                </div>
              </FadeOnScroll>
            </div>
          </div>

          {/* Strengths & Levers */}
          <div className="grid md:grid-cols-2 gap-12">
            <FadeOnScroll className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-neutral-200 uppercase tracking-tighter">Ihre System-Anker</h2>
              </div>
              
              <div className="grid gap-6">
                {(insights?.strengths ?? []).map((s: any, i: number) => (
                  <div key={i} className="p-8 rounded-[2rem] border border-white/5 bg-[#111111]/30 hover:bg-[#111111]/50 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-lg font-bold text-neutral-100 group-hover:text-emerald-500 transition-colors">{s.label}</div>
                      <div className="text-xs font-mono text-emerald-500/50">{s.score_0_100}%</div>
                    </div>
                    <div className="text-sm text-neutral-500 font-light leading-relaxed">
                      Dieses Element stabilisiert Ihr Unternehmen heute massgeblich. Es ist das Fundament für Skalierung.
                    </div>
                  </div>
                ))}
              </div>
            </FadeOnScroll>

            <FadeOnScroll className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-neutral-200 uppercase tracking-tighter">Entwicklungshebel</h2>
              </div>
              
              <div className="grid gap-6">
                {(insights?.levers ?? []).map((s: any, i: number) => (
                  <div key={i} className="p-8 rounded-[2rem] border border-white/5 bg-[#111111]/30 hover:bg-[#111111]/50 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-lg font-bold text-neutral-100 group-hover:text-amber-500 transition-colors">{s.label}</div>
                      <div className="text-xs font-mono text-amber-500/50">{s.score_0_100}%</div>
                    </div>
                    <div className="text-sm text-neutral-500 font-light leading-relaxed">
                      Hier verliert Ihr System heute Energie. Eine Optimierung an dieser Stelle erzeugt die grösste Wirkung.
                    </div>
                  </div>
                ))}
              </div>
            </FadeOnScroll>
          </div>

          {/* AI Synthesis - Ebene 2 */}
          <FadeOnScroll className="space-y-16 pt-16 border-t border-white/5">
            <div className="max-w-4xl space-y-8">
              <div className="inline-block">
                <span className="text-[10px] uppercase tracking-[0.4em] font-black text-amber-500 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
                  AI Synthesis — Executive Level
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">Die systemische <span className="italic text-neutral-400">Architektur</span> im Blick.</h2>
            </div>

            <div className="grid gap-16 lg:grid-cols-2">
              <div className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] text-neutral-500 flex items-center gap-4">
                    <span className="h-px w-6 bg-neutral-800"></span> Gesamt-Dynamik
                  </h3>
                  <div className="prose prose-invert prose-amber max-w-none text-neutral-300 font-light leading-relaxed prose-headings:text-neutral-100 prose-strong:text-amber-500 prose-p:mb-6 text-lg">
                    <ReactMarkdown>{ai?.summary_md ?? ""}</ReactMarkdown>
                  </div>
                </div>

                <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-amber-500/[0.05] to-transparent border border-amber-500/20 space-y-8">
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] text-amber-500">Quick Wins & Sofortmassnahmen</h3>
                  <div className="prose prose-invert prose-sm prose-amber max-w-none text-neutral-300 font-light leading-relaxed prose-headings:text-neutral-100 prose-strong:text-amber-500 prose-p:mb-4">
                    <ReactMarkdown>{ai?.quick_wins_md ?? ""}</ReactMarkdown>
                  </div>
                </div>
              </div>

              <div className="space-y-12">
                <div className="space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] text-neutral-500 flex items-center gap-4">
                    <span className="h-px w-6 bg-neutral-800"></span> Widersprüche
                  </h3>
                  <div className="prose prose-invert prose-amber max-w-none text-neutral-400 font-light leading-relaxed prose-p:mb-6">
                    <ReactMarkdown>{ai?.tensions_md ?? ""}</ReactMarkdown>
                  </div>
                </div>

                <div className="p-10 rounded-[2.5rem] bg-[#111111]/50 border border-white/5 space-y-8">
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] text-neutral-300">Reflexionsfragen für Führung</h3>
                  <div className="prose prose-invert prose-sm prose-amber max-w-none text-neutral-400 font-light leading-relaxed prose-headings:text-neutral-100 prose-strong:text-amber-500 prose-p:mb-4">
                    <ReactMarkdown>{ai?.reflection_questions_md ?? ""}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </FadeOnScroll>

          {/* CTA Section */}
          <FadeOnScroll className="pt-32 flex flex-col items-center text-center space-y-12">
            <div className="max-w-2xl space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Vom Report in die <span className="text-amber-500">Umsetzung.</span></h2>
              <p className="text-lg text-neutral-400 font-light leading-relaxed">
                Diese Analyse ist der erste Schritt. Ein tragfähiges System entsteht durch Arbeit <span className="italic">am</span> Unternehmen. Lassen Sie uns die Ergebnisse gemeinsam interpretieren.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={() => window.print()}
                className="px-12 py-5 rounded-full border border-white/10 text-[11px] uppercase tracking-[0.2em] font-black hover:bg-white/5 transition-all"
              >
                PDF Speichern
              </button>
              <a 
                href="/#contact"
                className="px-12 py-5 rounded-full bg-neutral-50 text-neutral-950 text-[11px] uppercase tracking-[0.2em] font-black hover:bg-amber-400 transition-all shadow-xl shadow-white/5"
              >
                Gespräch vereinbaren
              </a>
            </div>
          </FadeOnScroll>

          <footer className="pt-32 border-t border-white/5">
            <div className="grid md:grid-cols-2 gap-12 items-end">
              <div className="space-y-4">
                <div className="text-[10px] text-neutral-800 font-black tracking-[0.5em] uppercase italic">
                  Kairos Systems Intelligence
                </div>
                <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-md">
                  Vertrauliche Analyse. Nur zur internen Verwendung. KI-generierte Hypothesen ersetzen keine professionelle Beratung.
                </p>
              </div>
              <div className="text-right text-neutral-700 text-[10px] font-bold uppercase tracking-widest">
                &copy; {new Date().getFullYear()} Kairos Systems GmbH
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
