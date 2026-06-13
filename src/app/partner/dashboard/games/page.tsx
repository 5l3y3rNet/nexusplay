"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, Play, ExternalLink, Copy } from "lucide-react";
import { PartnerSidebar } from "@/components/layout/partner-sidebar";
import { games } from "@/lib/games";

export default function PartnerGamesPage() {
  const [mob, setMob] = useState(false);
  const [copied, setCopied] = useState("");
  function copy(id: string) { navigator.clipboard.writeText(id).catch(() => {}); setCopied(id); setTimeout(() => setCopied(""), 1500); }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#09090b", overflow: "hidden" }}>
      <div className="hidden lg:block" style={{ width: "15rem", flexShrink: 0 }}><PartnerSidebar /></div>
      {mob && <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}><div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} onClick={() => setMob(false)} /><div style={{ position: "relative", width: "15rem", height: "100%" }}><PartnerSidebar onClose={() => setMob(false)} /></div></div>}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ height: "4rem", borderBottom: "1px solid #27272a", display: "flex", alignItems: "center", gap: "0.75rem", padding: "0 1.5rem", flexShrink: 0 }}>
          <button onClick={() => setMob(true)} className="lg:hidden" style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a" }}><Menu size={18} /></button>
          <h2 style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.875rem" }}>Available Games</h2>
          <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#52525b", background: "#18181b", border: "1px solid #27272a", padding: "0.125rem 0.5rem", borderRadius: "0.25rem" }}>{games.length} titles</span>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
            {games.map(game => (
              <div key={game.id} style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "0.75rem", overflow: "hidden" }}>
                <div style={{ height: "9rem", background: "#18181b", position: "relative" }}>
                  <img src={game.thumbnail} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: "0.5rem", left: "0.5rem", display: "flex", gap: "0.25rem" }}>
                    {game.status === "new" && <span style={{ fontSize: "0.625rem", background: "rgba(2,44,34,0.9)", color: "#34d399", border: "1px solid #064e3b", padding: "0.125rem 0.5rem", borderRadius: "0.25rem", fontFamily: "monospace" }}>NEW</span>}
                    <span style={{ fontSize: "0.625rem", background: "rgba(24,24,27,0.9)", color: "#a1a1aa", border: "1px solid #3f3f46", padding: "0.125rem 0.5rem", borderRadius: "0.25rem", fontFamily: "monospace" }}>{game.category}</span>
                  </div>
                </div>
                <div style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <h3 style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.875rem" }}>{game.title}</h3>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <a href={`/games/${game.filename}`} target="_blank" rel="noopener noreferrer" style={{ color: "#52525b", textDecoration: "none" }} title="Play demo"><Play size={13} /></a>
                      <Link href={`/games/${game.slug}`} style={{ color: "#52525b", textDecoration: "none" }} title="View details"><ExternalLink size={13} /></Link>
                    </div>
                  </div>
                  <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#34d399", marginBottom: "0.75rem" }}>{game.rtp} RTP</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#18181b", border: "1px solid #27272a", borderRadius: "0.25rem", padding: "0.375rem 0.625rem" }}>
                    <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#71717a", flex: 1 }}>{game.id}</span>
                    <button onClick={() => copy(game.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#52525b" }}><Copy size={11} /></button>
                  </div>
                  {copied === game.id && <p style={{ fontSize: "0.625rem", color: "#34d399", marginTop: "0.25rem" }}>Copied!</p>}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
