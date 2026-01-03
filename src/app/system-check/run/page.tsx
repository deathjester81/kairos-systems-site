import { Suspense } from "react";
import questions from "@/lib/system-check/questions.v1.json";
import SystemCheckWizard from "./wizard";

export default function SystemCheckRunPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-neutral-400 flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
          Lade System-Check…
        </div>
      </div>
    }>
      <SystemCheckWizard config={questions as any} />
    </Suspense>
  );
}
