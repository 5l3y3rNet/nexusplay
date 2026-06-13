"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Bell, Eye, EyeOff, Copy, Plus, ChevronRight, ExternalLink, RefreshCw } from "lucide-react";
import { PartnerSidebar } from "@/components/layout/partner-sidebar";
import { useAuth } from "@/contexts/auth";
import { games } from "@/lib/games";

interface ApiKey { id: string; name: string; key_prefix: string; env: string; last_used_at: string | null; request_count: number; created_at: string; }
interface Session { id: string; game_id: string; player_id: string; currency: string; status: string; created_at: string; }
interface Analytics { totalSessions: number; activeSessions: number; apiKeys: number; topGames: { game_id: string; count: number }[]; }

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [mob, setMob] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    if (user) loadData();
  }, [user, authLoading]);

  async function loadData() {
    setDataLoading(true);
    try {
      const [keysR, sessionsR, analyticsR] = await Promise.all([
        fetch("/api/keys").then(r => r.json()),
        fetch("/api/sessions").then(r => r.json()),
        fetch("/api/analytics").then(r => r.json()),
      ]);
      setKeys(keysR.keys || []);
      setSessions(sessionsR.sessions || []);
      setAnalytics(analyticsR);
    } catch (e) { console.error(e); }
    setDataLoading(false);
  }

  const card: React.CSSProperties = { background: "#111113", border: "1px solid #27272a", borderRadius: "0.75rem" };

  if (authLoading) return <div style={{ height: "100vh", background: "#09090b", display: "flex", alignItems: "center", justifyContent: "center", color: "#71717a" }}>Loading…</div>;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#09090b", overflow: "hidden" }}>
      <div className="hidden lg:block" style={{ width: "15rem", flexShrink: 0 }}><PartnerSidebar /></div>
      {mob && <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}><div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} onClick={() => setMob(false)} /><div style={{ position: "relative", width: "15rem", height: "100%" }}><PartnerSidebar onClose={() => setMob(false)} /></div></div>}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ height: "4rem", borderBottom: "1px solid #27272a", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={() => setMob(true)} className="lg:hidden" style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a" }}><Menu size={18} /></button>
            <h2 style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.875rem" }}>Overview</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#18181b", border: "1px solid #27272a", borderRadius: "9999px", padding: "0.375rem 0.75rem" }}>
              <span className="status-dot" /><span style={{ fontSize: "0.75rem", color: "#a1a1aa", fontFamily: "monospace" }}>API operational</span>
            </div>
            <button onClick={loadData} style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a" }} title="Refresh"><RefreshCw size={15} /></button>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {/* Welcome */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#fafafa" }}>Welcome back, {user?.name?.split(" ")[0]}</h3>
            <p style={{ fontSize: "0.875rem", color: "#71717a", marginTop: "0.25rem" }}>{user?.company} · <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: user?.status === "active" ? "#34d399" : "#facc15" }}>{user?.status}</span></p>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {[
              { label: "Total Sessions", value: analytics?.totalSessions ?? "—" },
              { label: "Active Now", value: analytics?.activeSessions ?? "—" },
              { label: "API Keys", value: analytics?.apiKeys ?? "—" },
              { label: "Games Available", value: games.length },
            ].map(s => (
              <div key={s.label} style={{ ...card, padding: "1rem" }}>
                <div style={{ fontSize: "0.75rem", color: "#71717a", marginBottom: "0.5rem" }}>{s.label}</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fafafa", fontFamily: "monospace" }}>{dataLoading ? "…" : s.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }} className="lg:grid-cols-2">
            {/* Recent sessions */}
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid #27272a" }}>
                <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fafafa" }}>Recent Sessions</h3>
                <Link href="/partner/dashboard/analytics" style={{ fontSize: "0.75rem", color: "#71717a", textDecoration: "none" }}>View all →</Link>
              </div>
              {dataLoading ? (
                <div style={{ padding: "2rem", textAlign: "center", color: "#52525b", fontSize: "0.875rem" }}>Loading…</div>
              ) : sessions.length === 0 ? (
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <p style={{ color: "#52525b", fontSize: "0.875rem", marginBottom: "0.75rem" }}>No sessions yet.</p>
                  <Link href="/games" style={{ fontSize: "0.875rem", color: "#a1a1aa", textDecoration: "none" }}>Browse games to launch a demo →</Link>
                </div>
              ) : sessions.slice(0, 6).map(s => {
                const game = games.find(g => g.id === s.game_id);
                return (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1.25rem", borderBottom: "1px solid #27272a" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0, background: s.status === "active" ? "#34d399" : s.status === "expired" ? "#f87171" : "#3f3f46" }} />
                    <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#52525b", width: "5rem", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis" }}>{s.id.slice(0, 8)}…</div>
                    <div style={{ fontSize: "0.875rem", color: "#d4d4d8", flex: 1 }}>{game?.title ?? s.game_id}</div>
                    <div style={{ fontSize: "0.75rem", color: "#52525b", fontFamily: "monospace" }}>{s.status}</div>
                    <div style={{ fontSize: "0.75rem", color: "#3f3f46" }}>{new Date(s.created_at).toLocaleDateString()}</div>
                  </div>
                );
              })}
            </div>

            {/* Right side */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* API keys quick view */}
              <div style={card}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid #27272a" }}>
                  <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fafafa" }}>API Keys</h3>
                  <Link href="/partner/dashboard/api-keys" style={{ fontSize: "0.75rem", color: "#71717a", textDecoration: "none" }}>Manage →</Link>
                </div>
                <div style={{ padding: "1rem 1.25rem" }}>
                  {dataLoading ? <div style={{ color: "#52525b", fontSize: "0.875rem" }}>Loading…</div> :
                    keys.length === 0 ? (
                      <Link href="/partner/dashboard/api-keys" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#71717a", textDecoration: "none" }}>
                        <Plus size={13} /> Create your first API key
                      </Link>
                    ) : keys.slice(0, 2).map(k => (
                      <div key={k.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: k.env === "live" ? "#34d399" : "#facc15", flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "0.875rem", color: "#d4d4d8" }}>{k.name}</div>
                          <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#52525b" }}>{k.key_prefix}•••••••</div>
                        </div>
                        <span style={{ fontSize: "0.625rem", fontFamily: "monospace", background: k.env === "live" ? "rgba(2,44,34,0.9)" : "rgba(26,18,0,0.9)", color: k.env === "live" ? "#34d399" : "#facc15", border: `1px solid ${k.env === "live" ? "#064e3b" : "#3b2700"}`, padding: "0.125rem 0.5rem", borderRadius: "0.25rem" }}>{k.env}</span>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Quick links */}
              <div style={card}>
                <div style={{ padding: "1rem 1.25rem" }}>
                  <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fafafa", marginBottom: "0.75rem" }}>Quick links</h3>
                  {[["API Reference", "/docs/api"], ["Integration Guide", "/docs/getting-started"], ["Game Catalog", "/games"], ["Webhook Setup", "/partner/dashboard/webhooks"]].map(([l, h]) => (
                    <Link key={l} href={h} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0", fontSize: "0.875rem", color: "#a1a1aa", textDecoration: "none", borderBottom: "1px solid #27272a" }}>
                      {l}<ChevronRight size={12} style={{ color: "#3f3f46" }} />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Games */}
              <div style={card}>
                <div style={{ padding: "1rem 1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fafafa" }}>Your games</h3>
                    <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#52525b" }}>{games.length} total</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.375rem", marginBottom: "0.75rem" }}>
                    {games.map(g => (
                      <Link key={g.id} href={`/games/${g.slug}`} title={g.title} style={{ aspectRatio: "1", borderRadius: "0.25rem", overflow: "hidden", background: "#18181b", border: "1px solid #27272a", display: "block" }}>
                        <img src={g.thumbnail} alt={g.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </Link>
                    ))}
                  </div>
                  <Link href="/games" style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "#71717a", textDecoration: "none" }}>
                    Browse catalog <ExternalLink size={10} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
