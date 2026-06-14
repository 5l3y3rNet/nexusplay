import Link from "next/link";
import { ArrowRight, Lightbulb, Zap, Shield, Target, Users, Rocket, MessageSquare, TrendingUp, Sparkles } from "lucide-react";

const principles = [
  { icon: <Lightbulb size={18} />, title: "Why are all the games the same?", body: "That question started everything. Aviator proved there was massive appetite for something different — we built on that insight." },
  { icon: <Sparkles size={18} />, title: "No corporate baggage", body: "We grew up together. Between us we brought a bright idea, sharp marketing instinct, direct sales capability, and a wide network of industry contacts. What we didn't have was corporate baggage — and that turned out to be an advantage." },
  { icon: <Target size={18} />, title: "One question per game", body: "Every game starts from one question: what makes a real player choose this over scrolling away? If we can't answer that clearly, the game doesn't ship." },
  { icon: <TrendingUp size={18} />, title: "The fastest-growing vertical", body: "We're targeting crash and arcade — the fastest-growing segment in iGaming, dominated by one or two big names — and we think there's room for games that are smarter, weirder, and more interesting." },
  { icon: <Shield size={18} />, title: "Aligned by design", body: "Revenue share on GGR. No upfront cost to the operator. We earn when your players earn — if our games don't perform in your lobby, we don't get paid." },
];

const founders = [
  { initial: "N", name: "Nika Zaridze", role: "Co-founder · CEO", body: "Runs the machine. Strategy, operations, go-to-market, and making sure shipped means shipped." },
  { initial: "L", name: "Luka Javakhishvili", role: "Co-founder · CCO", body: "Owns the commercial side. Partnerships, sales, and the first conversation you'll have with KANI." },
];

const bring = [
  { icon: <Sparkles size={16} />, title: "Original game mechanics", body: "Not clones. Every title has a mechanic no one else is running." },
  { icon: <Users size={16} />, title: "Industry contacts, ready to move", body: "We know where the doors are." },
  { icon: <MessageSquare size={16} />, title: "Marketing & retention thinking", body: "We design games players talk about." },
  { icon: <Zap size={16} />, title: "Fast iteration", body: "Ship fast, respond to feedback, improve continuously." },
];

const drives = [
  { title: "Fun before math", body: "A 97% RTP on a boring game retains nobody. We start with the feeling, then calibrate the math." },
  { title: "Honest mechanics", body: "Provably fair is a contract with the player. Every title has auditable RNG from the first commit." },
  { title: "Speed to market", body: "We prototype, test, ship, iterate. Operators get working demos, not slide decks." },
];

