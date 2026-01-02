"use client";
import { problemCopy } from "@/lib/copy";
import FadeOnScroll from "@/components/FadeOnScroll";

export default function Problem() {
  return (
    <FadeOnScroll id="problem" className="relative pt-44 pb-32 px-6 overflow-hidden bg-[#0a0a0a]">
      {/* Subtle background atmosphere */}
      <div className="absolute inset-0 bg-[#0a0a0a]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(245,158,11,0.05),transparent_70%)]"></div>
      
      <div className="relative mx-auto max-w-7xl w-full">
        {/* Top Header line - Same format as Hero */}
        <div className="mb-20">
          <div className="inline-block mb-4">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-500/80 border-b border-amber-500/30 pb-1">
              {problemCopy.label}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-50 max-w-4xl leading-tight">
            {problemCopy.title}
          </h1>
        </div>

        {/* 2-Column Layout: Image left, Content right */}
        <div className="grid lg:grid-cols-2 gap-12 items-stretch">
          {/* Left: Image (Portrait/Hochformat) */}
          <div className="relative flex justify-center lg:justify-start w-full">
            <div className="relative w-full max-w-[400px] aspect-[3/4] group h-full">
              {/* Vertigo Tunnel Effect - Concentric circles coming at you (behind image) */}
              <div className="absolute inset-0 z-0 overflow-visible pointer-events-none flex items-center justify-center">
                <div 
                  className="rounded-full"
                  style={{
                    width: '200%',
                    aspectRatio: '1',
                    height: 'auto',
                    background: `
                      radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.4) 0%, transparent 3%),
                      radial-gradient(circle at 50% 50%, transparent 5%, rgba(245, 158, 11, 0.35) 6%, transparent 9%),
                      radial-gradient(circle at 50% 50%, transparent 11%, rgba(245, 158, 11, 0.3) 12%, transparent 15%),
                      radial-gradient(circle at 50% 50%, transparent 17%, rgba(245, 158, 11, 0.25) 18%, transparent 21%),
                      radial-gradient(circle at 50% 50%, transparent 23%, rgba(245, 158, 11, 0.2) 24%, transparent 27%),
                      radial-gradient(circle at 50% 50%, transparent 29%, rgba(245, 158, 11, 0.15) 30%, transparent 33%),
                      radial-gradient(circle at 50% 50%, transparent 35%, rgba(245, 158, 11, 0.12) 36%, transparent 39%),
                      radial-gradient(circle at 50% 50%, transparent 41%, rgba(245, 158, 11, 0.1) 42%, transparent 45%),
                      radial-gradient(circle at 50% 50%, transparent 47%, rgba(245, 158, 11, 0.08) 48%, transparent 51%),
                      radial-gradient(circle at 50% 50%, transparent 53%, rgba(245, 158, 11, 0.06) 54%, transparent 58%),
                      radial-gradient(circle at 50% 50%, transparent 60%, rgba(245, 158, 11, 0.04) 61%, transparent 65%),
                      radial-gradient(circle at 50% 50%, transparent 67%, rgba(245, 158, 11, 0.02) 68%, transparent 100%)
                    `,
                    animation: 'vertigo-tunnel 8s linear infinite',
                    transformOrigin: 'center center',
                  }}
                ></div>
              </div>
              
              {/* Image Frame - Same as Hero but WITHOUT pulsating glow */}
              <div className="relative z-10 w-full h-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-700 bg-[#0a0a0a]">
                <img 
                  src="/pics/problem-no-system.jpeg" 
                  alt="Problem: Kein System"
                  className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                />
                {/* Subtle overlay for integration */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent"></div>
              </div>
              
              {/* Decorative corner elements - Same as Hero */}
              <div className="absolute -top-4 -right-4 w-20 h-20 border-t border-r border-amber-500/40 rounded-tr-[2.5rem] transition-transform group-hover:translate-x-2 group-hover:-translate-y-2"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 border-b border-l border-amber-500/40 rounded-bl-[2.5rem] transition-transform group-hover:-translate-x-2 group-hover:translate-y-2"></div>
            </div>
          </div>

          {/* Right: Content - Aligned top and bottom with image */}
          <div className="flex flex-col justify-between h-full space-y-6">
            {/* Intro Text */}
            <div>
              <p className="text-2xl md:text-3xl font-medium tracking-tight text-neutral-200 leading-snug">
                {problemCopy.intro.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>

            {/* Bullets */}
            <div>
              <ul className="space-y-3 text-neutral-300 leading-relaxed">
                {problemCopy.bullets.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0"></span>
                    <span className="flex-1">
                      {Array.isArray(item) ? (
                        item.map((line, j) => (
                          <span key={j} className="block">
                            {line}
                          </span>
                        ))
                      ) : (
                        item
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Outro Text */}
            <div>
              <p className="text-2xl md:text-3xl font-medium tracking-tight text-neutral-200 leading-snug">
                {problemCopy.outro.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </FadeOnScroll>
  );
}
