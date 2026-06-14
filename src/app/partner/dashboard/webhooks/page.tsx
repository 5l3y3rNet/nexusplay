"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Plus, Trash2, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { PartnerSidebar } from "@/components/layout/partner-sidebar";
import { useAuth } from "@/contexts/auth";

const ALL_EVENTS = ["session.created","session.expired","bet.placed","win.credited","game.started","game.ended","rollback.requested"];

interface Webhook { id: string; url: string; events: string[]; status: string; delivery_count: number; last_delivery_at: string | null; last_delivery_status: string | null; }

export default function WebhooksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [hooks, setHooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [mob, setMob] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newEvents, setNewEvents] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [newSecret, setNewSecret] = useState("");

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    if (user) loadHooks();
  }, [user, authLoading]);

  async function loadHooks() {
    setLoading(true);
    const r = await fetch("/api/webhooks").then(res => res.json());
    setHooks(r.webhooks || []);
    setLoading(false);
  }

  async function createHook() {
    if (!newUrl || !newEvents.length) return;
    setCreating(true);
    const r = await fetch("/api/webhooks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: newUrl, events: newEvents }) });
    const d = await r.json();
    setCreating(false);
    if (d.webhook) {
      setHooks(prev => [...prev, d.webhook]);
      setNewSecret(d.webhook.secret);
      setNewUrl(""); setNewEvents([]);
    }
  }

  async function deleteHook(id: string) {
    await fetch(`/api/webhooks/${id}`, { method: "DELETE" });
    setHooks(prev => prev.filter(h => h.id !== id));
  }

  const card: React.CSSProperties = { background: "#0f1424", border: "1px solid #1e2740", borderRadius: "0.75rem", overflow: "hidden" };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#090D1A", overflow: "hidden" }}>
      <div className="hidden lg:block" style={{ width: "15rem", flexShrink: 0 }}><PartnerSidebar /></div>
      {mob && <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}><div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} onClick={() => setMob(false)} /><div style={{ position: "relative", width: "15rem", height: "100%" }}><PartnerSidebar onClose={() => setMob(false)} /></div></div>}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ height: "4rem", borderBottom: "1px solid #1e2740", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={() => setMob(true)} className="lg:hidden" style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a" }}><Menu size={18} /></button>
            <h2 style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.875rem" }}>Webhooks</h2>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={loadHooks} style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a" }}><RefreshCw size={15} /></button>
            <button onClick={() => { setShowNew(true); setNewSecret(""); }} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", background: "#f5a623", color: "#090D1A", fontSize: "0.75rem", fontWeight: 600, padding: "0.375rem 0.75rem", borderRadius: "0.375rem", border: "none", cursor: "pointer" }}>
              <Plus size={13} /> Add endpoint
            </button>
          </div>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {newSecret && (
            <div style={{ background: "rgba(2,44,34,0.9)", border: "1px solid #064e3b", borderRadius: "0.75rem", padding: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.75rem", color: "#34d399", marginBottom: "0.5rem", fontWeight: 600 }}>Webhook secret — save this now, it will not be shown again</div>
              <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#34d399", wordBreak: "break-all" }}>{newSecret}</div>
              <button onClick={() => setNewSecret("")} style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#34d399", background: "none", border: "none", cursor: "pointer" }}>Dismiss</button>
            </div>
          )}

          <div style={card}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #1e2740" }}>
              <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fafafa" }}>Endpoints</h3>
            </div>
            {loading ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#52525b" }}>Loading…</div>
            ) : hooks.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#52525b", fontSize: "0.875rem" }}>No endpoints yet. Add one to receive real-time events.</div>
            ) : hooks.map(h => (
              <div key={h.id} style={{ padding: "1.25rem", borderBottom: "1px solid #1e2740" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                  <div style={{ display: "flex", gap: "0.625rem", minWidth: 0, flex: 1 }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: h.status === "active" ? "#34d399" : "#f87171", marginTop: "0.375rem", flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: "0.875rem", fontFamily: "monospace", color: "#d4d4d8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "0.5rem" }}>{h.url}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginBottom: "0.5rem" }}>
                        {h.events.map(ev => <span key={ev} style={{ fontSize: "0.625rem", fontFamily: "monospace", background: "#131a2e", border: "1px solid #1e2740", color: "#71717a", padding: "0.125rem 0.375rem", borderRadius: "0.25rem" }}>{ev}</span>)}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#3f3f46", fontFamily: "monospace" }}>{h.delivery_count} deliveries {h.last_delivery_at ? `· Last: ${new Date(h.last_delivery_at).toLocaleDateString()}` : ""}</div>
                    </div>
                  </div>
                  <button onClick={() => deleteHook(h.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#52525b", flexShrink: 0 }}><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {showNew && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem" }}>
          <div style={{ background: "#131a2e", border: "1px solid #1e2740", borderRadius: "0.75rem", padding: "1.5rem", width: "100%", maxWidth: "26rem" }}>
            <h3 style={{ fontWeight: 600, color: "#fafafa", marginBottom: "1rem" }}>Add webhook endpoint</h3>
            <label style={{ display: "block", fontSize: "0.75rem", color: "#a1a1aa", marginBottom: "0.5rem" }}>Endpoint URL</label>
            <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://your-casino.com/webhooks"
              style={{ width: "100%", background: "#090D1A", border: "1px solid #1e2740", borderRadius: "0.375rem", color: "#fafafa", fontSize: "0.875rem", padding: "0.5rem 0.75rem", outline: "none", marginBottom: "1rem" }} />
            <label style={{ display: "block", fontSize: "0.75rem", color: "#a1a1aa", marginBottom: "0.625rem" }}>Events to subscribe</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {ALL_EVENTS.map(ev => (
                <label key={ev} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input type="checkbox" checked={newEvents.includes(ev)} onChange={() => setNewEvents(e => e.includes(ev) ? e.filter(x => x !== ev) : [...e, ev])} style={{ accentColor: "#fafafa" }} />
                  <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#a1a1aa" }}>{ev}</span>
                </label>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={createHook} disabled={creating} style={{ flex: 1, background: "#f5a623", color: "#090D1A", fontWeight: 600, fontSize: "0.875rem", padding: "0.5rem", borderRadius: "0.375rem", border: "none", cursor: "pointer" }}>
                {creating ? "Adding…" : "Add endpoint"}
              </button>
              <button onClick={() => setShowNew(false)} style={{ flex: 1, background: "#1e2740", color: "#d4d4d8", fontSize: "0.875rem", padding: "0.5rem", borderRadius: "0.375rem", border: "none", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
