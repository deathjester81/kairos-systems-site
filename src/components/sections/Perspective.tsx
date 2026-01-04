"use client";
import { perspectiveCopy } from "@/lib/copy";
import FadeOnScroll from "@/components/FadeOnScroll";

export default function Perspective() {
  return (
    <FadeOnScroll id="perspective" className="relative pt-44 pb-44 px-6 overflow-hidden bg-[#0a0a0a]">
      {/* Subtle background atmosphere - Heartbeat effect between Zustand 2 and 3 */}
      <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-amber-500/7 rounded-full blur-[120px]" style={{ animation: 'pulse 6s ease-in-out infinite' }}></div>
      <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-amber-600/4 rounded-full blur-[100px]" style={{ animation: 'pulse 8s ease-in-out infinite 3s' }}></div>
      
      {/* Unique Background Element - A massive, very faint amber curve */}
      <div className="absolute top-0 right-[-10%] w-[100%] h-[100%] pointer-events-none opacity-20">
        <svg viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="1000" cy="500" r="450" stroke="url(#paint0_radial)" strokeWidth="0.5" />
          <defs>
            <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1000 500) rotate(90) scale(450)">
              <stop offset="0" stopColor="#f59e0b" stopOpacity="0.5" />
              <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl w-full">
        {/* Top Header line - Same format as Hero */}
        <div className="mb-20">
          <div className="inline-block mb-4">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-500/80 border-b border-amber-500/30 pb-1">
              {perspectiveCopy.label}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-50 max-w-4xl leading-tight">
            {perspectiveCopy.title}
          </h1>
        </div>

        {/* The Journey - Three states with a vertical line */}
        <div className="relative grid lg:grid-cols-[1px_1fr] gap-24 items-stretch">
          {/* Vertical Connecting Line */}
          <div className="hidden lg:block relative w-px bg-gradient-to-b from-amber-500/50 via-amber-500/20 to-transparent">
            {/* Dots on the line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
            <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-500/50"></div>
            <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-500/30"></div>
          </div>

          <div className="space-y-32">
            {perspectiveCopy.states.map((state, i) => (
              <div key={i} className="group relative pl-0 lg:pl-12">
                {/* State Label */}
                <div className="mb-6">
                  <h2 className="text-lg md:text-xl font-semibold text-amber-500/80 tracking-tight">
                    {state.label}
                  </h2>
                </div>

                {/* Bullets - no line break between label and bullets */}
                <div className="max-w-3xl">
                  <ul className="space-y-3 text-xl md:text-2xl leading-relaxed text-neutral-300 font-light">
                    {state.bullets.map((bullet, j) => (
                      <li key={j} className="flex gap-4 group-hover:text-neutral-50 transition-colors duration-700">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0"></span>
                        <span className="flex-1">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FadeOnScroll>
  );
}
