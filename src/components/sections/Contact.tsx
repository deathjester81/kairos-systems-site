"use client";

import { contactCopy } from "@/lib/copy";

interface ContactProps {
  onOpenCalendly: () => void;
}

export default function Contact({ onOpenCalendly }: ContactProps) {
  return (
    <section id="contact" className="relative px-6 py-32 bg-[#0a0a0a] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.05),transparent_70%)]"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
      
      <div className="relative mx-auto max-w-6xl">
        <div className="inline-block mb-4">
          <span className="text-sm font-medium text-amber-500 uppercase tracking-wider">Kontakt</span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-50">{contactCopy.title}</h2>

        <p className="mt-10 max-w-3xl text-lg md:text-xl leading-relaxed text-neutral-300 font-light">
          {contactCopy.intro.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </p>

        <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
          <button
            onClick={onOpenCalendly}
            className="group inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 px-8 py-4 text-base font-medium text-white hover:from-amber-500 hover:to-amber-400 transition-all shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105"
          >
            {contactCopy.ctaPrimary}
            <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <a
            href={`mailto:${contactCopy.email}`}
            className="inline-flex items-center justify-center rounded-lg border border-neutral-700 bg-[#1a1a1a] px-8 py-4 text-base font-medium text-neutral-300 hover:border-amber-500/50 hover:text-amber-400 hover:bg-[#1f1f1f] transition-all"
          >
            {contactCopy.ctaSecondary}
          </a>

          <div className="text-sm text-neutral-400 sm:ml-4">
            oder direkt: <a href={`mailto:${contactCopy.email}`} className="font-medium text-amber-400 hover:text-amber-300 transition-colors">{contactCopy.email}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
