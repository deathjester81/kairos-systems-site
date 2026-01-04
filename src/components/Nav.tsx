"use client";

import { useState } from "react";

const links = [
    { href: "#problem", label: "Problem" },
    { href: "#perspective", label: "Perspektive" },
    { href: "#how", label: "Wie wir arbeiten" },
    { href: "#reflection", label: "System-Reflexion" },
    { href: "#people", label: "Menschen" },
    { href: "#contact", label: "Kontakt" },
  ];
  
  interface NavProps {
    onOpenCalendly?: () => void;
  }

  export default function Nav({ onOpenCalendly }: NavProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const id = href.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        const offset = 80; // Account for fixed nav
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
        
        // Close mobile menu after navigation
        setIsMobileMenuOpen(false);
      }
    };

    return (
      <header className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#hero" 
            onClick={(e) => scrollToSection(e, "#hero")}
            className="text-lg sm:text-xl font-bold tracking-tighter text-neutral-50 hover:text-amber-400 transition-colors"
          >
            Kairos Systems
          </a>

          {/* Desktop Navigation Pill */}
          <nav className="hidden lg:flex items-center gap-1 bg-neutral-900/40 backdrop-blur-xl rounded-full px-2 py-1 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all hover:border-white/20">
            {links.slice(0, 5).map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => scrollToSection(e, l.href)}
                className="px-5 py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 hover:text-neutral-50 transition-colors rounded-full hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Desktop CTA Button */}
            {onOpenCalendly && (
              <button
                onClick={onOpenCalendly}
                className="hidden sm:block rounded-full bg-neutral-50 px-6 sm:px-8 py-2.5 text-[11px] uppercase tracking-[0.15em] font-bold text-neutral-950 hover:bg-amber-400 transition-all shadow-lg"
              >
                Gespräch
              </button>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-50 hover:text-amber-400 transition-colors"
              aria-label="Menu öffnen"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 mt-4 mx-4 bg-neutral-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <nav className="flex flex-col py-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => scrollToSection(e, l.href)}
                  className="px-6 py-3 text-sm font-medium text-neutral-300 hover:text-neutral-50 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                >
                  {l.label}
                </a>
              ))}
              {onOpenCalendly && (
                <button
                  onClick={() => {
                    onOpenCalendly();
                    setIsMobileMenuOpen(false);
                  }}
                  className="mx-4 mt-4 mb-2 rounded-full bg-neutral-50 px-6 py-3 text-sm uppercase tracking-[0.15em] font-bold text-neutral-950 hover:bg-amber-400 transition-all shadow-lg"
                >
                  Gespräch
                </button>
              )}
            </nav>
          </div>
        )}
      </header>
    );
  }
  