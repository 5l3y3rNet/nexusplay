"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import { PartnerSidebar } from "@/components/layout/partner-sidebar";

const inputStyle = { width: "100%", background: "#131a2e", border: "1px solid #1e2740", borderRadius: "0.375rem", color: "#fafafa", fontSize: "0.875rem", padding: "0.5rem 0.75rem", outline: "none" } as React.CSSProperties;
const labelStyle = { display: "block" as const, fontSize: "0.75rem", fontWeight: 500 as const, color: "#a1a1aa", marginBottom: "0.5rem" };

export default function SettingsPage() {
  const [mob, setMob] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ company: "Ace Casino Ltd.", email: "partner@ace.com", website: "https://acecasino.com", ip: "203.0.113.10\n198.51.100.42", errNotify: true, usageNotify: false });
  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [f]: e.target.value }));
  const toggle = (f: string) => () => setForm(p => ({ ...p, [f]: !(p as any)[f] }));
  const card: React.CSSProperties = { background: "#0f1424", border: "1px solid #1e2740", borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "1rem" };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#090D1A", overflow: "hidden" }}>
      <div className="hidden lg:block" style={{ width: "15rem", flexShrink: 0 }}><PartnerSidebar /></div>
      {mob && <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}><div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} onClick={() => setMob(false)} /><div style={{ position: "relative", width: "15rem", height: "100%" }}><PartnerSidebar onClose={() => setMob(false)} /></div></div>}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ height: "4rem", borderBottom: "1px solid #1e2740", display: "flex", alignItems: "center", gap: "0.75rem", padding: "0 1.5rem", flexShrink: 0 }}>
          <button onClick={() => setMob(true)} className="lg:hidden" style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a" }}><Menu size={18} /></button>
          <h2 style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.875rem" }}>Account Settings</h2>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          <div style={{ maxWidth: "38rem" }}>
            <div style={card}>
              <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fafafa", marginBottom: "1.25rem" }}>Company Information</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div><label style={labelStyle}>Company name</label><input value={form.company} onChange={set("company")} style={inputStyle} /></div>
                <div><label style={labelStyle}>Contact email</label><input value={form.email} onChange={set("email")} style={inputStyle} /></div>
              </div>
              <div><label style={labelStyle}>Website</label><input value={form.website} onChange={set("website")} style={inputStyle} /></div>
            </div>

            <div style={card}>
              <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fafafa", marginBottom: "0.5rem" }}>IP Allowlist</h3>
              <p style={{ fontSize: "0.75rem", color: "#52525b", marginBottom: "0.75rem" }}>Restrict API key usage to these IPs (one per line). Leave blank to allow all.</p>
              <textarea value={form.ip} onChange={set("ip")} rows={4} placeholder="e.g. 203.0.113.10" style={{ ...inputStyle, resize: "none", fontFamily: "monospace", fontSize: "0.75rem" }} />
            </div>

            <div style={card}>
              <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fafafa", marginBottom: "1rem" }}>Notifications</h3>
              {[
                { key: "errNotify", label: "Webhook failure alerts", desc: "Email when webhook delivery fails repeatedly" },
                { key: "usageNotify", label: "Usage threshold alerts", desc: "Email when approaching API rate limits" },
              ].map(({ key, label, desc }) => (
                <label key={key} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer", marginBottom: "0.75rem" }}>
                  <input type="checkbox" checked={(form as any)[key]} onChange={toggle(key)} style={{ marginTop: "0.125rem", accentColor: "#fafafa" }} />
                  <div>
                    <div style={{ fontSize: "0.875rem", color: "#d4d4d8" }}>{label}</div>
                    <div style={{ fontSize: "0.75rem", color: "#52525b" }}>{desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
              style={{ background: "#f5a623", color: "#090D1A", fontWeight: 600, fontSize: "0.875rem", padding: "0.625rem 1.25rem", borderRadius: "0.375rem", border: "none", cursor: "pointer" }}>
              {saved ? "Saved!" : "Save changes"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