const sectionLabel = (text: string) => (
  <p style={{ fontSize: "0.6875rem", fontFamily: "monospace", color: "#f5a623", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>{text}</p>
);

export default function AboutPage() {
  return (
    <div style={{ paddingTop: "4rem", background: "#09090b" }}>

      {/* HERO */}
      <section style={{ borderBottom: "1px solid #18181b", padding: "5rem 0 4rem" }}>
        <div style={{ maxWidth: "60rem", margin: "0 auto", padding: "0 1.25rem" }}>
          {sectionLabel("Our story")}
          <h1 style={{ fontSize: "clamp(2.25rem, 6vw, 3.75rem)", fontWeight: 800, color: "#fafafa", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "1.5rem", maxWidth: "20ch" }}>
            Two friends who decided to do it differently
          </h1>
          <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)", color: "#a1a1aa", lineHeight: 1.7, maxWidth: "44ch" }}>
            We started KANI because we were bored of seeing the same tired slots and reskinned crash games. The industry was ready for something fresher.
          </p>
        </div>
      </section>

      {/* THE IDEA — principles grid */}
      <section style={{ padding: "4rem 0", borderBottom: "1px solid #18181b" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.25rem" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            {sectionLabel("The idea behind KANI")}
            <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 700, color: "#fafafa", letterSpacing: "-0.02em" }}>What we believe</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            {principles.map((p, i) => (
              <div key={i} style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "1rem", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.625rem", background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.22)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5a623" }}>{p.icon}</div>
                <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: "#fafafa", lineHeight: 1.3 }}>{p.title}</h3>
                <p style={{ fontSize: "0.9375rem", color: "#71717a", lineHeight: 1.65 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDERS */}
      <section style={{ padding: "4rem 0", borderBottom: "1px solid #18181b" }}>
        <div style={{ maxWidth: "60rem", margin: "0 auto", padding: "0 1.25rem" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            {sectionLabel("The founders")}
            <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 700, color: "#fafafa", letterSpacing: "-0.02em" }}>You talk to us, not an account layer</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {founders.map((f, i) => (
              <div key={i} style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "1rem", padding: "1.75rem", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0, width: "3.5rem", height: "3.5rem", borderRadius: "0.875rem", background: "linear-gradient(135deg, #f5a623, #d4881a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 800, color: "#09090b" }}>{f.initial}</div>
                <div>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#fafafa" }}>{f.name}</h3>
                  <p style={{ fontSize: "0.8125rem", fontFamily: "monospace", color: "#fafafa", marginBottom: "0.625rem", marginTop: "0.125rem" }}>{f.role}</p>
                  <p style={{ fontSize: "0.9375rem", color: "#71717a", lineHeight: 1.6 }}>{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE BRING */}
      <section style={{ padding: "4rem 0", borderBottom: "1px solid #18181b" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.25rem" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            {sectionLabel("What we bring")}
            <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 700, color: "#fafafa", letterSpacing: "-0.02em" }}>Four things you get on day one</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1px", background: "#27272a", border: "1px solid #27272a", borderRadius: "1rem", overflow: "hidden" }}>
            {bring.map((b, i) => (
              <div key={i} style={{ background: "#111113", padding: "1.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "2.25rem", height: "2.25rem", borderRadius: "0.5rem", background: "rgba(255,255,255,0.06)", color: "#fafafa", marginBottom: "1rem" }}>{b.icon}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#fafafa", marginBottom: "0.5rem" }}>{b.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#71717a", lineHeight: 1.6 }}>{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT DRIVES US */}
      <section style={{ padding: "4rem 0", borderBottom: "1px solid #18181b" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "0 1.25rem" }}>
          <div style={{ marginBottom: "2.5rem" }}>
            {sectionLabel("What drives us")}
            <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.25rem)", fontWeight: 700, color: "#fafafa", letterSpacing: "-0.02em" }}>Three things we don't compromise on</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
            {drives.map((d, i) => (
              <div key={i} style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "1rem", padding: "1.75rem", position: "relative" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#27272a", fontFamily: "monospace", lineHeight: 1, marginBottom: "0.75rem" }}>0{i + 1}</div>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#fafafa", marginBottom: "0.625rem" }}>{d.title}</h3>
                <p style={{ fontSize: "0.9375rem", color: "#71717a", lineHeight: 1.65 }}>{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "5rem 0" }}>
        <div style={{ maxWidth: "44rem", margin: "0 auto", padding: "0 1.25rem", textAlign: "center" }}>
          {sectionLabel("Want to talk partnerships?")}
          <h2 style={{ fontSize: "clamp(1.75rem, 5vw, 2.5rem)", fontWeight: 800, color: "#fafafa", letterSpacing: "-0.02em", marginBottom: "1rem" }}>
            Actively signing first operator deals
          </h2>
          <p style={{ fontSize: "1.0625rem", color: "#a1a1aa", lineHeight: 1.7, marginBottom: "2rem" }}>
            If you run a casino or aggregator, we'd love a conversation.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
            <Link href="/partner" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#f5a623", color: "#09090b", fontWeight: 700, fontSize: "0.9375rem", padding: "0.875rem 1.75rem", borderRadius: "0.625rem", textDecoration: "none" }}>
              Partner with us <ArrowRight size={16} />
            </Link>
            <Link href="/games" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#18181b", border: "1px solid #27272a", color: "#fafafa", fontWeight: 600, fontSize: "0.9375rem", padding: "0.875rem 1.75rem", borderRadius: "0.625rem", textDecoration: "none" }}>
              See the games
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
