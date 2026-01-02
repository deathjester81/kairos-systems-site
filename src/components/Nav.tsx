"use client";

const links = [
    { href: "#problem", label: "Problem" },
    { href: "#perspective", label: "Perspektive" },
    { href: "#how", label: "Wie wir arbeiten" },
    { href: "#reflection", label: "System-Reflexion" },
    { href: "#people", label: "Menschen" },
    { href: "#contact", label: "Kontakt" },
    { href: "#system", label: "System" },
  ];
  
  interface NavProps {
    onOpenCalendly: () => void;
  }

  export default function Nav({ onOpenCalendly }: NavProps) {
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
      }
    };

    return (
      <header className="fixed top-6 left-0 right-0 z-50 px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#hero" 
            onClick={(e) => scrollToSection(e, "#hero")}
            className="text-xl font-bold tracking-tighter text-neutral-50 hover:text-amber-400 transition-colors"
          >
            Kairos Systems
          </a>

          {/* Centered Navigation Pill */}
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

          {/* Right Action */}
          <button
            onClick={onOpenCalendly}
            className="rounded-full bg-neutral-50 px-8 py-2.5 text-[11px] uppercase tracking-[0.15em] font-bold text-neutral-950 hover:bg-amber-400 transition-all shadow-lg"
          >
            Gespräch
          </button>
        </div>
      </header>
    );
  }
  