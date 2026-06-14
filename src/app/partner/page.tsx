"use client";
import { useState } from "react";
import { CheckCircle2, Check } from "lucide-react";
import { games } from "@/lib/games";

const benefits = [
  { title: "No upfront fee", body: "Pure revenue share on GGR. We only earn when the games perform." },
  { title: "Days to integrate, not months", body: "Single-file HTML5 games. Iframe in, wallet API connected, done." },
  { title: "Founders on the call", body: "You talk to the people who built the games, not an account layer." },
];

const roleOptions = ["Operator", "Aggregator", "Platform provider", "Affiliate", "Other"];

export default function PartnerPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", role: "", message: "" });
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }));

  const toggleGame = (id: string) =>
    setSelectedGames(g => g.includes(id) ? g.filter(x => x !== id) : [...g, id]);

  async function submit() {
    setError("");
    if (!form.name.trim() || !form.email.trim()) { setError("Name and work email are required."); return; }
    setLoading(true);
    try {
      const r = await fetch("/api/inquiries", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, gamesInterested: selectedGames }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Something went wrong."); setLoading(false); return; }
      setSent(true);
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  const inp: React.CSSProperties = {
    width: "100%", background: "#111113", border: "1px solid #27272a",
    borderRadius: "0.625rem", color: "#fafafa", fontSize: "0.9375rem",
    padding: "0.75rem 0.875rem", outline: "none",
  };
  const lbl: React.CSSProperties = { display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "#a1a1aa", marginBottom: "0.5rem" };
  const featured = games.slice(0, 5);

  if (sent) {
    return (
      <div style={{ paddingTop: "4rem", minHeight: "100vh", background: "#09090b", display: "flex", alignItems: "center", justifyContent: "center", padding: "5rem 1.25rem" }}>
        <div style={{ textAlign: "center", maxWidth: "30rem" }}>
          <div style={{ width: "3.5rem", height: "3.5rem", borderRadius: "1rem", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <CheckCircle2 size={26} style={{ color: "#fafafa" }} />
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#fafafa", marginBottom: "0.75rem" }}>Message sent</h1>
          <p style={{ fontSize: "1rem", color: "#a1a1aa", lineHeight: 1.7 }}>
            Thanks for reaching out. This went straight to the founders&apos; inbox — we&apos;ll reply within 24 hours with demo access and a straight answer on fit.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "4rem", minHeight: "100vh", background: "#09090b" }}>
      <style>{`
        .partner-grid { display: grid; grid-template-columns: 1fr; gap: 2.5rem; }
        @media (min-width: 980px) {
          .partner-grid { grid-template-columns: 1fr 1.1fr; gap: 4rem; align-items: start; }
        }
        .partner-form-card { padding: 1.5rem; }
        @media (min-width: 640px) { .partner-form-card { padding: 2.25rem; } }
      `}</style>
      <div style={{ maxWidth: "75rem", margin: "0 auto", padding: "4rem 1.25rem 5rem" }}>
        <div className="partner-grid">

          {/* LEFT — pitch */}
          <div>
            <p style={{ fontSize: "0.6875rem", fontFamily: "monospace", color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "1rem" }}>Partner with us</p>
            <h1 style={{ fontSize: "clamp(2.25rem, 6vw, 3.5rem)", fontWeight: 800, color: "#fafafa", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "1.5rem" }}>
              Let&apos;s put something new in your lobby
            </h1>
            <p style={{ fontSize: "1.0625rem", color: "#a1a1aa", lineHeight: 1.75, marginBottom: "2.5rem", maxWidth: "30rem" }}>
              Tell us about your platform. We&apos;ll reply within 24 hours with demo access, math models, and a straight answer on fit — no generic deck.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2.5rem" }}>
              {benefits.map(b => (
                <div key={b.title} style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0, width: "1.625rem", height: "1.625rem", borderRadius: "50%", background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "0.125rem" }}>
                    <Check size={13} style={{ color: "#22c55e" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fafafa", marginBottom: "0.25rem" }}>{b.title}</div>
                    <div style={{ fontSize: "0.9375rem", color: "#71717a", lineHeight: 1.55 }}>{b.body}</div>
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: "0.9375rem", color: "#71717a" }}>
              Prefer email? <a href="mailto:hello@kani.studio" style={{ color: "#60a5fa", textDecoration: "none", fontWeight: 600 }}>hello@kani.studio</a>
            </p>
          </div>

          {/* RIGHT — form */}
          <div className="partner-form-card" style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "1.25rem" }}>
            {error && (
              <div style={{ background: "rgba(40,12,12,0.9)", border: "1px solid #4a1515", borderRadius: "0.625rem", padding: "0.75rem 0.875rem", fontSize: "0.875rem", color: "#f87171", marginBottom: "1.25rem" }}>{error}</div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
              <div>
                <label style={lbl}>Name <span style={{ color: "#fafafa" }}>*</span></label>
                <input value={form.name} onChange={set("name")} placeholder="Your name" style={inp} />
              </div>
              <div>
                <label style={lbl}>Work email <span style={{ color: "#fafafa" }}>*</span></label>
                <input type="email" value={form.email} onChange={set("email")} placeholder="you@company.com" style={inp} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
              <div>
                <label style={lbl}>Company <span style={{ color: "#fafafa" }}>*</span></label>
                <input value={form.company} onChange={set("company")} placeholder="Company / brand" style={inp} />
              </div>
              <div>
                <label style={lbl}>You are a... <span style={{ color: "#fafafa" }}>*</span></label>
                <select value={form.role} onChange={set("role")} style={{ ...inp, color: form.role ? "#fafafa" : "#52525b" }}>
                  <option value="">Select an option</option>
                  {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <label style={lbl}>Games you&apos;re interested in <span style={{ color: "#52525b" }}>(optional)</span></label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {featured.map(g => {
                  const active = selectedGames.includes(g.id);
                  return (
                    <button key={g.id} onClick={() => toggleGame(g.id)} type="button"
                      style={{ fontSize: "0.75rem", fontWeight: 600, fontFamily: "monospace", letterSpacing: "0.03em", padding: "0.5rem 0.875rem", borderRadius: "9999px", cursor: "pointer", textTransform: "uppercase", border: "1px solid", background: active ? "rgba(59,130,246,0.15)" : "#111113", color: active ? "#60a5fa" : "#a1a1aa", borderColor: active ? "rgba(59,130,246,0.4)" : "#27272a" }}>
                      {g.title}
                    </button>
                  );
                })}
                <button onClick={() => setSelectedGames(selectedGames.length === featured.length ? [] : featured.map(g => g.id))} type="button"
                  style={{ fontSize: "0.75rem", fontWeight: 600, fontFamily: "monospace", padding: "0.5rem 0.875rem", borderRadius: "9999px", cursor: "pointer", border: "1px solid #27272a", background: "#111113", color: "#a1a1aa" }}>
                  Whole portfolio
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={lbl}>Anything else we should know? <span style={{ color: "#52525b" }}>(optional)</span></label>
              <textarea value={form.message} onChange={set("message")} rows={4} placeholder="Markets you operate in, monthly actives, timeline..." style={{ ...inp, resize: "vertical", minHeight: "7rem" }} />
            </div>

            <button onClick={submit} disabled={loading}
              style={{ width: "100%", background: loading ? "#2563eb" : "#3b82f6", color: "#ffffff", fontWeight: 700, fontSize: "1rem", padding: "0.9375rem", borderRadius: "0.75rem", border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Sending…" : "Send — we reply within 24h"}
            </button>
            <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "#52525b", marginTop: "1rem" }}>
              No newsletters, no spam. This goes straight to the founders&apos; inbox.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
