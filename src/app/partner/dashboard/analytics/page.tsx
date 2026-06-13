"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, TrendingUp, RefreshCw } from "lucide-react";
import { PartnerSidebar } from "@/components/layout/partner-sidebar";
import { useAuth } from "@/contexts/auth";
import { games } from "@/lib/games";

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [range, setRange] = useState("all");
  const [mob, setMob] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    if (user) loadData();
  }, [user, authLoading]);

  async function loadData() {
    setLoading(true);
    const [a, s] = await Promise.all([
      fetch("/api/analytics").then(r => r.json()),
      fetch("/api/sessions").then(r => r.json()),
    ]);
    setAnalytics(a);
    setSessions(s.sessions || []);
    setLoading(false);
  }

  const card: React.CSSProperties = { background: "#111113", border: "1px solid #27272a", borderRadius: "0.75rem" };

  const topGames = analytics?.topGames || [];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#09090b", overflow: "hidden" }}>
      <div className="hidden lg:block" style={{ width: "15rem", flexShrink: 0 }}><PartnerSidebar /></div>
      {mob && <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}><div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} onClick={() => setMob(false)} /><div style={{ position: "relative", width: "15rem", height: "100%" }}><PartnerSidebar onClose={() => setMob(false)} /></div></div>}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ height: "4rem", borderBottom: "1px solid #27272a", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={() => setMob(true)} className="lg:hidden" style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a" }}><Menu size={18} /></button>
            <h2 style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.875rem" }}>Analytics</h2>
          </div>
          <button onClick={loadData} style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a" }}><RefreshCw size={15} /></button>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {[
              { label: "Total Sessions", value: analytics?.totalSessions },
              { label: "Active Sessions", value: analytics?.activeSessions },
              { label: "API Keys", value: analytics?.apiKeys },
              { label: "Top Game", value: topGames[0] ? games.find(g => g.id === topGames[0].game_id)?.title?.split(" ")[0] : "—" },
            ].map(s => (
              <div key={s.label} style={{ ...card, padding: "1rem" }}>
                <div style={{ fontSize: "0.75rem", color: "#71717a", marginBottom: "0.5rem" }}>{s.label}</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fafafa", fontFamily: "monospace" }}>{loading ? "…" : s.value ?? 0}</div>
              </div>
            ))}
          </div>

          {/* Session list */}
          <div style={{ ...card, marginBottom: "1rem" }}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #27272a" }}>
              <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fafafa" }}>All Sessions</h3>
            </div>
            {loading ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#52525b" }}>Loading…</div>
            ) : sessions.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#52525b", fontSize: "0.875rem" }}>No sessions yet. Launch a game demo to create your first session.</div>
            ) : sessions.map(s => {
              const game = games.find(g => g.id === s.game_id);
              return (
                <div key={s.id} style={{ display: "grid", gridTemplateColumns: "6px 1fr 1fr auto auto", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1.25rem", borderBottom: "1px solid #27272a" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.status === "active" ? "#34d399" : s.status === "expired" ? "#f87171" : "#3f3f46" }} />
                  <div>
                    <div style={{ fontSize: "0.875rem", color: "#d4d4d8" }}>{game?.title ?? s.game_id}</div>
                    <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#52525b" }}>player: {s.player_id}</div>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#71717a" }}>{s.currency} · {s.balance}</div>
                  <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: s.status === "active" ? "#34d399" : "#71717a" }}>{s.status}</div>
                  <div style={{ fontSize: "0.75rem", color: "#52525b" }}>{new Date(s.created_at).toLocaleDateString()}</div>
                </div>
              );
            })}
          </div>

          {/* Top games */}
          {topGames.length > 0 && (
            <div style={card}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #27272a" }}>
                <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fafafa" }}>Top Games by Sessions</h3>
              </div>
              <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {topGames.map((g: any) => {
                  const game = games.find(gm => gm.id === g.game_id);
                  const maxCount = topGames[0]?.count || 1;
                  return (
                    <div key={g.game_id} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ width: "8rem", fontSize: "0.75rem", color: "#a1a1aa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{game?.title ?? g.game_id}</div>
                      <div style={{ flex: 1, background: "#18181b", borderRadius: "9999px", height: "6px", overflow: "hidden" }}>
                        <div style={{ height: "100%", background: "#52525b", borderRadius: "9999px", width: `${(g.count / maxCount) * 100}%` }} />
                      </div>
                      <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#71717a" }}>{g.count}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
