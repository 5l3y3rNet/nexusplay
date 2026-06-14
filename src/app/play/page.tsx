"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getGameById, type Game } from "@/lib/games";

function GamePlayer() {
  const params = useSearchParams();
  const router = useRouter();
  const gameId = params.get("game");
  const [game, setGame] = useState<Game | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!gameId) { setNotFound(true); return; }
    const staticGame = getGameById(gameId);
    if (staticGame) { setGame(staticGame); return; }
    fetch("/api/games").then(r => r.json()).then(d => {
      const found = (d.games || []).find((g: any) => g.id === gameId || g.slug === gameId);
      if (found) setGame(found as Game);
      else setNotFound(true);
    }).catch(() => setNotFound(true));
  }, [gameId]);

  if (notFound) {
    return (
      <div style={{ minHeight: "100vh", background: "#09090b", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem", fontFamily: "system-ui" }}>
        <p style={{ color: "#71717a" }}>Game not found.</p>
        <button onClick={() => router.push("/games")} style={{ background: "#3b82f6", color: "#ffffff", border: "none", borderRadius: "0.5rem", padding: "0.625rem 1.25rem", cursor: "pointer", fontWeight: 700 }}>Browse Games</button>
      </div>
    );
  }

  if (!game) return <div style={{ minHeight: "100vh", background: "#09090b" }} />;

  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #09090b; }
        .play-root {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          background: #09090b;
        }
        .play-bar {
          height: 44px;
          flex: 0 0 44px;
          background: #09090b;
          border-bottom: 1px solid #27272a;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1rem;
          z-index: 10;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .play-frame-wrap {
          flex: 1 1 auto;
          position: relative;
          width: 100%;
          min-height: 0;
        }
        .play-frame-wrap iframe {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }
      `}</style>
      <div className="play-root">
        <div className="play-bar">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
            <a href="/" style={{ fontWeight: 700, fontSize: "0.875rem", color: "#fafafa", textDecoration: "none", flexShrink: 0 }}>NexusPlay</a>
            <span style={{ color: "#3f3f46", flexShrink: 0 }}>|</span>
            <span style={{ fontSize: "0.75rem", color: "#a1a1aa", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{game.title}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexShrink: 0 }}>
            <span style={{ fontSize: "0.625rem", fontFamily: "monospace", background: "rgba(2,44,34,0.9)", color: "#34d399", border: "1px solid #064e3b", padding: "0.2rem 0.5rem", borderRadius: "0.25rem" }}>DEMO</span>
            <a href="/games" style={{ fontSize: "0.75rem", color: "#a1a1aa", textDecoration: "none", background: "#27272a", borderRadius: "0.375rem", padding: "0.375rem 0.75rem" }}>← Games</a>
          </div>
        </div>
        <div className="play-frame-wrap">
          <iframe
            key={game.id}
            src={`/games/${game.filename}`}
            title={game.title}
            allow="autoplay; fullscreen; gyroscope; accelerometer"
            scrolling="no"
          />
        </div>
      </div>
    </>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#09090b" }} />}>
      <GamePlayer />
    </Suspense>
  );
}
