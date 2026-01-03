"use client";
import { reflectionCopy } from "@/lib/copy";
import FadeOnScroll from "@/components/FadeOnScroll";
import Link from "next/link";

export default function SystemReflection() {
  return (
    <FadeOnScroll id="reflection" className="relative pt-44 pb-44 px-6 overflow-hidden bg-[#0a0a0a]">
      {/* Subtle background atmosphere - Heartbeat effect centered */}
      <div className="absolute inset-0 bg-[#0a0a0a]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-amber-500/5 rounded-full blur-[140px] animate-pulse"></div>
      
      <div className="relative mx-auto max-w-7xl w-full">
        {/* Top Header line - Same format as Hero/Problem */}
        <div className="mb-24 text-center lg:text-left">
          <div className="inline-block mb-4">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-500/80 border-b border-amber-500/30 pb-1">
              {reflectionCopy.label}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-50 max-w-4xl leading-tight">
            {reflectionCopy.title}
          </h1>
        </div>

        {/* Reflection Questions - Large, elegant, breathing space */}
        <div className="space-y-16">
          {reflectionCopy.questions.map((q, i) => (
            <div key={i} className="group relative max-w-4xl mx-auto lg:mx-0">
              {/* Question Number - Subtle but present */}
              <div className="absolute -left-12 lg:-left-20 top-0 text-[10px] font-bold text-neutral-800 group-hover:text-amber-500/40 transition-colors duration-500 tracking-[0.4em] pt-2 hidden sm:block">
                0{i + 1}
              </div>
              
              <div className="space-y-4">
                <p className="text-xl md:text-2xl leading-[1.3] text-neutral-400 font-light group-hover:text-neutral-50 transition-all duration-700">
                  {q.text.map((line, j) => (
                    <span key={j} className={`block ${j === 1 ? 'text-neutral-500 group-hover:text-amber-400/80' : ''}`}>
                      {line}
                    </span>
                  ))}
                </p>
                {/* Minimalist divider line that grows on hover */}
                <div className="h-px w-12 bg-amber-500/20 group-hover:w-full transition-all duration-1000 ease-in-out origin-left"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Subtle CTA Button - Same style as Hero */}
        <div className="mt-32 flex justify-center lg:justify-start">
          <Link
            href="/reflexion"
            className="group relative inline-flex items-center rounded-full glass border border-amber-500/20 px-10 py-4 text-sm font-bold text-neutral-50 transition-all hover:border-amber-500/50 hover:bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]"
          >
            <span className="relative z-10">Eigenes System reflektieren</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        </div>
      </div>
    </FadeOnScroll>
  );
}
