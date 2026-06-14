"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Play, Copy, Check, RefreshCw } from "lucide-react";
import { PartnerSidebar } from "@/components/layout/partner-sidebar";
import { useAuth } from "@/contexts/auth";

interface Game { id: string; slug: string; title: string; category: string; rtp: string; thumbnail: string; filename: string; }

export default function PartnerGamesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [mob, setMob] = useState(false);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    if (!authLoading && !user) { router.push("/login"); return; }
    if (user) load();
  }, [user, authLoading]);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/my-games").then(res => res.json()).catch(() => ({ games: [] }));
    setGames(r.games || []);
    setLoading(false);
  }

  function copy(id: string) { navigator.clipboard.writeText(id); setCopied(id); setTimeout(() => setCopied(""), 1500); }

  if (authLoading) return <div style={{ height: "100vh", background: "#070a14", display: "flex", alignItems: "center", justifyContent: "center", color: "#71757f" }}>Loading…</div>;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#070a14", overflow: "hidden" }}>
      <style>{`.p-sb{display:none}@media(min-width:1024px){.p-sb{display:flex}.p-menu{display:none!important}}`}</style>
      <div className="p-sb" style={{ width: "15rem", flexShrink: 0 }}><PartnerSidebar /></div>
      {mob && <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}><div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} onClick={() => setMob(false)} /><div style={{ position: "relative", width: "15rem", height: "100%" }}><PartnerSidebar onClose={() => setMob(false)} /></div></div>}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ height: "4rem", borderBottom: "1px solid #1e2740", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 1.5rem", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={() => setMob(true)} className="p-menu" style={{ background: "none", border: "none", cursor: "pointer", color: "#71757f", display: "flex" }}><Menu size={18} /></button>
            <h2 style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.875rem" }}>Your Games</h2>
            <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#5a5e6b", background: "#0f1424", border: "1px solid #1e2740", padding: "0.125rem 0.5rem", borderRadius: "0.25rem" }}>{games.length}</span>
          </div>
          <button onClick={load} style={{ background: "none", border: "none", cursor: "pointer", color: "#71757f" }}><RefreshCw size={15} /></button>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          {loading ? <div style={{ padding: "3rem", textAlign: "center", color: "#5a5e6b" }}>Loading…</div>
            : games.length === 0 ? (
              <div style={{ padding: "4rem 1rem", textAlign: "center" }}>
                <p style={{ color: "#9aa0ad", fontSize: "0.9375rem", marginBottom: "0.5rem" }}>No games assigned to your account yet.</p>
                <p style={{ color: "#5a5e6b", fontSize: "0.875rem" }}>Contact your KANI account manager to get games added.</p>
              </div>
            ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
              {games.map(game => (
                <div key={game.id} style={{ background: "#0f1424", border: "1px solid #1e2740", borderRadius: "0.75rem", overflow: "hidden" }}>
                  <div style={{ height: "9rem", background: "#070a14", position: "relative" }}>
                    <img src={game.thumbnail} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <span style={{ position: "absolute", top: "0.5rem", left: "0.5rem", fontSize: "0.625rem", background: "rgba(12,14,22,0.9)", color: "#9aa0ad", border: "1px solid #1e2740", padding: "0.125rem 0.5rem", borderRadius: "0.25rem", fontFamily: "monospace" }}>{game.category}</span>
                  </div>
                  <div style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <h3 style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.9375rem" }}>{game.title}</h3>
                      <button onClick={() => window.open(`/play?game=${game.id}`, "_blank")} style={{ background: "none", border: "none", cursor: "pointer", color: "#fafafa" }} title="Play demo"><Play size={15} /></button>
                    </div>
                    <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#22c55e", marginBottom: "0.75rem" }}>{game.rtp} RTP</div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#070a14", border: "1px solid #1e2740", borderRadius: "0.375rem", padding: "0.375rem 0.625rem" }}>
                      <span style={{ flex: 1, fontSize: "0.75rem", fontFamily: "monospace", color: "#71757f" }}>{game.id}</span>
                      <button onClick={() => copy(game.id)} style={{ background: "none", border: "none", cursor: "pointer", color: copied === game.id ? "#22c55e" : "#5a5e6b" }}>{copied === game.id ? <Check size={12} /> : <Copy size={12} />}</button>
                    </div>
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
