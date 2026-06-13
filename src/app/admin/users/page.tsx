"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Plus, Trash2, Copy, X, RefreshCw, KeyRound, Gamepad2, Check } from "lucide-react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { useAuth } from "@/contexts/auth";

interface DBGame { id: string; title: string; category: string; }
interface User { id: string; email: string; name: string; company: string; status: string; created_at: string; games: string[]; }

function genPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [allGames, setAllGames] = useState<DBGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [mob, setMob] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [assignFor, setAssignFor] = useState<User | null>(null);
  const [created, setCreated] = useState<{ email: string; password: string; loginUrl: string; apiKey: string } | null>(null);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState("");
  const [form, setForm] = useState({ name: "", email: "", company: "", password: genPassword(), games: [] as string[] });

  useEffect(() => {
    if (!authLoading) {
      if (!user) { router.push("/control-room-9f3a"); return; }
      if (user.role !== "admin") { router.push("/partner/dashboard"); return; }
      load();
    }
  }, [user, authLoading]);

  async function load() {
    setLoading(true);
    const [u, g] = await Promise.all([
      fetch("/api/admin/users").then(r => r.json()).catch(() => ({ users: [] })),
      fetch("/api/admin/games").then(r => r.json()).catch(() => ({ games: [] })),
    ]);
    setUsers(u.users || []);
    setAllGames(g.games || []);
    setLoading(false);
  }

  async function createUser() {
    setErr(""); setSaving(true);
    const r = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const d = await r.json();
    setSaving(false);
    if (!r.ok) { setErr(d.error); return; }
    setCreated({ email: form.email, password: form.password, loginUrl: d.loginUrl, apiKey: d.apiKey });
    setShowAdd(false);
    setForm({ name: "", email: "", company: "", password: genPassword(), games: [] });
    load();
  }

  async function saveAssignments() {
    if (!assignFor) return;
    setSaving(true);
    await fetch(`/api/admin/users/${assignFor.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ games: assignFor.games }) });
    setSaving(false); setAssignFor(null); load();
  }

  async function deleteUser(id: string) {
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    load();
  }

  function copy(key: string, val: string) { navigator.clipboard.writeText(val); setCopied(key); setTimeout(() => setCopied(""), 1500); }

  const inp: React.CSSProperties = { width: "100%", background: "#0c0e16", border: "1px solid #1e2230", borderRadius: "0.5rem", color: "#fafafa", fontSize: "0.875rem", padding: "0.5rem 0.75rem", outline: "none" };
  const lbl: React.CSSProperties = { display: "block", fontSize: "0.75rem", color: "#9aa0ad", marginBottom: "0.375rem" };

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
            <h2 style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.875rem" }}>Users</h2>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={load} style={{ background: "none", border: "none", cursor: "pointer", color: "#71757f" }}><RefreshCw size={15} /></button>
            <button onClick={() => { setForm({ name: "", email: "", company: "", password: genPassword(), games: [] }); setShowAdd(true); }} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", background: "#f5a623", color: "#09090b", fontSize: "0.8125rem", fontWeight: 700, padding: "0.5rem 0.875rem", borderRadius: "0.5rem", border: "none", cursor: "pointer" }}>
              <Plus size={14} /> Create User
            </button>
          </div>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          <div style={{ background: "#0c0e16", border: "1px solid #161a26", borderRadius: "0.75rem", overflow: "hidden" }}>
            {loading ? <div style={{ padding: "3rem", textAlign: "center", color: "#5a5e6b" }}>Loading…</div>
              : users.length === 0 ? <div style={{ padding: "3rem", textAlign: "center", color: "#5a5e6b", fontSize: "0.875rem" }}>No users yet. Create one to give an operator access.</div>
              : users.map(u => (
              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", borderBottom: "1px solid #161a26", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 500, color: "#e4e6ea" }}>{u.company}</div>
                  <div style={{ fontSize: "0.75rem", color: "#5a5e6b" }}>{u.email} · {u.name}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "#9aa0ad" }}>
                  <Gamepad2 size={13} style={{ color: "#f5a623" }} /> {u.games.length} game{u.games.length !== 1 ? "s" : ""} assigned
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => setAssignFor(u)} style={{ fontSize: "0.75rem", background: "#161a26", color: "#c4c7cf", border: "1px solid #1e2230", padding: "0.375rem 0.75rem", borderRadius: "0.375rem", cursor: "pointer" }}>Assign games</button>
                  <button onClick={() => deleteUser(u.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#5a5e6b" }}><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Create user modal */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem" }}>
          <div style={{ background: "#0c0e16", border: "1px solid #1e2230", borderRadius: "0.875rem", padding: "1.5rem", width: "100%", maxWidth: "32rem", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <h3 style={{ fontWeight: 700, color: "#fafafa", fontSize: "1.0625rem" }}>Create Operator Account</h3>
              <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#71757f" }}><X size={18} /></button>
            </div>
            {err && <div style={{ background: "rgba(40,12,12,0.9)", border: "1px solid #4a1515", borderRadius: "0.5rem", padding: "0.75rem", fontSize: "0.875rem", color: "#f87171", marginBottom: "1rem" }}>{err}</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                <div><label style={lbl}>Contact name *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Alex Smith" style={inp} /></div>
                <div><label style={lbl}>Company *</label><input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Ace Casino" style={inp} /></div>
              </div>
              <div><label style={lbl}>Login email *</label><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="ops@acecasino.com" style={inp} /></div>
              <div>
                <label style={lbl}>Password * (share this with the operator)</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} style={{ ...inp, fontFamily: "monospace" }} />
                  <button onClick={() => setForm(f => ({ ...f, password: genPassword() }))} style={{ flexShrink: 0, background: "#161a26", border: "1px solid #1e2230", borderRadius: "0.5rem", color: "#c4c7cf", padding: "0 0.75rem", cursor: "pointer", fontSize: "0.75rem" }}>Regenerate</button>
                </div>
              </div>
              <div>
                <label style={lbl}>Assign games</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", maxHeight: "10rem", overflowY: "auto", padding: "0.25rem" }}>
                  {allGames.map(g => {
                    const on = form.games.includes(g.id);
                    return (
                      <button key={g.id} type="button" onClick={() => setForm(f => ({ ...f, games: on ? f.games.filter(x => x !== g.id) : [...f.games, g.id] }))}
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", padding: "0.375rem 0.625rem", borderRadius: "0.375rem", cursor: "pointer", border: "1px solid", background: on ? "rgba(245,166,35,0.12)" : "#0c0e16", color: on ? "#f5a623" : "#9aa0ad", borderColor: on ? "rgba(245,166,35,0.4)" : "#1e2230" }}>
                        {on && <Check size={11} />} {g.title}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button onClick={createUser} disabled={saving} style={{ flex: 1, background: "#f5a623", color: "#09090b", fontWeight: 700, fontSize: "0.875rem", padding: "0.625rem", borderRadius: "0.5rem", border: "none", cursor: "pointer" }}>{saving ? "Creating…" : "Create account"}</button>
                <button onClick={() => setShowAdd(false)} style={{ flex: 1, background: "#161a26", color: "#c4c7cf", fontSize: "0.875rem", padding: "0.625rem", borderRadius: "0.5rem", border: "none", cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Credentials reveal modal */}
      {created && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: "1rem" }}>
          <div style={{ background: "#0c0e16", border: "1px solid #1e2230", borderRadius: "0.875rem", padding: "1.75rem", width: "100%", maxWidth: "30rem" }}>
            <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "0.75rem", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <KeyRound size={20} style={{ color: "#22c55e" }} />
            </div>
            <h3 style={{ fontWeight: 700, color: "#fafafa", fontSize: "1.125rem", marginBottom: "0.5rem" }}>Account created</h3>
            <p style={{ fontSize: "0.875rem", color: "#9aa0ad", marginBottom: "1.25rem", lineHeight: 1.6 }}>Share these credentials with the operator. The password won&apos;t be shown again.</p>
            {[
              { k: "Login URL", v: created.loginUrl || `${typeof window !== "undefined" ? window.location.origin : ""}/login` },
              { k: "Email", v: created.email },
              { k: "Password", v: created.password },
              { k: "API Key", v: created.apiKey },
            ].map(row => (
              <div key={row.k} style={{ marginBottom: "0.75rem" }}>
                <div style={{ fontSize: "0.6875rem", color: "#5a5e6b", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{row.k}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#080a0f", border: "1px solid #1e2230", borderRadius: "0.5rem", padding: "0.5rem 0.75rem" }}>
                  <span style={{ flex: 1, fontSize: "0.8125rem", fontFamily: "monospace", color: "#e4e6ea", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.v}</span>
                  <button onClick={() => copy(row.k, row.v)} style={{ background: "none", border: "none", cursor: "pointer", color: copied === row.k ? "#22c55e" : "#71757f", flexShrink: 0 }}>{copied === row.k ? <Check size={14} /> : <Copy size={14} />}</button>
                </div>
              </div>
            ))}
            <button onClick={() => setCreated(null)} style={{ width: "100%", background: "#f5a623", color: "#09090b", fontWeight: 700, fontSize: "0.875rem", padding: "0.75rem", borderRadius: "0.625rem", border: "none", cursor: "pointer", marginTop: "0.75rem" }}>Done</button>
          </div>
        </div>
      )}

      {/* Assign games modal */}
      {assignFor && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem" }}>
          <div style={{ background: "#0c0e16", border: "1px solid #1e2230", borderRadius: "0.875rem", padding: "1.5rem", width: "100%", maxWidth: "30rem", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h3 style={{ fontWeight: 700, color: "#fafafa" }}>Games for {assignFor.company}</h3>
              <button onClick={() => setAssignFor(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#71757f" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: "1.25rem" }}>
              {allGames.map(g => {
                const on = assignFor.games.includes(g.id);
                return (
                  <button key={g.id} type="button" onClick={() => setAssignFor({ ...assignFor, games: on ? assignFor.games.filter(x => x !== g.id) : [...assignFor.games, g.id] })}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", padding: "0.5rem 0.75rem", borderRadius: "0.5rem", cursor: "pointer", border: "1px solid", background: on ? "rgba(245,166,35,0.12)" : "#080a0f", color: on ? "#f5a623" : "#9aa0ad", borderColor: on ? "rgba(245,166,35,0.4)" : "#1e2230" }}>
                    {on && <Check size={12} />} {g.title}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={saveAssignments} disabled={saving} style={{ flex: 1, background: "#f5a623", color: "#09090b", fontWeight: 700, fontSize: "0.875rem", padding: "0.625rem", borderRadius: "0.5rem", border: "none", cursor: "pointer" }}>{saving ? "Saving…" : "Save assignments"}</button>
              <button onClick={() => setAssignFor(null)} style={{ flex: 1, background: "#161a26", color: "#c4c7cf", fontSize: "0.875rem", padding: "0.625rem", borderRadius: "0.5rem", border: "none", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
