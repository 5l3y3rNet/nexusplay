"use client";
import Link from "next/link";
import { ArrowRight, BookOpen, Key, Webhook, Code2, Zap, Shield } from "lucide-react";

const docSections = [
  { icon: <Zap size={18} />, title: "Getting Started", description: "Register as a partner, get your API keys, and launch your first game in under 30 minutes.", href: "/docs/getting-started", items: ["Account setup", "API credentials", "First game launch", "Sandbox environment"] },
  { icon: <Key size={18} />, title: "Authentication", description: "API key management, JWT tokens, HMAC request signing, and session security.", href: "/docs/authentication", items: ["API keys", "JWT tokens", "HMAC signing", "Token refresh"] },
  { icon: <Code2 size={18} />, title: "API Reference", description: "Complete reference for all REST endpoints, request formats, and response schemas.", href: "/docs/api", items: ["Game launch", "Session management", "Balance callbacks", "Error codes"] },
  { icon: <Webhook size={18} />, title: "Webhooks", description: "Real-time event delivery for game sessions, transactions, and player activity.", href: "/docs/webhooks", items: ["Event types", "Payload format", "Signature verification", "Retry policy"] },
  { icon: <Shield size={18} />, title: "Security", description: "Best practices for securing your integration, protecting player data, and fraud prevention.", href: "/docs/security", items: ["HMAC verification", "IP allowlisting", "Rate limits", "Audit logs"] },
  { icon: <BookOpen size={18} />, title: "SDK Reference", description: "Official SDKs for JavaScript, TypeScript, PHP, Python, and C#.", href: "/docs/sdk", items: ["JavaScript SDK", "PHP SDK", "Python SDK", "C# SDK"] },
];

export default function DocsPage() {
  return (
    <div style={{ paddingTop: "4rem", minHeight: "100vh", background: "#09090b" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "3.5rem 1.5rem" }}>

        <div style={{ maxWidth: "42rem", marginBottom: "3.5rem" }}>
          <p style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#52525b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>Documentation</p>
          <h1 style={{ fontSize: "2.25rem", fontWeight: 700, color: "#fafafa", marginBottom: "1rem" }}>NexusPlay API Docs</h1>
          <p style={{ color: "#71717a", lineHeight: 1.7 }}>Everything you need to integrate NexusPlay games into your casino platform. Start with the quick-start guide or jump straight to the API reference.</p>
        </div>

        {/* Quick start callout */}
        <div style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "3rem", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <div style={{ fontWeight: 600, color: "#fafafa", marginBottom: "0.375rem" }}>New to NexusPlay?</div>
            <div style={{ fontSize: "0.875rem", color: "#71717a" }}>Follow the getting started guide to go from zero to a live game in 30 minutes.</div>
          </div>
          <Link href="/docs/getting-started" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#f5a623", color: "#09090b", fontWeight: 600, fontSize: "0.875rem", padding: "0.625rem 1.25rem", borderRadius: "0.375rem", textDecoration: "none", flexShrink: 0 }}>
            Quick start <ArrowRight size={14} />
          </Link>
        </div>

        {/* Sections grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
          {docSections.map((section) => (
            <Link key={section.title} href={section.href} style={{ textDecoration: "none" }}>
              <div style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "0.75rem", padding: "1.5rem", height: "100%", transition: "border-color 0.15s" }}
                
                >
                <div style={{ width: "2.25rem", height: "2.25rem", background: "#18181b", border: "1px solid #27272a", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", color: "#71717a", marginBottom: "1rem" }}>
                  {section.icon}
                </div>
                <h3 style={{ fontWeight: 600, color: "#fafafa", marginBottom: "0.5rem", fontSize: "0.9375rem" }}>{section.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#52525b", lineHeight: 1.625, marginBottom: "1rem" }}>{section.description}</p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  {section.items.map(item => (
                    <li key={item} style={{ fontSize: "0.75rem", color: "#3f3f46", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ width: "4px", height: "4px", background: "#3f3f46", borderRadius: "50%", flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>

        {/* Code sample */}
        <div style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "0.75rem", overflow: "hidden" }}>
          <div style={{ padding: "1.5rem", borderBottom: "1px solid #27272a" }}>
            <h3 style={{ fontWeight: 600, color: "#fafafa", marginBottom: "0.375rem" }}>Launch a game — 5 lines of code</h3>
            <p style={{ fontSize: "0.875rem", color: "#52525b" }}>Use our SDK to get a signed launch URL in seconds.</p>
          </div>
          <div style={{ padding: "1.5rem" }}>
            <pre style={{ background: "#18181b", border: "1px solid #27272a", borderRadius: "0.5rem", padding: "1rem", fontFamily: "monospace", fontSize: "0.75rem", color: "#a1a1aa", lineHeight: 1.75, overflow: "auto", margin: 0 }}>
{`const nexus = require('@nexusplay/sdk');

const client = new nexus.Client({
  apiKey: process.env.NEXUS_API_KEY,
  operatorId: 'op_abc123',
});

const session = await client.games.launch({
  gameId: 'elevator',
  playerId: 'player_xyz',
  currency: 'USD',
  balance: 1000,
});

console.log(session.launchUrl);`}
            </pre>
            <div style={{ marginTop: "1rem", display: "flex", gap: "1.5rem" }}>
              {["PHP example", "Python example", "C# example"].map(ex => (
                <Link key={ex} href="/docs/sdk" style={{ fontSize: "0.75rem", color: "#52525b", textDecoration: "none" }}>{ex} →</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
