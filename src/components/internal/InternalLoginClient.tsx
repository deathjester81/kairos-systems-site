"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const DEFAULT_ADMIN_EMAIL = "fabrizio@struqtera.ch";

export default function InternalLoginClient({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [email, setEmail] = useState(DEFAULT_ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  async function onLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
      if (!data.session) throw new Error("Keine Session erhalten");

      router.push(redirectTo);
    } catch (err: any) {
      setError(err?.message ?? "Login fehlgeschlagen");
    } finally {
      setBusy(false);
    }
  }

  async function onSendReset() {
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      const redirectUrl = `${window.location.origin}/internal/auth/update-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      if (resetError) throw resetError;
      setInfo("Reset-Mail wurde gesendet. Bitte Postfach prüfen.");
    } catch (err: any) {
      setError(err?.message ?? "Reset-Mail konnte nicht gesendet werden");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-neutral-50 flex items-center justify-center p-6">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.02] p-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Internes Dashboard Login</h1>
          <p className="text-sm text-neutral-400">
            Zugang nur für autorisierte Admin-Mail.
          </p>
        </div>

        <form onSubmit={onLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-neutral-400">E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50"
              autoComplete="username"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-neutral-400">Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50"
              autoComplete="current-password"
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
            {busy ? "Bitte warten..." : "Einloggen"}
          </button>
        </form>

        <button
          type="button"
          onClick={onSendReset}
          disabled={busy}
          className="w-full rounded-full border border-white/15 py-3 text-xs font-bold uppercase tracking-wider text-neutral-300 hover:border-amber-500/50 hover:text-neutral-100 transition-colors disabled:opacity-50"
        >
          Passwort setzen / vergessen
        </button>
      </section>
    </main>
  );
}
