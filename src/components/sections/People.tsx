"use client";
import { peopleCopy } from "@/lib/copy";
import Image from "next/image";
import FadeOnScroll from "@/components/FadeOnScroll";

export default function People() {
  return (
    <FadeOnScroll id="people" className="relative pt-64 pb-44 px-6 bg-[#0a0a0a]">
      {/* Subtle background atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.03),transparent_50%)]"></div>
      
      <div className="relative mx-auto max-w-7xl w-full">
        {/* Top Header line - Consistent with other sections */}
        <div className="mb-32 text-center">
          <div className="inline-block mb-4">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-500/80 border-b border-amber-500/30 pb-1">
              {peopleCopy.label}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-50 max-w-4xl mx-auto leading-tight">
            {peopleCopy.title}
          </h1>
        </div>

        <div className="grid gap-32 md:gap-16 lg:gap-24 md:grid-cols-2 mt-48">
          {peopleCopy.people.map((p, i) => (
            <div key={i} className="group relative rounded-2xl border border-white/5 bg-[#111111] p-10 pt-24 transition-all duration-500 hover:border-amber-500/20">
              
              {/* Portraits protruding from the card */}
              <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-64 h-80 pointer-events-none z-30">
                <div className="relative w-full h-full">
                  {/* Subtle amber glow behind the person */}
                  <div className="absolute inset-0 bg-amber-500/20 blur-[60px] rounded-full scale-75 opacity-40 group-hover:opacity-80 transition-opacity duration-700"></div>
                  
                  <div className="relative w-full h-full transform transition-transform duration-700 group-hover:scale-105">
                    <Image 
                      src={i === 0 ? "/pics/kai-portrait.png" : "/pics/fabri-portrait.png"} 
                      alt={p.name}
                      fill
                      className="object-contain filter drop-shadow(0 0 15px rgba(245, 158, 11, 0.4)) grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="relative z-20 text-center flex flex-col h-full">
                {/* Name and Role - Below portrait, above bullets */}
                <div className="mb-8 mt-32">
                  <h3 className="text-2xl md:text-3xl font-bold text-neutral-50 mb-2">
                    {p.name}
                  </h3>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-amber-500 font-bold">
                    {p.role}
                  </div>
                </div>
                <ul className="space-y-4 text-left text-neutral-400 text-sm leading-relaxed mb-10 flex-1">
                  {p.facts.map((f, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-amber-500 shrink-0"></span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-8 border-t border-white/5">
                  <p className="text-neutral-300 italic text-lg leading-relaxed font-light">
                    "{p.stance}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FadeOnScroll>
  );
}
