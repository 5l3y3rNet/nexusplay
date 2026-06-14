"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Bell, Users, Gamepad2, Activity, Globe, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { useAuth } from "@/contexts/auth";

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [mob, setMob] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) { router.push("/login"); return; }
      if (user.role !== "admin") { router.push("/partner/dashboard"); return; }
      loadStats();
    }
  }, [user, authLoading]);

  async function loadStats() {
    setLoading(true);
    const r = await fetch("/api/admin/stats").then(res => res.json()).catch(() => null);
    setStats(r);
    setLoading(false);
  }

  const card: React.CSSProperties = { background: "#0f1424", border: "1px solid #1e2740", borderRadius: "0.75rem", overflow: "hidden" };

  if (authLoading || (user && user.role !== "admin")) {
    return <div style={{ height: "100vh", background: "#090D1A", display: "flex", alignItems: "center", justifyContent: "center", color: "#71717a" }}>Loading…</div>;
  }

  const statCards = [
    { label: "Partners", value: stats?.partners, icon: <Users size={14} /> },
    { label: "Games", value: stats?.games, icon: <Gamepad2 size={14} /> },
    { label: "Total Sessions", value: stats?.sessions, icon: <Activity size={14} /> },
    { label: "API Keys", value: stats?.apiKeys, icon: <Globe size={14} /> },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#090D1A", overflow: "hidden" }}>
      <style>{`.admin-sb{display:none}@media(min-width:1024px){.admin-sb{display:flex}}`}</style>
      <div className="admin-sb" style={{ width: "14rem", flexShrink: 0 }}><AdminSidebar /></div>
      {mob && <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}><div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} onClick={() => setMob(false)} /><div style={{ position: "relative", width: "14rem", height: "100%" }}><AdminSidebar onClose={() => setMob(false)} /></div></div>}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ height: "4rem", borderBottom: "1px solid #1e2740", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={() => setMob(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a", display: "flex" }} className="admin-menu-btn"><Menu size={18} /></button>
            <h2 style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.875rem" }}>Platform Overview</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#131a2e", border: "1px solid #1e2740", borderRadius: "9999px", padding: "0.375rem 0.75rem" }}>
              <span className="status-dot" /><span style={{ fontSize: "0.75rem", color: "#a1a1aa", fontFamily: "monospace" }}>operational</span>
            </div>
            <button onClick={loadStats} style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a" }}><RefreshCw size={15} /></button>
          </div>
        </header>
        <style>{`@media(min-width:1024px){.admin-menu-btn{display:none!important}}`}</style>
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {statCards.map(s => (
              <div key={s.label} style={{ ...card, padding: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#71717a" }}>{s.label}</span>
                  <span style={{ color: "#52525b" }}>{s.icon}</span>
                </div>
                <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#fafafa", fontFamily: "monospace" }}>{loading ? "…" : s.value ?? 0}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
              <Link href="/admin/games" style={{ ...card, padding: "1.5rem", textDecoration: "none", display: "block" }}>
                <Gamepad2 size={20} style={{ color: "#a1a1aa", marginBottom: "0.75rem" }} />
                <div style={{ fontWeight: 600, color: "#fafafa", marginBottom: "0.25rem" }}>Manage Games</div>
                <div style={{ fontSize: "0.875rem", color: "#52525b" }}>Add, edit, publish, or remove games</div>
              </Link>
              <Link href="/admin/partners" style={{ ...card, padding: "1.5rem", textDecoration: "none", display: "block" }}>
                <Users size={20} style={{ color: "#a1a1aa", marginBottom: "0.75rem" }} />
                <div style={{ fontWeight: 600, color: "#fafafa", marginBottom: "0.25rem" }}>Manage Partners</div>
                <div style={{ fontSize: "0.875rem", color: "#52525b" }}>Approve, suspend, review applications</div>
              </Link>
            </div>

            <div style={card}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #1e2740" }}>
                <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fafafa" }}>Recent Activity</h3>
              </div>
              {loading ? <div style={{ padding: "2rem", textAlign: "center", color: "#52525b" }}>Loading…</div>
                : !stats?.recentActivity?.length ? <div style={{ padding: "2rem", textAlign: "center", color: "#52525b", fontSize: "0.875rem" }}>No activity yet.</div>
                : stats.recentActivity.map((a: any, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1.25rem", borderBottom: "1px solid #1e2740" }}>
                    <CheckCircle2 size={13} style={{ color: "#52525b", flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: "0.875rem", color: "#d4d4d8" }}>{a.action}</div>
                    <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#52525b" }}>{a.email || "system"}</div>
                    <div style={{ fontSize: "0.75rem", color: "#3f3f46" }}>{new Date(a.created_at).toLocaleString()}</div>
                  </div>
                ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
