"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, RefreshCw, Trash2, Mail, Check } from "lucide-react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { useAuth } from "@/contexts/auth";

interface Inquiry { id: string; name: string; email: string; company: string; role: string; games_interested: string[]; message: string; status: string; created_at: string; }

export default function InquiriesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [list, setList] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [mob, setMob] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!authLoading) {
      if (!user) { router.push("/control-room-9f3a"); return; }
      if (user.role !== "admin") { router.push("/partner/dashboard"); return; }
      load();
    }
  }, [user, authLoading]);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/inquiries").then(res => res.json()).catch(() => ({ inquiries: [] }));
    setList(r.inquiries || []);
    setLoading(false);
  }

  async function setStatus(id: string, status: string) {
    await fetch(`/api/inquiries/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    load();
  }
  async function del(id: string) {
    await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
    load();
  }

  const filtered = filter === "all" ? list : list.filter(i => i.status === filter);

  if (authLoading || (user && user.role !== "admin")) return <div style={{ height: "100vh", background: "#080a0f", display: "flex", alignItems: "center", justifyContent: "center", color: "#71757f" }}>Loading…</div>;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#080a0f", overflow: "hidden" }}>
      <style>{`.admin-sb{display:none}@media(min-width:1024px){.admin-sb{display:flex}.admin-menu-btn{display:none!important}}`}</style>
      <div className="admin-sb" style={{ width: "14rem", flexShrink: 0 }}><AdminSidebar /></div>
      {mob && <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}><div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} onClick={() => setMob(false)} /><div style={{ position: "relative", width: "14rem", height: "100%" }}><AdminSidebar onClose={() => setMob(false)} /></div></div>}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ height: "4rem", borderBottom: "1px solid #1c1f2b", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={() => setMob(true)} className="admin-menu-btn" style={{ background: "none", border: "none", cursor: "pointer", color: "#71757f", display: "flex" }}><Menu size={18} /></button>
            <h2 style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.875rem" }}>Partner Inquiries</h2>
            {list.filter(i => i.status === "new").length > 0 && <span style={{ fontSize: "0.6875rem", fontFamily: "monospace", background: "rgba(245,166,35,0.15)", color: "#f5a623", border: "1px solid rgba(245,166,35,0.3)", padding: "0.125rem 0.5rem", borderRadius: "9999px" }}>{list.filter(i => i.status === "new").length} new</span>}
          </div>
          <button onClick={load} style={{ background: "none", border: "none", cursor: "pointer", color: "#71757f" }}><RefreshCw size={15} /></button>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.25rem", background: "#0c0e16", border: "1px solid #161a26", borderRadius: "0.5rem", padding: "0.25rem", width: "fit-content" }}>
            {["all", "new", "read", "replied"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: "0.375rem 0.875rem", fontSize: "0.8125rem", borderRadius: "0.375rem", border: "none", cursor: "pointer", textTransform: "capitalize", background: filter === f ? "#1c2230" : "transparent", color: filter === f ? "#fafafa" : "#71757f" }}>{f}</button>
            ))}
          </div>

          {loading ? <div style={{ padding: "3rem", textAlign: "center", color: "#5a5e6b" }}>Loading…</div>
            : filtered.length === 0 ? <div style={{ padding: "4rem", textAlign: "center", color: "#5a5e6b", fontSize: "0.875rem" }}>No inquiries{filter !== "all" ? ` (${filter})` : ""} yet.</div>
            : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {filtered.map(i => (
                <div key={i.id} style={{ background: "#0c0e16", border: `1px solid ${i.status === "new" ? "rgba(245,166,35,0.25)" : "#161a26"}`, borderRadius: "0.75rem", padding: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <span style={{ fontSize: "1rem", fontWeight: 700, color: "#fafafa" }}>{i.company || i.name}</span>
                        {i.status === "new" && <span style={{ fontSize: "0.625rem", fontFamily: "monospace", background: "rgba(245,166,35,0.15)", color: "#f5a623", padding: "0.125rem 0.5rem", borderRadius: "9999px" }}>NEW</span>}
                      </div>
                      <div style={{ fontSize: "0.8125rem", color: "#71757f" }}>{i.name} · {i.role || "—"}</div>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#5a5e6b" }}>{new Date(i.created_at).toLocaleString()}</div>
                  </div>

                  <a href={`mailto:${i.email}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: "#f5a623", textDecoration: "none", marginBottom: "0.75rem" }}>
                    <Mail size={13} /> {i.email}
                  </a>

                  {i.games_interested?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: "0.75rem" }}>
                      {i.games_interested.map(g => <span key={g} style={{ fontSize: "0.6875rem", fontFamily: "monospace", background: "#161a26", color: "#9aa0ad", padding: "0.125rem 0.5rem", borderRadius: "0.25rem" }}>{g}</span>)}
                    </div>
                  )}

                  {i.message && <p style={{ fontSize: "0.875rem", color: "#a8adb8", lineHeight: 1.6, marginBottom: "1rem", padding: "0.75rem", background: "#080a0f", borderRadius: "0.5rem", border: "1px solid #161a26" }}>{i.message}</p>}

                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {i.status !== "read" && <button onClick={() => setStatus(i.id, "read")} style={{ fontSize: "0.75rem", background: "#161a26", color: "#c4c7cf", border: "1px solid #1e2230", padding: "0.375rem 0.75rem", borderRadius: "0.375rem", cursor: "pointer" }}>Mark read</button>}
                    {i.status !== "replied" && <button onClick={() => setStatus(i.id, "replied")} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)", padding: "0.375rem 0.75rem", borderRadius: "0.375rem", cursor: "pointer" }}><Check size={12} /> Mark replied</button>}
                    <button onClick={() => del(i.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#5a5e6b", marginLeft: "auto" }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
