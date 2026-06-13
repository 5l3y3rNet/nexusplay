import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const plans = [
  {
    name: "Starter", price: "€499", period: "/month",
    description: "For operators launching their first integration.",
    features: ["Access to all 10 games", "Up to 500 active sessions/day", "REST API access", "Standard webhooks", "Email support", "Sandbox environment"],
    cta: "Apply for Starter", highlight: false,
  },
  {
    name: "Growth", price: "€1,499", period: "/month",
    description: "For scaling operators with growing player bases.",
    features: ["Everything in Starter", "Up to 5,000 active sessions/day", "Priority API rate limits", "Real-time analytics", "Webhook retry & monitoring", "Dedicated Slack channel", "Custom currency support"],
    cta: "Apply for Growth", highlight: true,
  },
  {
    name: "Enterprise", price: "Custom", period: "",
    description: "For large operators requiring custom SLAs and volume pricing.",
    features: ["Everything in Growth", "Unlimited sessions", "99.99% uptime SLA", "Dedicated infrastructure", "Custom integration support", "White-label options", "Account manager", "Custom revenue share"],
    cta: "Contact Sales", highlight: false,
  },
];

const faqs = [
  { q: "Is there a free trial?", a: "All plans include a sandbox environment with full API access and no rate limits. You can test your full integration before going live." },
  { q: "What counts as an active session?", a: "An active session is any game session where a player loads a game frame, regardless of whether they place a bet. Sessions expire after 15 minutes of inactivity." },
  { q: "Do you support crypto currencies?", a: "Yes. BTC, ETH, USDT, and LTC are supported on Growth and Enterprise plans. Fiat currency support is included on all plans." },
  { q: "How is the revenue share calculated?", a: "Revenue share is negotiated individually on Enterprise plans. Starter and Growth plans use flat monthly pricing with no revenue share." },
];

export default function PricingPage() {
  return (
    <div style={{ paddingTop: "4rem", minHeight: "100vh", background: "#09090b" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "5rem 1.5rem" }}>

        <div style={{ textAlign: "center", maxWidth: "42rem", margin: "0 auto 4rem" }}>
          <p style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#52525b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Pricing</p>
          <h1 style={{ fontSize: "2.25rem", fontWeight: 700, color: "#fafafa", marginBottom: "1rem" }}>Partner plans</h1>
          <p style={{ color: "#71717a", lineHeight: 1.7 }}>All plans include access to all 10 games, the full REST API, and the partner dashboard. Choose based on your session volume.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", marginBottom: "4rem" }}>
          {plans.map(plan => (
            <div key={plan.name} style={{
              borderRadius: "0.75rem",
              border: `1px solid ${plan.highlight ? "#fafafa" : "#27272a"}`,
              background: plan.highlight ? "#fafafa" : "#111113",
              padding: "1.75rem",
              display: "flex", flexDirection: "column",
            }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: "0.75rem", fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: plan.highlight ? "#52525b" : "#52525b", marginBottom: "0.75rem" }}>
                  {plan.name}
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "0.25rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "2.5rem", fontWeight: 700, fontFamily: "monospace", color: plan.highlight ? "#09090b" : "#fafafa", lineHeight: 1 }}>{plan.price}</span>
                  {plan.period && <span style={{ fontSize: "0.875rem", color: plan.highlight ? "#71717a" : "#71717a", marginBottom: "0.25rem" }}>{plan.period}</span>}
                </div>
                <p style={{ fontSize: "0.875rem", color: plan.highlight ? "#71717a" : "#71717a" }}>{plan.description}</p>
              </div>

              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem", flex: 1, marginBottom: "1.75rem" }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", fontSize: "0.875rem" }}>
                    <CheckCircle2 size={14} style={{ color: plan.highlight ? "#52525b" : "#34d399", marginTop: "0.125rem", flexShrink: 0 }} />
                    <span style={{ color: plan.highlight ? "#52525b" : "#a1a1aa" }}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link href="/partner/register" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                padding: "0.625rem", borderRadius: "0.375rem", fontWeight: 600, fontSize: "0.875rem",
                textDecoration: "none",
                background: plan.highlight ? "#09090b" : "#fafafa",
                color: plan.highlight ? "#fafafa" : "#09090b",
              }}>
                {plan.cta} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: "42rem", margin: "0 auto" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fafafa", textAlign: "center", marginBottom: "2rem" }}>Common questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {faqs.map(({ q, a }) => (
              <div key={q} style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "0.75rem", padding: "1.25rem" }}>
                <div style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.875rem", marginBottom: "0.5rem" }}>{q}</div>
                <div style={{ fontSize: "0.875rem", color: "#71717a", lineHeight: 1.7 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
