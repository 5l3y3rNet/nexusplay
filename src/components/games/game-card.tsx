"use client";
import Link from "next/link";
import type { Game } from "@/lib/games";

export function GameCard({ game }: { game: Game }) {
  return (
    <div style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "0.75rem", overflow: "hidden", display: "flex", flexDirection: "column" }}
      onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = "#52525b")}
      onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = "#27272a")}>
      <Link href={`/games/${game.slug}`} style={{ textDecoration: "none", display: "block" }}>
        <div style={{ height: "11rem", overflow: "hidden", background: "#18181b", position: "relative" }}>
          <img src={game.thumbnail} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem", display: "flex", gap: "0.375rem" }}>
            {game.status === "new" && <span style={{ fontSize: "0.625rem", background: "rgba(2,44,34,0.9)", color: "#34d399", border: "1px solid #064e3b", padding: "0.125rem 0.5rem", borderRadius: "0.25rem", fontFamily: "monospace" }}>NEW</span>}
            {game.status === "featured" && <span style={{ fontSize: "0.625rem", background: "rgba(26,5,51,0.9)", color: "#c084fc", border: "1px solid #3b0764", padding: "0.125rem 0.5rem", borderRadius: "0.25rem", fontFamily: "monospace" }}>FEATURED</span>}
            <span style={{ fontSize: "0.625rem", background: "rgba(24,24,27,0.9)", color: "#a1a1aa", border: "1px solid #3f3f46", padding: "0.125rem 0.5rem", borderRadius: "0.25rem", fontFamily: "monospace" }}>{game.category}</span>
          </div>
        </div>
        <div style={{ padding: "1rem" }}>
          <h3 style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.9375rem", marginBottom: "0.375rem" }}>{game.title}</h3>
          <p style={{ fontSize: "0.8125rem", color: "#52525b", marginBottom: "0.75rem", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{game.description}</p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.75rem", fontFamily: "monospace" }}>
            <span style={{ color: "#34d399" }}>{game.rtp}</span>
            <span style={{ color: "#3f3f46" }}>·</span>
            <span style={{ color: "#71717a" }}>{game.volatility}</span>
          </div>
        </div>
      </Link>
      <div style={{ padding: "0 1rem 1rem", marginTop: "auto" }}>
        <button
          onClick={() => window.open(`/play?game=${game.id}`, "_blank", "noopener")}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: "rgba(245,166,35,0.12)", border: "1px solid rgba(245,166,35,0.3)", color: "#f5a623", fontSize: "0.8125rem", fontWeight: 600, padding: "0.625rem", borderRadius: "0.375rem", cursor: "pointer", transition: "all 0.15s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(245,166,35,0.2)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(245,166,35,0.12)"; }}
        >
          ▶ Play Demo
        </button>
      </div>
    </div>
  );
}
