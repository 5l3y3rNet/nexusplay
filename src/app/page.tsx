import Link from "next/link";
import { ArrowRight, ChevronRight, Zap, Shield, Globe, BarChart3, Code2, CheckCircle2, ExternalLink } from "lucide-react";
import { games } from "@/lib/games";
import { GameCard } from "@/components/games/game-card";

const stats = [
  { value: "10", label: "Certified Games" },
  { value: "97%", label: "Avg. RTP" },
  { value: "5ms", label: "API Response" },
  { value: "99.9%", label: "Uptime SLA" },
];

const features = [
  { icon: <Zap size={18} />, title: "Instant Integration", desc: "Single API endpoint. Live in under 30 minutes with our SDKs and integration guide." },
  { icon: <Shield size={18} />, title: "Enterprise Security", desc: "HMAC-signed requests, JWT authentication, rate limiting, full audit trails on every session." },
  { icon: <Globe size={18} />, title: "Provably Fair", desc: "Cryptographically verifiable RNG. Players and operators can audit every outcome." },
  { icon: <BarChart3 size={18} />, title: "Real-Time Analytics", desc: "Session metrics, player activity, revenue reporting, and API usage in your dashboard." },
  { icon: <Code2 size={18} />, title: "Full API Coverage", desc: "REST API with webhooks, game launch flow, session management, and rollback support." },
  { icon: <CheckCircle2 size={18} />, title: "White-Label Ready", desc: "Games integrate into any operator UI. Custom currency, locale, and theme support." },
];

const steps = [
  { n: "01", title: "Register as a partner", desc: "Create your account and get approved by our partner team." },
  { n: "02", title: "Generate API credentials", desc: "Create API keys with scoped permissions in your dashboard." },
  { n: "03", title: "Request a launch session", desc: "POST to /api/games/launch with your credentials." },
  { n: "04", title: "Embed the game URL", desc: "Receive a signed URL and embed it in an iframe." },
];

