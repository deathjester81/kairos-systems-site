"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (password.length < 12) {
      setError("Bitte mindestens 12 Zeichen verwenden.");
      return;
    }
    if (password !== confirm) {
      setError("Passwörter stimmen nicht überein.");
      return;
    }

    setBusy(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setInfo("Passwort gesetzt. Weiterleitung zum Login...");
      setTimeout(() => router.push("/internal/login"), 1200);
    } catch (err: any) {
      setError(err?.message ?? "Passwort konnte nicht gesetzt werden");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-neutral-50 flex items-center justify-center p-6">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.02] p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Neues Passwort setzen</h1>
          <p className="text-sm text-neutral-400">
            Dieser Schritt gilt für den Dashboard-Zugang.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-neutral-400">Neues Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50"
              autoComplete="new-password"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-neutral-400">Passwort wiederholen</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50"
              autoComplete="new-password"
              required
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {info && <p className="text-sm text-emerald-400">{info}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-amber-500 py-3 text-sm font-bold uppercase tracking-wider text-black hover:bg-amber-400 transition-colors disabled:opacity-50"
          >
            {busy ? "Speichere..." : "Passwort speichern"}
          </button>
        </form>
      </section>
    </main>
  );
}
