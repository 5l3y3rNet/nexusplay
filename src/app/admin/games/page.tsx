"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Plus, Pencil, Eye, EyeOff, Trash2, Search, X, RefreshCw } from "lucide-react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { useAuth } from "@/contexts/auth";

interface Game { id: string; slug: string; title: string; filename: string; category: string; description: string; rtp: string; volatility: string; status: string; published: number; thumbnail: string; }

const GAME_FILES = ["Elevator.html","Hook.html","alien-enchant.html","bell-jump.html","bomb-defusal.html","chip_drop_v3.html","daredevil_drop.html","game_squid.html","multiplier-rush.html","train.html"];
const THUMBS = ["elevator","hook","xenocraft","bunny-job","bomb-defusal","chip-drop","daredevil-drop","glass-rush","multiplier-rush","train"];

export default function AdminGamesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [list, setList] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [mob, setMob] = useState(false);
  const [editing, setEditing] = useState<Game | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", filename: GAME_FILES[0], category: "Crash", description: "", rtp: "97.00%", volatility: "High", status: "active", thumbnail: "/thumbs/elevator.svg" });

  useEffect(() => {
    if (!authLoading) {
      if (!user) { router.push("/login"); return; }
      if (user.role !== "admin") { router.push("/partner/dashboard"); return; }
      load();
    }
  }, [user, authLoading]);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/games").then(res => res.json()).catch(() => ({ games: [] }));
    setList(r.games || []);
    setLoading(false);
  }

  async function addGame() {
    setErr(""); setSaving(true);
    const r = await fetch("/api/admin/games", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const d = await r.json();
    setSaving(false);
    if (!r.ok) { setErr(d.error); return; }
    setShowAdd(false);
    setForm({ title: "", slug: "", filename: GAME_FILES[0], category: "Crash", description: "", rtp: "97.00%", volatility: "High", status: "active", thumbnail: "/thumbs/elevator.svg" });
    load();
  }

  async function togglePublish(g: Game) {
    await fetch(`/api/admin/games/${g.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: g.published ? 0 : 1 }) });
    load();
  }

  async function saveEdit() {
    if (!editing) return;
    setSaving(true);
    await fetch(`/api/admin/games/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: editing.title, category: editing.category, rtp: editing.rtp, volatility: editing.volatility, description: editing.description }) });
    setSaving(false); setEditing(null); load();
  }

  async function deleteGame(id: string) {
    await fetch(`/api/admin/games/${id}`, { method: "DELETE" });
    load();
  }

  const filtered = list.filter(g => g.title.toLowerCase().includes(search.toLowerCase()) || g.category.toLowerCase().includes(search.toLowerCase()));
  const inp: React.CSSProperties = { width: "100%", background: "#090D1A", border: "1px solid #1e2740", borderRadius: "0.375rem", color: "#fafafa", fontSize: "0.875rem", padding: "0.5rem 0.75rem", outline: "none" };
  const lbl: React.CSSProperties = { display: "block", fontSize: "0.75rem", color: "#a1a1aa", marginBottom: "0.375rem" };

  if (authLoading || (user && user.role !== "admin")) return <div style={{ height: "100vh", background: "#090D1A", display: "flex", alignItems: "center", justifyContent: "center", color: "#71717a" }}>Loading…</div>;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#090D1A", overflow: "hidden" }}>
      <style>{`.admin-sb{display:none}@media(min-width:1024px){.admin-sb{display:flex}.admin-menu-btn{display:none!important}}`}</style>
      <div className="admin-sb" style={{ width: "14rem", flexShrink: 0 }}><AdminSidebar /></div>
      {mob && <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}><div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} onClick={() => setMob(false)} /><div style={{ position: "relative", width: "14rem", height: "100%" }}><AdminSidebar onClose={() => setMob(false)} /></div></div>}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ height: "4rem", borderBottom: "1px solid #1e2740", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={() => setMob(true)} className="admin-menu-btn" style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a", display: "flex" }}><Menu size={18} /></button>
            <h2 style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.875rem" }}>Game Management</h2>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={load} style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a" }}><RefreshCw size={15} /></button>
            <button onClick={() => setShowAdd(true)} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", background: "#f5a623", color: "#090D1A", fontSize: "0.8125rem", fontWeight: 700, padding: "0.5rem 0.875rem", borderRadius: "0.375rem", border: "none", cursor: "pointer" }}>
              <Plus size={14} /> Add Game
            </button>
          </div>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          <div style={{ position: "relative", maxWidth: "20rem", marginBottom: "1.25rem" }}>
            <Search size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#52525b" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search games..." style={{ ...inp, paddingLeft: "2.25rem", background: "#131a2e" }} />
          </div>

          <div style={{ background: "#0f1424", border: "1px solid #1e2740", borderRadius: "0.75rem", overflow: "hidden" }}>
            {loading ? <div style={{ padding: "3rem", textAlign: "center", color: "#52525b" }}>Loading…</div>
              : filtered.map(game => (
              <div key={game.id} style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.875rem 1.25rem", borderBottom: "1px solid #1e2740" }}>
                <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "0.375rem", overflow: "hidden", background: "#131a2e", flexShrink: 0 }}>
                  <img src={game.thumbnail} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 500, color: "#d4d4d8" }}>{game.title}</div>
                  <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#52525b" }}>{game.id} · {game.category} · {game.rtp}</div>
                </div>
                <span style={{ fontSize: "0.625rem", fontFamily: "monospace", padding: "0.125rem 0.5rem", borderRadius: "0.25rem", border: "1px solid", background: game.published ? "rgba(2,44,34,0.9)" : "#131a2e", color: game.published ? "#34d399" : "#71717a", borderColor: game.published ? "#064e3b" : "#3f3f46", flexShrink: 0 }}>
                  {game.published ? "Published" : "Hidden"}
                </span>
                <div style={{ display: "flex", gap: "0.625rem", flexShrink: 0 }}>
                  <button onClick={() => togglePublish(game)} style={{ background: "none", border: "none", cursor: "pointer", color: "#52525b" }} title={game.published ? "Unpublish" : "Publish"}>{game.published ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                  <button onClick={() => setEditing(game)} style={{ background: "none", border: "none", cursor: "pointer", color: "#52525b" }}><Pencil size={15} /></button>
                  <button onClick={() => deleteGame(game.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#52525b" }}><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Add modal */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem" }}>
          <div style={{ background: "#131a2e", border: "1px solid #1e2740", borderRadius: "0.75rem", padding: "1.5rem", width: "100%", maxWidth: "32rem", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <h3 style={{ fontWeight: 600, color: "#fafafa", fontSize: "1.0625rem" }}>Add New Game</h3>
              <button onClick={() => setShowAdd(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a" }}><X size={18} /></button>
            </div>
            {err && <div style={{ background: "rgba(28,10,10,0.9)", border: "1px solid #450a0a", borderRadius: "0.375rem", padding: "0.75rem", fontSize: "0.875rem", color: "#f87171", marginBottom: "1rem" }}>{err}</div>}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                <div><label style={lbl}>Title *</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") }))} placeholder="My New Game" style={inp} /></div>
                <div><label style={lbl}>Slug *</label><input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="my-new-game" style={inp} /></div>
              </div>
              <div>
                <label style={lbl}>Game File * (must exist in /public/games/)</label>
                <select value={form.filename} onChange={e => setForm(f => ({ ...f, filename: e.target.value }))} style={inp}>
                  {GAME_FILES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                <div>
                  <label style={lbl}>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inp}>
                    {["Crash","Arcade","Plinko","Minesweeper"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Thumbnail</label>
                  <select value={form.thumbnail} onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))} style={inp}>
                    {THUMBS.map(t => <option key={t} value={`/thumbs/${t}.svg`}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                <div><label style={lbl}>RTP</label><input value={form.rtp} onChange={e => setForm(f => ({ ...f, rtp: e.target.value }))} placeholder="97.00%" style={inp} /></div>
                <div>
                  <label style={lbl}>Volatility</label>
                  <select value={form.volatility} onChange={e => setForm(f => ({ ...f, volatility: e.target.value }))} style={inp}>
                    {["Low","Medium","High","Very High"].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div><label style={lbl}>Description</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Short game description" style={{ ...inp, resize: "none" }} /></div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button onClick={addGame} disabled={saving} style={{ flex: 1, background: "#f5a623", color: "#090D1A", fontWeight: 700, fontSize: "0.875rem", padding: "0.625rem", borderRadius: "0.375rem", border: "none", cursor: "pointer" }}>{saving ? "Adding…" : "Add Game"}</button>
                <button onClick={() => setShowAdd(false)} style={{ flex: 1, background: "#1e2740", color: "#d4d4d8", fontSize: "0.875rem", padding: "0.625rem", borderRadius: "0.375rem", border: "none", cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem" }}>
          <div style={{ background: "#131a2e", border: "1px solid #1e2740", borderRadius: "0.75rem", padding: "1.5rem", width: "100%", maxWidth: "28rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <h3 style={{ fontWeight: 600, color: "#fafafa" }}>Edit — {editing.title}</h3>
              <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              <div><label style={lbl}>Title</label><input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} style={inp} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                <div><label style={lbl}>Category</label><input value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} style={inp} /></div>
                <div><label style={lbl}>RTP</label><input value={editing.rtp} onChange={e => setEditing({ ...editing, rtp: e.target.value })} style={inp} /></div>
              </div>
              <div><label style={lbl}>Description</label><textarea value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} style={{ ...inp, resize: "none" }} /></div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button onClick={saveEdit} disabled={saving} style={{ flex: 1, background: "#f5a623", color: "#090D1A", fontWeight: 700, fontSize: "0.875rem", padding: "0.625rem", borderRadius: "0.375rem", border: "none", cursor: "pointer" }}>{saving ? "Saving…" : "Save"}</button>
                <button onClick={() => setEditing(null)} style={{ flex: 1, background: "#1e2740", color: "#d4d4d8", fontSize: "0.875rem", padding: "0.625rem", borderRadius: "0.375rem", border: "none", cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
