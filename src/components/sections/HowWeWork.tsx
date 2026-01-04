"use client";
import { howCopy } from "@/lib/copy";
import FadeOnScroll from "@/components/FadeOnScroll";

export default function HowWeWork() {
  return (
    <FadeOnScroll id="how" className="relative px-6 py-32 bg-[#0a0a0a] overflow-hidden">
      {/* Subtle background atmosphere - Heartbeat effect centered between the 4 boxes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-amber-500/7 rounded-full blur-[120px]" style={{ animation: 'pulse 6s ease-in-out infinite' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-amber-600/4 rounded-full blur-[100px]" style={{ animation: 'pulse 8s ease-in-out infinite 3s' }}></div>
      
      <div className="relative mx-auto max-w-7xl w-full">
        {/* Top Header line - Same format as Hero */}
        <div className="mb-20">
          <div className="inline-block mb-4">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-500/80 border-b border-amber-500/30 pb-1">
              {howCopy.label}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-50 max-w-4xl leading-tight">
            {howCopy.title}
          </h1>
        </div>

        <p className="mt-10 max-w-3xl text-lg md:text-xl leading-relaxed text-neutral-300 font-light">
          {howCopy.intro.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </p>

        <div className="mt-20 grid gap-6 md:grid-cols-2">
          {howCopy.steps.map((s, i) => {
            // Icons for each step
            const icons = [
              // Diagnose - Magnifying Glass
              <svg key="diagnose" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>,
              // System-Design - Blueprint/Structure
              <svg key="design" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>,
              // Umsetzung - Gear/Implementation
              <svg key="implementation" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>,
              // Stabilisierung - Shield/Stability
              <svg key="stabilization" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            ];

            return (
              <div key={i} className="group relative rounded-xl border border-neutral-800 bg-[#1a1a1a] p-8 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl"></div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                    {icons[i]}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-amber-500 uppercase tracking-wider mb-1">
                      Schritt {i + 1}
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-50">{s.title}</h3>
                  </div>
                </div>
                
                <p className="text-neutral-300 leading-relaxed">{s.text}</p>
              </div>
            );
          })}
        </div>

        <p className="mt-20 max-w-3xl text-lg md:text-xl leading-relaxed text-neutral-300 font-light">
          {howCopy.outro.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>
    </FadeOnScroll>
  );
}
