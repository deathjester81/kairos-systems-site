"use client";

import Link from "next/link";
import Nav from "@/components/Nav";
import FadeOnScroll from "@/components/FadeOnScroll";

export default function SystemCheckLanding() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-50 selection:bg-amber-500/30">
      <Nav />
      
      <main className="relative pt-44 pb-32 px-6 overflow-hidden min-h-screen flex flex-col">
        {/* Subtle background atmosphere - Layered gradients for depth */}
        <div className="absolute inset-0 bg-[#0a0a0a]"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[70%] h-[70%] bg-amber-500/5 rounded-full blur-[140px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-amber-600/3 rounded-full blur-[120px]"></div>
        
        {/* Technical Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, #f59e0b 1px, transparent 0)`,
            backgroundSize: '40px 40px' 
          }}>
        </div>

        <div className="relative mx-auto max-w-6xl w-full flex-1">
          {/* Header Section */}
          <div className="mb-24 max-w-3xl">
            <div className="inline-block mb-6">
              <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-amber-500/90 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                Performance Audit
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-neutral-50 leading-[1.1] mb-8">
              System-<span className="text-amber-500">Check</span>
            </h1>
            <p className="text-2xl md:text-3xl font-medium tracking-tight text-neutral-300 leading-snug">
              Analysieren Sie die <span className="text-neutral-50 italic">Tragfähigkeit</span> Ihrer Organisation in 15 Minuten.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr_380px] gap-16 items-start">
            <div className="space-y-16">
              <div className="space-y-8 text-lg md:text-xl text-neutral-400 font-light leading-relaxed max-w-2xl">
                <p>
                  Ein Unternehmen ist kein Werkzeug, das man härter benutzen muss. Es ist ein System, das tragen muss. 
                  Unser Audit macht sichtbar, wo Ihre Struktur heute steht – und wo sie bricht.
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-4">
                  <div className="space-y-2">
                    <div className="text-amber-500 font-bold text-2xl tracking-tighter">30</div>
                    <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Fragen</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-amber-500 font-bold text-2xl tracking-tighter">AI</div>
                    <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Analyse</div>
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                    <div className="text-amber-500 font-bold text-2xl tracking-tighter">Live</div>
                    <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Ergebnis</div>
                  </div>
                </div>
              </div>

              <div className="pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center gap-10">
                <Link
                  href="/system-check/run"
                  className="group relative inline-flex items-center rounded-full glass border border-amber-500/20 px-10 py-4 text-sm font-bold text-neutral-50 transition-all hover:border-amber-500/50 hover:bg-amber-500/5 shadow-[0_0_30px_rgba(245,158,11,0.1)] hover:shadow-[0_0_50px_rgba(245,158,11,0.25)] hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Check starten
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
                
                <div className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold max-w-[200px] leading-relaxed">
                  100% anonym möglich. <br/>Kein E-Mail-Zwang.
                </div>
              </div>
            </div>

            <aside className="space-y-12">
              <FadeOnScroll className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-px w-8 bg-amber-500/30"></div>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Scope</h2>
                </div>
                <ul className="space-y-8 pl-4">
                  {[
                    { title: "Systemische Sicht", desc: "Wie stabil funktioniert die Firma?" },
                    { title: "Klarheits-Check", desc: "Strukturiertes Selbstbild statt Bauchgefühl." },
                    { title: "Rollenübergreifend", desc: "Vom Shopfloor bis zum C-Level relevant." }
                  ].map((item, i) => (
                    <li key={i} className="group relative">
                      <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-white/5 group-hover:bg-amber-500/30 transition-colors"></div>
                      <div className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1 group-hover:text-amber-500 transition-colors">{item.title}</div>
                      <div className="text-xs text-neutral-500 leading-relaxed font-light">{item.desc}</div>
                    </li>
                  ))}
                </ul>
              </FadeOnScroll>

              <FadeOnScroll className="space-y-6 pt-8 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <div className="h-px w-8 bg-neutral-800"></div>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600">Disclaimer</h2>
                </div>
                <div className="grid grid-cols-1 gap-4 pl-4">
                  {[
                    "Keine Zertifizierung",
                    "Kein Sales-Pitch",
                    "Kein Datenverkauf"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-[9px] text-neutral-600 uppercase tracking-widest font-black">
                      <div className="h-1 w-1 rounded-full bg-neutral-800"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </FadeOnScroll>
            </aside>
          </div>

          <footer className="mt-32 pt-12 border-t border-white/5">
            <div className="grid md:grid-cols-2 gap-12 items-end">
              <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-[0.2em] leading-relaxed max-w-md">
                Analyse auf Basis Ihrer Selbsteinschätzung. KI-generierte Hypothesen zur Reflexion. Löschung nach 30 Tagen (MVP Policy).
              </p>
              <div className="text-right hidden md:block">
                <span className="text-[10px] text-neutral-800 font-black tracking-[0.5em] uppercase italic">
                  Kairos Systems Audit v1.0
                </span>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
