import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getGameBySlug, games } from "@/lib/games";
import { PlayButton } from "@/components/games/play-button";

export function generateStaticParams() {
  return games.map(g => ({ slug: g.slug }));
}

const volColor: Record<string, string> = { "Low": "#34d399", "Medium": "#facc15", "High": "#fb923c", "Very High": "#f87171" };

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = getGameBySlug(slug);
  if (!game) notFound();
  const related = games.filter(g => g.id !== game.id && g.category === game.category).slice(0, 3);

  return (
    <div style={{ paddingTop: "4rem", minHeight: "100vh", background: "#09090b" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "2rem 1.25rem" }}>
        <Link href="/games" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: "#52525b", textDecoration: "none", marginBottom: "1.75rem" }}>
          <ArrowLeft size={14} /> Games
        </Link>

        {/* Mobile: stack, Desktop: side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }} className="lg:grid-cols-game">

          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ borderRadius: "0.75rem", overflow: "hidden", background: "#18181b", border: "1px solid #27272a", aspectRatio: "16/9" }}>
              <img src={game.thumbnail} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
              <div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: "0.5rem" }}>
                  {game.status === "new" && <span style={{ fontSize: "0.625rem", background: "rgba(2,44,34,0.9)", color: "#34d399", border: "1px solid #064e3b", padding: "0.125rem 0.5rem", borderRadius: "0.25rem", fontFamily: "monospace" }}>NEW</span>}
                  {game.status === "featured" && <span style={{ fontSize: "0.625rem", background: "rgba(26,5,51,0.9)", color: "#c084fc", border: "1px solid #3b0764", padding: "0.125rem 0.5rem", borderRadius: "0.25rem", fontFamily: "monospace" }}>FEATURED</span>}
                  <span style={{ fontSize: "0.625rem", background: "#18181b", color: "#a1a1aa", border: "1px solid #3f3f46", padding: "0.125rem 0.5rem", borderRadius: "0.25rem", fontFamily: "monospace" }}>{game.category}</span>
                </div>
                <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 700, color: "#fafafa" }}>{game.title}</h1>
              </div>
              <PlayButton gameId={game.id} gameTitle={game.title} />
            </div>

            <div style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "0.75rem", padding: "1.25rem" }}>
              <h3 style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.9375rem", marginBottom: "0.75rem" }}>About this game</h3>
              <p style={{ color: "#71717a", fontSize: "0.9375rem", lineHeight: 1.7 }}>{game.longDescription}</p>
            </div>

            <div style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "0.75rem", padding: "1.25rem" }}>
              <h3 style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.9375rem", marginBottom: "1.25rem" }}>Technical Specifications</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {([["Game ID",game.id,"mono"],["Category",game.category,""],["RTP",game.rtp,"green"],["Volatility",game.volatility,"vol"],["Min Bet",game.minBet,""],["Max Bet",game.maxBet,""],["Max Win",game.maxWin,""],["Release",game.releaseDate,"mono"]] as [string,string,string][]).map(([lbl,val,type]) => (
                  <div key={lbl} style={{ borderBottom: "1px solid #27272a", paddingBottom: "0.75rem" }}>
                    <div style={{ fontSize: "0.75rem", color: "#52525b", marginBottom: "0.25rem" }}>{lbl}</div>
                    <div style={{ fontSize: "0.9375rem", fontFamily: (type==="mono"||type==="green")?"monospace":"inherit", color: type==="green"?"#34d399":type==="vol"?volColor[val]:"#d4d4d8" }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
              {[{t:"Devices",items:game.devices},{t:"Currencies",items:game.currencies},{t:"Languages",items:game.languages}].map(({t,items}) => (
                <div key={t} style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "0.75rem", padding: "1rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "#52525b", marginBottom: "0.625rem" }}>{t}</div>
                  {items.map(item => <div key={item} style={{ fontSize: "0.8125rem", color: "#a1a1aa", fontFamily: t==="Currencies"?"monospace":"inherit", marginBottom: "0.25rem" }}>{item}</div>)}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "0.75rem", padding: "1.25rem" }}>
              <h3 style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.9375rem", marginBottom: "1rem" }}>Integration</h3>
              <div style={{ marginBottom: "0.75rem" }}>
                <div style={{ fontSize: "0.75rem", color: "#52525b", marginBottom: "0.375rem" }}>Game ID</div>
                <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "0.375rem", padding: "0.5rem 0.75rem", fontSize: "0.8125rem", fontFamily: "monospace", color: "#a1a1aa" }}>{game.id}</div>
              </div>
              <div style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "0.5rem", padding: "0.875rem", marginBottom: "1rem" }}>
                <pre style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#a1a1aa", margin: 0, lineHeight: 1.6, overflowX: "auto" }}>
{JSON.stringify({gameId:game.id,playerId:"player_xyz",currency:"USD",balance:1000},null,2)}
                </pre>
              </div>
              <Link href="/partner/register" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#fafafa", color: "#09090b", fontWeight: 700, fontSize: "0.875rem", padding: "0.75rem", borderRadius: "0.375rem", textDecoration: "none" }}>
                Get API Access
              </Link>
            </div>

            <div style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "0.75rem", padding: "1.25rem" }}>
              <h3 style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.9375rem", marginBottom: "0.75rem" }}>Tags</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {game.tags.map(tag => <span key={tag} style={{ fontSize: "0.75rem", background: "#18181b", border: "1px solid #27272a", color: "#71717a", padding: "0.25rem 0.625rem", borderRadius: "0.375rem", fontFamily: "monospace" }}>#{tag}</span>)}
              </div>
            </div>

            {related.length > 0 && (
              <div style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "0.75rem", padding: "1.25rem" }}>
                <h3 style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.9375rem", marginBottom: "1rem" }}>More {game.category}</h3>
                {related.map(g => (
                  <Link key={g.id} href={`/games/${g.slug}`} style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none", marginBottom: "0.875rem" }}>
                    <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "0.375rem", overflow: "hidden", background: "#18181b", flexShrink: 0 }}>
                      <img src={g.thumbnail} alt={g.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.9375rem", color: "#d4d4d8" }}>{g.title}</div>
                      <div style={{ fontSize: "0.75rem", color: "#52525b", fontFamily: "monospace" }}>{g.rtp}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
