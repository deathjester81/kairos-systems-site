"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import CalendlyModal from "@/components/CalendlyModal";

import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import System from "@/components/sections/System";
import Perspective from "@/components/sections/Perspective";
import HowWeWork from "@/components/sections/HowWeWork";
import SystemReflection from "@/components/sections/SystemReflection";
import People from "@/components/sections/People";
import Contact from "@/components/sections/Contact";

export default function Page() {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  return (
    <div className="bg-[#0a0a0a] text-neutral-50">
      <Nav onOpenCalendly={() => setIsCalendlyOpen(true)} />
      <main>
        <Hero onOpenCalendly={() => setIsCalendlyOpen(true)} />
        <Problem />
        <Perspective />
        <HowWeWork />
        <SystemReflection />
        <People />
        <Contact onOpenCalendly={() => setIsCalendlyOpen(true)} />
      </main>
      <footer className="border-t border-neutral-800 px-6 py-12 text-sm text-neutral-500">
        <div className="mx-auto max-w-5xl">© {new Date().getFullYear()} STRUQTERA</div>
      </footer>
      <CalendlyModal isOpen={isCalendlyOpen} onClose={() => setIsCalendlyOpen(false)} />
    </div>
  );
}
