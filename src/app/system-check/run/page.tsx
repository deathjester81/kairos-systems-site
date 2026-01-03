import questions from "@/lib/system-check/questions.v1.json";
import SystemCheckWizard from "./wizard";

export default function SystemCheckRunPage() {
  // questions.json ist statisch importierbar => server-side ok
  return <SystemCheckWizard config={questions as any} />;
}
