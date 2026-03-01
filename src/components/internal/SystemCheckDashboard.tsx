"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type ReportListItem = {
  token: string;
  status: string;
  created_at: string;
  report_created_at: string | null;
  name: string | null;
  email: string | null;
  company: string | null;
  phone: string | null;
  additional_feedback: string | null;
  overall_score: number | null;
  top_lever: string | null;
};

type AggregatePayload = {
  total_reports: number;
  overall_average: number | null;
  axis_averages: Array<{ label: string; average: number; samples: number }>;
};

const ADMIN_EMAIL = "fabrizio@struqtera.ch";

export default function SystemCheckDashboard() {
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [items, setItems] = useState<ReportListItem[]>([]);
  const [aggregate, setAggregate] = useState<AggregatePayload | null>(null);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        router.replace("/internal/login?redirect=/internal/system-check");
        return;
      }

      const userEmail = session.user.email?.toLowerCase() ?? "";
      if (userEmail !== ADMIN_EMAIL) {
        await supabase.auth.signOut();
        router.replace("/internal/login");
        return;
      }

      setEmail(userEmail);
      setToken(session.access_token);
    })();
  }, [router, supabase.auth]);

  useEffect(() => {
    if (!token) return;
    void loadDashboard(token, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function fetchWithAuth(url: string, init?: RequestInit) {
    if (!token) throw new Error("Keine Auth-Session vorhanden");
    const res = await fetch(url, {
      ...init,
      headers: {
        ...(init?.headers ?? {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json?.error || `Request failed: ${res.status}`);
    return json;
  }

  async function loadDashboard(accessToken: string, currentSearch: string) {
    setBusy(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (currentSearch.trim()) params.set("search", currentSearch.trim());
      params.set("limit", "200");

      const [reportsJson, aggregateJson] = await Promise.all([
        fetch(`/api/admin/system-check/reports?${params.toString()}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).then(async (res) => {
          const json = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(json?.error || `Reports failed: ${res.status}`);
          return json;
        }),
        fetch("/api/admin/system-check/aggregate", {
          headers: { Authorization: `Bearer ${accessToken}` },
        }).then(async (res) => {
          const json = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(json?.error || `Aggregate failed: ${res.status}`);
          return json;
        }),
      ]);

      setItems(reportsJson.items ?? []);
      setAggregate(aggregateJson);
      setSelectedTokens([]);
    } catch (err: any) {
      setError(err?.message ?? "Dashboard konnte nicht geladen werden");
    } finally {
      setBusy(false);
    }
  }

  async function onSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    await loadDashboard(token, search);
  }

  async function loadDetail(currentToken: string) {
    setError(null);
    try {
      const json = await fetchWithAuth(`/api/admin/system-check/report/${currentToken}`);
      setSelectedToken(currentToken);
      setSelectedReport(json);
    } catch (err: any) {
      setError(err?.message ?? "Detail konnte nicht geladen werden");
    }
  }

  async function deleteOne(currentToken: string) {
    if (!confirm(`Report ${currentToken.slice(0, 8)}... wirklich löschen?`)) return;
    setError(null);
    try {
      await fetchWithAuth(`/api/admin/system-check/report/${currentToken}`, { method: "DELETE" });
      if (token) await loadDashboard(token, search);
      if (selectedToken === currentToken) {
        setSelectedToken(null);
        setSelectedReport(null);
      }
    } catch (err: any) {
      setError(err?.message ?? "Löschen fehlgeschlagen");
    }
  }

  async function deleteSelected() {
    if (selectedTokens.length === 0) return;
    if (!confirm(`${selectedTokens.length} Reports wirklich löschen?`)) return;
    setError(null);
    try {
      await fetchWithAuth("/api/admin/system-check/reports/bulk-delete", {
        method: "POST",
        body: JSON.stringify({ tokens: selectedTokens }),
      });
      if (token) await loadDashboard(token, search);
      if (selectedToken && selectedTokens.includes(selectedToken)) {
        setSelectedToken(null);
        setSelectedReport(null);
      }
    } catch (err: any) {
      setError(err?.message ?? "Bulk-Delete fehlgeschlagen");
    }
  }

  function toggleSelection(currentToken: string) {
    setSelectedTokens((prev) =>
      prev.includes(currentToken) ? prev.filter((tokenValue) => tokenValue !== currentToken) : [...prev, currentToken]
    );
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.replace("/internal/login");
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-neutral-50 flex items-center justify-center">
        <p className="text-neutral-400">Lade Admin-Session...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-neutral-50 p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">System-Check Dashboard</h1>
            <p className="text-sm text-neutral-400 mt-1">Eingeloggt als {email}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => token && loadDashboard(token, search)}
              className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:border-amber-500/50"
            >
              Aktualisieren
            </button>
            <button
              onClick={signOut}
              className="rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:border-red-400/50"
            >
              Logout
            </button>
          </div>
        </header>

        {aggregate && (
          <section className="grid md:grid-cols-3 gap-4">
            <StatCard label="Reports gesamt" value={String(aggregate.total_reports)} />
            <StatCard label="Ø Gesamt-Score" value={aggregate.overall_average != null ? `${aggregate.overall_average}%` : "-"} />
            <StatCard label="Ausgewählt" value={String(selectedTokens.length)} />
          </section>
        )}

        {aggregate && aggregate.axis_averages.length > 0 && (
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-300 mb-4">Achsen-Mittelwerte</h2>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
              {aggregate.axis_averages.map((axis) => (
                <div key={axis.label} className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <div className="text-xs text-neutral-400">{axis.label}</div>
                  <div className="text-lg font-semibold">{axis.average}%</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="grid xl:grid-cols-[1.3fr_1fr] gap-6">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
            <form onSubmit={onSearchSubmit} className="flex gap-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Suche nach Name, Firma, Mail, Token..."
                className="flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm focus:outline-none focus:border-amber-500/50"
              />
              <button className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black">
                Suchen
              </button>
            </form>

            <div className="flex items-center justify-between">
              <p className="text-xs text-neutral-400">{items.length} Einträge</p>
              <button
                onClick={deleteSelected}
                disabled={selectedTokens.length === 0}
                className="rounded-full border border-red-500/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-300 disabled:opacity-40"
              >
                Auswahl löschen
              </button>
            </div>

            <div className="overflow-auto max-h-[70vh] border border-white/10 rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-black/30 text-neutral-400">
                  <tr>
                    <th className="p-2 text-left w-8" />
                    <th className="p-2 text-left">Kontakt</th>
                    <th className="p-2 text-left">Firma</th>
                    <th className="p-2 text-left">Score</th>
                    <th className="p-2 text-left">Datum</th>
                    <th className="p-2 text-right">Aktion</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.token} className="border-t border-white/10 hover:bg-white/[0.03]">
                      <td className="p-2">
                        <input
                          type="checkbox"
                          checked={selectedTokens.includes(item.token)}
                          onChange={() => toggleSelection(item.token)}
                        />
                      </td>
                      <td className="p-2">
                        <button
                          onClick={() => loadDetail(item.token)}
                          className="text-left hover:text-amber-400"
                          title={item.token}
                        >
                          <div className="font-medium">{item.name || "(ohne Name)"}</div>
                          <div className="text-xs text-neutral-500">{item.email || item.token.slice(0, 10)}</div>
                        </button>
                      </td>
                      <td className="p-2">{item.company || "-"}</td>
                      <td className="p-2">{item.overall_score != null ? `${item.overall_score}%` : "-"}</td>
                      <td className="p-2 text-xs text-neutral-400">{new Date(item.created_at).toLocaleString("de-CH")}</td>
                      <td className="p-2 text-right">
                        <button onClick={() => deleteOne(item.token)} className="text-xs text-red-300 hover:text-red-200">
                          Löschen
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-300 mb-4">Report Detail</h2>
            {!selectedReport && <p className="text-sm text-neutral-500">Wähle links einen Report aus.</p>}
            {selectedReport && (
              <div className="space-y-4 text-sm">
                <div className="space-y-1">
                  <p><span className="text-neutral-400">Token:</span> {selectedReport.session.token}</p>
                  <p><span className="text-neutral-400">Name:</span> {selectedReport.session.name || "-"}</p>
                  <p><span className="text-neutral-400">Mail:</span> {selectedReport.session.email || "-"}</p>
                  <p><span className="text-neutral-400">Firma:</span> {selectedReport.session.company || "-"}</p>
                </div>
                <a
                  href={`/system-check/report/${selectedReport.session.token}`}
                  target="_blank"
                  className="inline-block text-amber-400 hover:text-amber-300"
                >
                  Öffentliche Report-Seite öffnen
                </a>
                <pre className="max-h-[50vh] overflow-auto rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-neutral-300">
                  {JSON.stringify(selectedReport.report, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </section>

        {busy && <p className="text-sm text-neutral-400">Lade Daten...</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <p className="text-xs uppercase tracking-wider text-neutral-400">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}
