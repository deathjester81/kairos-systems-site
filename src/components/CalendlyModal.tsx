"use client";

import { useEffect } from "react";

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CALENDLY_URL = "https://calendly.com/fabrizio-struqtera/kennenlernen";

export default function CalendlyModal({ isOpen, onClose }: CalendlyModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleOpenCalendly = () => {
    window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-sm pointer-events-none"></div>

      {/* Modal Content */}
      <div
        className="relative z-10 w-full max-w-2xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Amber accent */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-[#0a0a0a] via-[#111111] to-[#0a0a0a]">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-amber-500/80 mb-1">
              Termin vereinbaren
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-neutral-50">Ihr System starten</h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-amber-400 transition-colors p-2 hover:bg-white/5 rounded-lg shrink-0"
            aria-label="Schließen"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-12 space-y-8">
          <div className="space-y-4">
            <p className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed">
              Calendly öffnet sich in einem neuen Fenster, damit Sie Ihren Termin bequem buchen können.
            </p>
            <div className="flex items-center gap-3 text-sm text-neutral-400">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Funktioniert in allen Browsern, inklusive Firefox</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleOpenCalendly}
              className="group relative inline-flex items-center justify-center rounded-full bg-amber-500 px-8 py-4 text-base font-bold text-neutral-950 transition-all hover:bg-amber-400 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(245,158,11,0.3)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                Termin buchen
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            <button
              onClick={onClose}
              className="px-8 py-4 text-base font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
