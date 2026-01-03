import Link from "next/link";
import Nav from "@/components/Nav";

export default function SystemCheckLanding() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-50">
      <Nav />
      
      <main className="relative pt-44 pb-32 px-6 overflow-hidden">
        {/* Subtle background atmosphere */}
        <div className="absolute inset-0 bg-[#0a0a0a]"></div>
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-amber-500/5 rounded-full blur-[120px]"></div>
        
        <div className="relative mx-auto max-w-4xl w-full">
          {/* Label & Title */}
          <div className="mb-16">
            <div className="inline-block mb-4">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-500/80 border-b border-amber-500/30 pb-1">
                Selbstaudit
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-50 leading-tight">
              System-Check
            </h1>
          </div>

          <div className="grid lg:grid-cols-[1fr_350px] gap-20">
            <div className="space-y-12">
              <p className="text-2xl md:text-3xl font-medium tracking-tight text-neutral-200 leading-snug">
                Wie stabil trägt Ihr Unternehmen den Alltag – und wie bereit ist es für die Zukunft?
              </p>
              
              <div className="space-y-6 text-lg text-neutral-400 font-light leading-relaxed">
                <p>
                  In ca. 12–15 Minuten durchlaufen Sie 30 Fragen zu Führung, Struktur, Prozessen und Digitalisierung. 
                  Das Ergebnis ist kein fertiges Urteil, sondern ein Spiegel Ihrer aktuellen Systemfähigkeit.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 pt-8 border-t border-white/5">
                <Link
                  href="/system-check/run"
                  className="group relative inline-flex items-center rounded-full glass border border-amber-500/20 px-10 py-4 text-sm font-bold text-neutral-50 transition-all hover:border-amber-500/50 hover:bg-amber-500/5 shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                >
                  <span className="relative z-10">Check starten</span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
                <span className="text-xs text-neutral-500 font-light max-w-[200px]">
                  Der Report wird direkt im Anschluss erzeugt – auch ohne E-Mail-Angabe.
                </span>
              </div>
            </div>

            <aside className="space-y-10">
              <div className="rounded-2xl border border-white/5 bg-[#111111] p-8 transition-all hover:border-amber-500/20">
                <h2 className="text-sm font-bold uppercase tracking-wider text-amber-500 mb-6">Was es ist</h2>
                <ul className="space-y-4">
                  {[
                    "Ein Spiegel: Wie stabil funktioniert die Firma als System?",
                    "Strukturiertes Selbstbild statt Fremdgutachten.",
                    "Für alle Rollen: vom Shopfloor bis zum Owner."
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-neutral-400 leading-relaxed">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-amber-500 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-white/5 bg-[#111111] p-8 transition-all hover:border-amber-500/20">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-6">Was es nicht ist</h2>
                <ul className="space-y-4">
                  {[
                    "Keine Zertifizierung oder Diagnose.",
                    "Kein Chatbot, kein Sales-Funnel.",
                    "Kein Datenverkauf."
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-neutral-500 leading-relaxed">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-neutral-600 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          <footer className="mt-20 pt-8 border-t border-white/5">
            <p className="text-xs text-neutral-600 font-light leading-relaxed">
              Hinweis: Die Auswertung erfolgt auf Basis Ihrer Selbsteinschätzung. 
              KI-gestützte Analysen formulieren Hypothesen zur Reflexion, keine verbindlichen Diagnosen.
              Daten werden im Rahmen der MVP-Policy nach 30 Tagen gelöscht.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