export default function HomePage() {
  return (
    <div style={{ paddingTop: "4rem" }}>

      {/* HERO */}
      <section style={{ background: "#09090b", minHeight: "90vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.14) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "4rem 1.25rem", width: "100%", position: "relative" }}>
          <div style={{ maxWidth: "44rem" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#18181b", border: "1px solid #27272a", borderRadius: "9999px", padding: "0.375rem 0.875rem", marginBottom: "1.75rem" }}>
              <span className="status-dot" />
              <span style={{ fontSize: "0.75rem", color: "#a1a1aa", fontFamily: "monospace" }}>10 games live · API v1.4</span>
            </div>
            <h1 style={{ fontSize: "clamp(2.25rem, 7vw, 4.5rem)", fontWeight: 800, color: "#fafafa", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "1.25rem" }}>
              The game provider<br />
              <span style={{ color: "#52525b" }}>built for operators.</span>
            </h1>
            <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.125rem)", color: "#71717a", lineHeight: 1.7, marginBottom: "2rem", maxWidth: "36rem" }}>
              Ten premium crash and arcade games, a production-grade API, and a partner portal built for serious casino operators.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              <Link href="/partner" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#3b82f6", color: "#ffffff", fontWeight: 700, fontSize: "0.9375rem", padding: "0.75rem 1.5rem", borderRadius: "0.5rem", textDecoration: "none" }}>
                Start integrating <ArrowRight size={16} />
              </Link>
              <Link href="/games" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", color: "#71717a", fontSize: "0.9375rem", textDecoration: "none", padding: "0.75rem 0.25rem" }}>
                Browse games <ChevronRight size={15} />
              </Link>
            </div>
          </div>
          {/* Stats row - mobile friendly */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem", marginTop: "3rem", maxWidth: "26rem" }} className="sm:grid-cols-4 sm:max-w-none">
            {stats.map(s => (
              <div key={s.label} style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "0.75rem", padding: "1rem" }}>
                <div style={{ fontSize: "1.75rem", fontWeight: 700, color: "#fafafa", fontFamily: "monospace", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: "0.75rem", color: "#71717a", marginTop: "0.375rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GAMES */}
      <section style={{ background: "#09090b", borderTop: "1px solid #27272a", padding: "4rem 0" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.25rem" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2rem", gap: "1rem" }}>
            <div>
              <p style={{ fontSize: "0.6875rem", fontFamily: "monospace", color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Game Catalog</p>
              <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 1.875rem)", fontWeight: 700, color: "#fafafa" }}>All 10 games</h2>
            </div>
            <Link href="/games" style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: "#71717a", textDecoration: "none", flexShrink: 0 }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
            {games.map(game => <GameCard key={game.id} game={game} />)}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: "#09090b", borderTop: "1px solid #27272a", padding: "4rem 0" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.25rem" }}>
          <div style={{ maxWidth: "36rem", marginBottom: "3rem" }}>
            <p style={{ fontSize: "0.6875rem", fontFamily: "monospace", color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Platform</p>
            <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 1.875rem)", fontWeight: 700, color: "#fafafa", marginBottom: "0.75rem" }}>Built for production from day one</h2>
            <p style={{ color: "#52525b", lineHeight: 1.7 }}>Designed around the requirements of licensed casino operators. Security and reliability are non-negotiable.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1px", background: "#27272a" }}>
            {features.map((f, i) => (
              <div key={i} style={{ background: "#09090b", padding: "1.75rem" }}>
                <div style={{ width: "2.25rem", height: "2.25rem", background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa", marginBottom: "1rem" }}>{f.icon}</div>
                <h3 style={{ fontWeight: 600, color: "#fafafa", marginBottom: "0.5rem", fontSize: "0.9375rem" }}>{f.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#52525b", lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTEGRATION */}
      <section style={{ background: "#09090b", borderTop: "1px solid #27272a", padding: "4rem 0" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.25rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "0.6875rem", fontFamily: "monospace", color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Integration</p>
              <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 1.875rem)", fontWeight: 700, color: "#fafafa", marginBottom: "0.75rem" }}>Live in under 30 minutes</h2>
              <p style={{ color: "#52525b", lineHeight: 1.7, marginBottom: "2rem" }}>Four steps from credentials to a live game. No custom backend required.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {steps.map(s => (
                  <div key={s.n} style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ flexShrink: 0, fontFamily: "monospace", fontSize: "0.75rem", color: "#3f3f46", width: "1.5rem", paddingTop: "0.125rem" }}>{s.n}</div>
                    <div>
                      <div style={{ fontWeight: 500, color: "#d4d4d8", fontSize: "0.9375rem", marginBottom: "0.25rem" }}>{s.title}</div>
                      <div style={{ fontSize: "0.875rem", color: "#52525b" }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href="/docs" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#3b82f6", color: "#ffffff", fontWeight: 700, fontSize: "0.875rem", padding: "0.625rem 1.25rem", borderRadius: "0.375rem", textDecoration: "none" }}>Read the docs</Link>
                <Link href="/partner" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#71717a", fontSize: "0.875rem", textDecoration: "none", padding: "0.625rem 0" }}>Get API keys <ArrowRight size={14} /></Link>
              </div>
            </div>
            <div style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "0.75rem", overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", borderBottom: "1px solid #27272a", background: "rgba(9,9,11,0.5)" }}>
                <div style={{ display: "flex", gap: "0.375rem" }}>{[0,1,2].map(i=><div key={i} style={{ width:"0.75rem",height:"0.75rem",borderRadius:"50%",background:"#3f3f46" }}/>)}</div>
                <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#52525b", marginLeft: "0.5rem" }}>game-launch.js</span>
              </div>
              <pre style={{ padding: "1.25rem", fontFamily: "monospace", fontSize: "0.75rem", lineHeight: 1.75, overflowX: "auto", color: "#a1a1aa", margin: 0 }}>
{`const res = await fetch(
  "/api/games/launch",
  {
    method: "POST",
    headers: {
      "Authorization": \`Bearer \${API_KEY}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      gameId: "elevator",
      playerId: "player_xyz",
      currency: "USD",
      balance: 1000,
    })
  }
);

const { launchUrl } = await res.json();

// Embed in your casino
iframe.src = launchUrl;`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#09090b", borderTop: "1px solid #27272a", padding: "5rem 0" }}>
        <div style={{ maxWidth: "40rem", margin: "0 auto", padding: "0 1.25rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.75rem, 5vw, 2.25rem)", fontWeight: 700, color: "#fafafa", marginBottom: "1rem" }}>Ready to integrate?</h2>
          <p style={{ color: "#52525b", marginBottom: "2rem", lineHeight: 1.7 }}>Join casino operators running NexusPlay games. Full API access, sandbox environment, dedicated integration support.</p>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
            <Link href="/partner" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#3b82f6", color: "#ffffff", fontWeight: 700, padding: "0.875rem 1.75rem", borderRadius: "0.5rem", textDecoration: "none" }}>
              Create partner account <ArrowRight size={16} />
            </Link>
            <Link href="/docs" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#71717a", fontSize: "0.875rem", textDecoration: "none" }}>
              Read documentation <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
