"use client";

import { heroCopy } from "@/lib/copy";
import FadeOnScroll from "@/components/FadeOnScroll";
import Link from "next/link";
import Image from "next/image";

interface HeroProps {
  onOpenCalendly: () => void;
}

export default function Hero({ onOpenCalendly }: HeroProps) {
  return (
    <FadeOnScroll id="hero" className="relative pt-44 pb-32 px-6 overflow-hidden min-h-screen flex flex-col">
      {/* Subtle background atmosphere */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-amber-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/5 rounded-full blur-[100px]" style={{ animation: 'pulse 4s ease-in-out infinite 2s' }}></div>
      
      <div className="relative mx-auto max-w-7xl w-full flex-1 flex flex-col justify-center">
        {/* Top Header line - The specific request */}
        <div className="mb-20">
          <div className="inline-block mb-4">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-500/80 border-b border-amber-500/30 pb-1">
              {heroCopy.label}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-50 max-w-4xl leading-tight">
            {heroCopy.headline[0]}
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left: Content - On mobile, appears after image */}
          <div className="space-y-10 order-2 lg:order-1">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-neutral-200 leading-snug">
                {heroCopy.headline.slice(1).map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <p className="max-w-xl text-base md:text-lg leading-relaxed text-neutral-400 font-light">
                {heroCopy.subline.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
              <button
                onClick={onOpenCalendly}
                className="group relative inline-flex items-center rounded-full glass border border-amber-500/20 px-10 py-4 text-sm font-bold text-neutral-50 transition-all hover:border-amber-500/50 hover:bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]"
              >
                <span className="relative z-10">{heroCopy.cta}</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <Link
                href="/reflexion"
                className="group relative inline-flex items-center rounded-full border border-white/10 px-10 py-4 text-sm font-bold text-neutral-300 transition-all hover:border-white/20 hover:text-neutral-50 hover:bg-white/5"
              >
                <span className="relative z-10">Eigenes System reflektieren</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </div>
          </div>

          {/* Right: Larger Image - Precision aligned - On mobile, appears first */}
          <div className="relative flex justify-center lg:justify-end w-full order-1 lg:order-2">
            <div className="relative w-full max-w-[600px] aspect-[4/3] group">
              {/* Pulsating Heartbeat Glow behind the image */}
              <div className="absolute inset-0 bg-amber-500/15 rounded-[2rem] blur-[60px] animate-pulse"></div>
              
              {/* The "Heartbeat" container */}
              <div className="relative z-10 w-full h-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl transition-all duration-700">
                <Image 
                  src="/pics/system-hero.jpeg" 
                  alt="STRUQTERA System Architecture"
                  fill
                  priority
                  className="object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                />
                {/* Subtle overlay for integration */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent"></div>
              </div>
              
              {/* Decorative corner elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 border-t border-r border-amber-500/40 rounded-tr-[2.5rem] transition-transform group-hover:translate-x-2 group-hover:-translate-y-2"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 border-b border-l border-amber-500/40 rounded-bl-[2.5rem] transition-transform group-hover:-translate-x-2 group-hover:translate-y-2"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator line */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20">
        <div className="w-px h-16 bg-gradient-to-b from-amber-500 to-transparent"></div>
      </div>
    </FadeOnScroll>
  );
}
