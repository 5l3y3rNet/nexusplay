"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, RefreshCw } from "lucide-react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { useAuth } from "@/contexts/auth";

interface Partner { id: string; email: string; name: string; company: string; country: string; license_number: string; status: string; created_at: string; }
const statusStyles: Record<string, React.CSSProperties> = {
  active: { background: "rgba(2,44,34,0.9)", color: "#34d399", borderColor: "#064e3b" },
  pending: { background: "rgba(26,18,0,0.9)", color: "#facc15", borderColor: "#3b2700" },
  suspended: { background: "rgba(28,10,10,0.9)", color: "#f87171", borderColor: "#450a0a" },
};

export default function PartnersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [list, setList] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [mob, setMob] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) { router.push("/partner/login"); return; }
      if (user.role !== "admin") { router.push("/partner/dashboard"); return; }
      load();
    }
  }, [user, authLoading]);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/partners").then(res => res.json()).catch(() => ({ partners: [] }));
    setList(r.partners || []);
    setLoading(false);
  }

  async function setStatus(id: string, status: string) {
    await fetch(`/api/admin/partners/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  }

  const filtered = list.filter(p => {
    const ms = p.company?.toLowerCase().includes(search.toLowerCase()) || p.email?.toLowerCase().includes(search.toLowerCase());
    return ms && (filter === "all" || p.status === filter);
  });

  if (authLoading || (user && user.role !== "admin")) return <div style={{ height: "100vh", background: "#09090b", display: "flex", alignItems: "center", justifyContent: "center", color: "#71717a" }}>Loading…</div>;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#09090b", overflow: "hidden" }}>
      <style>{`.admin-sb{display:none}@media(min-width:1024px){.admin-sb{display:flex}.admin-menu-btn{display:none!important}}`}</style>
      <div className="admin-sb" style={{ width: "14rem", flexShrink: 0 }}><AdminSidebar /></div>
      {mob && <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}><div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} onClick={() => setMob(false)} /><div style={{ position: "relative", width: "14rem", height: "100%" }}><AdminSidebar onClose={() => setMob(false)} /></div></div>}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ height: "4rem", borderBottom: "1px solid #27272a", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={() => setMob(true)} className="admin-menu-btn" style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a", display: "flex" }}><Menu size={18} /></button>
            <h2 style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.875rem" }}>Partner Management</h2>
          </div>
          <button onClick={load} style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a" }}><RefreshCw size={15} /></button>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div style={{ position: "relative", flex: "1 1 200px", minWidth: "200px", maxWidth: "20rem" }}>
              <Search size={13} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#52525b" }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search partners..." style={{ width: "100%", background: "#18181b", border: "1px solid #27272a", borderRadius: "0.5rem", color: "#fafafa", fontSize: "0.875rem", padding: "0.5rem 0.75rem 0.5rem 2.25rem", outline: "none" }} />
            </div>
            <div style={{ display: "flex", gap: "0.25rem", background: "#18181b", border: "1px solid #27272a", borderRadius: "0.5rem", padding: "0.25rem", overflowX: "auto" }}>
              {["all","active","pending","suspended"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ padding: "0.375rem 0.75rem", fontSize: "0.75rem", borderRadius: "0.375rem", border: "none", cursor: "pointer", textTransform: "capitalize", whiteSpace: "nowrap", background: filter === f ? "#3f3f46" : "transparent", color: filter === f ? "#fafafa" : "#71717a" }}>{f}</button>
              ))}
            </div>
          </div>

          <div style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "0.75rem", overflow: "hidden" }}>
            {loading ? <div style={{ padding: "3rem", textAlign: "center", color: "#52525b" }}>Loading…</div>
              : filtered.length === 0 ? <div style={{ padding: "3rem", textAlign: "center", color: "#52525b", fontSize: "0.875rem" }}>No partners yet. New registrations appear here.</div>
              : filtered.map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", borderBottom: "1px solid #27272a", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 500, color: "#d4d4d8" }}>{p.company}</div>
                  <div style={{ fontSize: "0.75rem", color: "#52525b" }}>{p.email} · {p.country || "—"} · {p.license_number || "no license"}</div>
                </div>
                <span style={{ fontSize: "0.625rem", fontFamily: "monospace", padding: "0.125rem 0.5rem", borderRadius: "0.25rem", border: "1px solid", ...statusStyles[p.status] }}>{p.status}</span>
                <div style={{ display: "flex", gap: "0.375rem" }}>
                  {p.status === "pending" && <button onClick={() => setStatus(p.id, "active")} style={{ fontSize: "0.75rem", background: "rgba(2,44,34,0.9)", color: "#34d399", border: "1px solid #064e3b", padding: "0.375rem 0.75rem", borderRadius: "0.375rem", cursor: "pointer" }}>Approve</button>}
                  {p.status === "active" && <button onClick={() => setStatus(p.id, "suspended")} style={{ fontSize: "0.75rem", background: "#18181b", color: "#71717a", border: "1px solid #27272a", padding: "0.375rem 0.75rem", borderRadius: "0.375rem", cursor: "pointer" }}>Suspend</button>}
                  {p.status === "suspended" && <button onClick={() => setStatus(p.id, "active")} style={{ fontSize: "0.75rem", background: "#18181b", color: "#71717a", border: "1px solid #27272a", padding: "0.375rem 0.75rem", borderRadius: "0.375rem", cursor: "pointer" }}>Reinstate</button>}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
