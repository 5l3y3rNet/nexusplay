"use client";
import { Play } from "lucide-react";

export function PlayButton({ gameId, gameTitle }: { gameId: string; gameTitle: string }) {
  return (
    <button
      onClick={() => window.open(`/play?game=${gameId}`, "_blank", "noopener")}
      style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#f5a623", color: "#09090b", fontWeight: 700, fontSize: "0.9375rem", padding: "0.625rem 1.25rem", borderRadius: "0.5rem", border: "none", cursor: "pointer", flexShrink: 0 }}>
      <Play size={14} style={{ fill: "#09090b" }} /> Play Demo
    </button>
  );
}
