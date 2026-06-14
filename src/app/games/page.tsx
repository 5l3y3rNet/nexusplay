"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { games } from "@/lib/games";
import { GameCard } from "@/components/games/game-card";

const cats = ["All","Crash","Arcade","Plinko","Minesweeper"];

export default function GamesPage() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    let list = [...games];
    if (search) list = list.filter(g => g.title.toLowerCase().includes(search.toLowerCase()) || g.description.toLowerCase().includes(search.toLowerCase()));
    if (cat !== "All") list = list.filter(g => g.category === cat);
    if (sort === "rtp") list.sort((a,b) => parseFloat(b.rtp)-parseFloat(a.rtp));
    else if (sort === "az") list.sort((a,b) => a.title.localeCompare(b.title));
    else list.sort((a,b) => new Date(b.releaseDate).getTime()-new Date(a.releaseDate).getTime());
    return list;
  }, [search, cat, sort]);

  return (
    <div style={{ paddingTop: "4rem", minHeight: "100vh", background: "#09090b" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "2.5rem 1.25rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.6875rem", fontFamily: "monospace", color: "#f5a623", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Game Catalog</p>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#fafafa" }}>All games</h1>
          <p style={{ color: "#52525b", fontSize: "0.875rem", marginTop: "0.375rem" }}>{filtered.length} of {games.length} titles</p>
        </div>

        {/* Controls — stack on mobile */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.75rem" }}>
          <div style={{ position: "relative", flex: "1 1 200px", minWidth: "200px", maxWidth: "360px" }}>
            <Search size={14} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#52525b" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search games..."
              style={{ width: "100%", background: "#18181b", border: "1px solid #27272a", borderRadius: "0.5rem", color: "#fafafa", fontSize: "0.9375rem", padding: "0.625rem 0.75rem 0.625rem 2.25rem", outline: "none" }} />
          </div>
          {/* Category pills - scrollable on mobile */}
          <div style={{ display: "flex", gap: "0.375rem", overflowX: "auto", paddingBottom: "2px" }}>
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)} style={{ padding: "0.5rem 0.875rem", fontSize: "0.8125rem", fontFamily: "monospace", borderRadius: "0.375rem", border: "1px solid", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, background: cat === c ? "#f5a623" : "transparent", color: cat === c ? "#09090b" : "#71717a", borderColor: cat === c ? "#f5a623" : "#27272a" }}>
                {c}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "0.5rem", color: "#71717a", fontSize: "0.9375rem", padding: "0.625rem 0.75rem", outline: "none" }}>
            <option value="newest">Newest</option>
            <option value="rtp">Highest RTP</option>
            <option value="az">A → Z</option>
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
          {filtered.map(game => <GameCard key={game.id} game={game} />)}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "5rem 0", color: "#52525b" }}>
            <p style={{ marginBottom: "1rem" }}>No games match your search.</p>
            <button onClick={() => { setSearch(""); setCat("All"); }} style={{ color: "#a1a1aa", background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem" }}>Clear filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
