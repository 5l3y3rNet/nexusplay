"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Plus, Trash2, Eye, EyeOff, Copy, Key, RefreshCw } from "lucide-react";
import { PartnerSidebar } from "@/components/layout/partner-sidebar";
import { useAuth } from "@/contexts/auth";

interface ApiKey { id: string; name: string; key_prefix: string; env: string; last_used_at: string | null; request_count: number; created_at: string; newKey?: string; }

export default function ApiKeysPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [shown, setShown] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEnv, setNewEnv] = useState("test");
  const [creating, setCreating] = useState(false);
  const [mob, setMob] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    if (user) loadKeys();
  }, [user, authLoading]);

  async function loadKeys() {
    setLoading(true);
    const r = await fetch("/api/keys").then(res => res.json());
    setKeys(r.keys || []);
    setLoading(false);
  }

  async function createKey() {
    if (!newName.trim()) return;
    setCreating(true);
    const r = await fetch("/api/keys", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newName, env: newEnv }) });
    const d = await r.json();
    setCreating(false);
    if (d.key) {
      setKeys(prev => [{ id: d.key.id, name: d.key.name, key_prefix: d.key.key.slice(0, 20), env: d.key.env, last_used_at: null, request_count: 0, created_at: d.key.created_at, newKey: d.key.key }, ...prev]);
      setNewName(""); setShowNew(false);
    }
  }

  async function deleteKey(id: string) {
    await fetch(`/api/keys/${id}`, { method: "DELETE" });
    setKeys(prev => prev.filter(k => k.id !== id));
  }

  function copy(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(id); setTimeout(() => setCopied(""), 2000);
  }

  const card: React.CSSProperties = { background: "#111113", border: "1px solid #27272a", borderRadius: "0.75rem" };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#09090b", overflow: "hidden" }}>
      <div className="hidden lg:block" style={{ width: "15rem", flexShrink: 0 }}><PartnerSidebar /></div>
      {mob && <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}><div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} onClick={() => setMob(false)} /><div style={{ position: "relative", width: "15rem", height: "100%" }}><PartnerSidebar onClose={() => setMob(false)} /></div></div>}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ height: "4rem", borderBottom: "1px solid #27272a", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={() => setMob(true)} className="lg:hidden" style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a" }}><Menu size={18} /></button>
            <h2 style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.875rem" }}>API Keys</h2>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={loadKeys} style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a" }}><RefreshCw size={15} /></button>
            <button onClick={() => setShowNew(true)} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", background: "#3b82f6", color: "#ffffff", fontSize: "0.75rem", fontWeight: 600, padding: "0.375rem 0.75rem", borderRadius: "0.375rem", border: "none", cursor: "pointer" }}>
              <Plus size={13} /> New key
            </button>
          </div>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "0.75rem", padding: "1rem", marginBottom: "1.5rem", display: "flex", gap: "0.75rem" }}>
            <Key size={14} style={{ color: "#71717a", flexShrink: 0, marginTop: "0.125rem" }} />
            <p style={{ fontSize: "0.875rem", color: "#71717a" }}>API keys are shown once. Store them securely in environment variables — never in client-side code.</p>
          </div>
          <div style={card}>
            <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #27272a" }}>
              <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fafafa" }}>Your API keys</h3>
            </div>
            {loading ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#52525b" }}>Loading…</div>
            ) : keys.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", color: "#52525b", fontSize: "0.875rem" }}>No keys yet. Create one to start integrating.</div>
            ) : keys.map(k => (
              <div key={k.id} style={{ padding: "1.25rem", borderBottom: "1px solid #27272a" }}>
                {k.newKey && (
                  <div style={{ background: "rgba(2,44,34,0.9)", border: "1px solid #064e3b", borderRadius: "0.375rem", padding: "0.75rem", marginBottom: "0.75rem", fontSize: "0.75rem", color: "#34d399", fontFamily: "monospace", wordBreak: "break-all" }}>
                    Save this key — it will not be shown again: {k.newKey}
                    <button onClick={() => copy(k.id + "_new", k.newKey!)} style={{ marginLeft: "0.5rem", background: "none", border: "none", cursor: "pointer", color: "#34d399" }}><Copy size={11} /></button>
                    {copied === k.id + "_new" && " Copied!"}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: k.env === "live" ? "#34d399" : "#facc15" }} />
                    <span style={{ fontWeight: 500, color: "#d4d4d8", fontSize: "0.875rem" }}>{k.name}</span>
                    <span style={{ fontSize: "0.625rem", fontFamily: "monospace", padding: "0.125rem 0.5rem", borderRadius: "0.25rem", border: "1px solid", background: k.env === "live" ? "rgba(2,44,34,0.9)" : "rgba(26,18,0,0.9)", color: k.env === "live" ? "#34d399" : "#facc15", borderColor: k.env === "live" ? "#064e3b" : "#3b2700" }}>{k.env.toUpperCase()}</span>
                  </div>
                  <button onClick={() => deleteKey(k.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#3f3f46" }}><Trash2 size={14} /></button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#18181b", border: "1px solid #27272a", borderRadius: "0.375rem", padding: "0.5rem 0.75rem", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#71717a", flex: 1 }}>{k.key_prefix}{"•".repeat(20)}</span>
                  <button onClick={() => copy(k.id, k.key_prefix)} style={{ background: "none", border: "none", cursor: "pointer", color: "#52525b" }}><Copy size={12} /></button>
                </div>
                {copied === k.id && <p style={{ fontSize: "0.75rem", color: "#34d399", marginBottom: "0.5rem" }}>Prefix copied</p>}
                <div style={{ fontSize: "0.75rem", color: "#3f3f46", fontFamily: "monospace" }}>
                  Created {new Date(k.created_at).toLocaleDateString()} · {k.request_count} requests {k.last_used_at ? `· Last used ${new Date(k.last_used_at).toLocaleDateString()}` : "· Never used"}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {showNew && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "1rem" }}>
          <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "0.75rem", padding: "1.5rem", width: "100%", maxWidth: "24rem" }}>
            <h3 style={{ fontWeight: 600, color: "#fafafa", marginBottom: "1rem" }}>Create new API key</h3>
            <label style={{ display: "block", fontSize: "0.75rem", color: "#a1a1aa", marginBottom: "0.5rem" }}>Key name</label>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Production" autoFocus
              onKeyDown={e => e.key === "Enter" && createKey()}
              style={{ width: "100%", background: "#09090b", border: "1px solid #27272a", borderRadius: "0.375rem", color: "#fafafa", fontSize: "0.875rem", padding: "0.5rem 0.75rem", outline: "none", marginBottom: "1rem" }} />
            <label style={{ display: "block", fontSize: "0.75rem", color: "#a1a1aa", marginBottom: "0.5rem" }}>Environment</label>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {["test", "live"].map(env => (
                <button key={env} onClick={() => setNewEnv(env)} style={{ flex: 1, padding: "0.5rem", borderRadius: "0.375rem", border: "1px solid", cursor: "pointer", background: newEnv === env ? "#fafafa" : "transparent", color: newEnv === env ? "#09090b" : "#71717a", borderColor: newEnv === env ? "#fafafa" : "#27272a", fontSize: "0.875rem", fontWeight: newEnv === env ? 600 : 400 }}>
                  {env === "test" ? "Test (sandbox)" : "Live (production)"}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={createKey} disabled={creating} style={{ flex: 1, background: "#3b82f6", color: "#ffffff", fontWeight: 600, fontSize: "0.875rem", padding: "0.5rem", borderRadius: "0.375rem", border: "none", cursor: "pointer" }}>
                {creating ? "Creating…" : "Create"}
              </button>
              <button onClick={() => setShowNew(false)} style={{ flex: 1, background: "#27272a", color: "#d4d4d8", fontSize: "0.875rem", padding: "0.5rem", borderRadius: "0.375rem", border: "none", cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
