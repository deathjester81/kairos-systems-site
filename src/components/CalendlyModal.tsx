"use client";

import { useEffect } from "react";

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-sm"></div>

      {/* Modal Content */}
      <div
        className="relative z-10 w-full max-w-5xl h-[90vh] max-h-[90vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a]"
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

        {/* Calendly Embed Container with subtle amber glow */}
        <div className="relative h-[calc(90vh-80px)] sm:h-[calc(90vh-100px)] bg-[#1a1a1a] overflow-hidden">
          {/* Subtle amber glow around the iframe */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent pointer-events-none"></div>
          
          <iframe
            src="https://calendly.com/fabrizio-notter/ihr-system?embed_type=Inline&hide_event_type_details=1&hide_gdpr_banner=1"
            width="100%"
            height="100%"
            frameBorder="0"
            className="relative z-10 w-full h-full"
            title="Calendly Booking"
            allow="camera; microphone; geolocation"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
