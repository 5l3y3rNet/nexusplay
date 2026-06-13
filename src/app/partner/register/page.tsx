"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, CheckCircle2, Copy } from "lucide-react";
import { useAuth } from "@/contexts/auth";

const benefits = ["10 premium crash & arcade games", "Full REST API with webhook support", "Sandbox environment included", "Dedicated integration engineer", "Real-time analytics dashboard"];
const inp = { width: "100%", background: "#18181b", border: "1px solid #27272a", borderRadius: "0.375rem", color: "#fafafa", fontSize: "0.875rem", padding: "0.5rem 0.75rem", outline: "none" } as React.CSSProperties;
const lbl = { display: "block" as const, fontSize: "0.75rem", fontWeight: 500 as const, color: "#a1a1aa", marginBottom: "0.375rem" };

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [apiKey, setApiKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", website: "", country: "", licenseNumber: "", password: "" });
  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(p => ({ ...p, [f]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await register(form);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    setApiKey(result.apiKey || "");
    setStep(2);
  }

  if (step === 2) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#09090b" }}>
      <div style={{ textAlign: "center", maxWidth: "28rem", padding: "1.5rem" }}>
        <div style={{ width: "3rem", height: "3rem", background: "rgba(2,44,34,0.9)", border: "1px solid #064e3b", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
          <CheckCircle2 size={22} style={{ color: "#34d399" }} />
        </div>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fafafa", marginBottom: "0.5rem" }}>Account created</h2>
        <p style={{ fontSize: "0.875rem", color: "#71717a", lineHeight: 1.7, marginBottom: "1.5rem" }}>
          Your account is pending review. Your test API key is shown below — save it now, it will not be shown again.
        </p>
        {apiKey && (
          <div style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "0.75rem", padding: "1.25rem", marginBottom: "1.5rem", textAlign: "left" }}>
            <div style={{ fontSize: "0.75rem", color: "#71717a", marginBottom: "0.5rem" }}>Your Test API Key</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#18181b", border: "1px solid #27272a", borderRadius: "0.375rem", padding: "0.625rem 0.75rem" }}>
              <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#34d399", flex: 1, wordBreak: "break-all" }}>{apiKey}</span>
              <button onClick={() => { navigator.clipboard.writeText(apiKey); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a", flexShrink: 0 }}><Copy size={14} /></button>
            </div>
            {copied && <p style={{ fontSize: "0.75rem", color: "#34d399", marginTop: "0.5rem" }}>Copied!</p>}
          </div>
        )}
        <button onClick={() => router.push("/partner/dashboard")}
          style={{ background: "#fafafa", color: "#09090b", fontWeight: 600, fontSize: "0.875rem", padding: "0.625rem 1.5rem", borderRadius: "0.375rem", border: "none", cursor: "pointer" }}>
          Go to dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#09090b" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "22rem", borderRight: "1px solid #27272a", padding: "2.5rem", flexShrink: 0 }}
        className="hidden lg:flex">
        <div>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", marginBottom: "3rem" }}>
            <div style={{ width: "2rem", height: "2rem", background: "#fafafa", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={15} style={{ color: "#09090b", fill: "#09090b" }} />
            </div>
            <span style={{ fontWeight: 600, color: "#fafafa" }}>NexusPlay</span>
          </Link>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fafafa", marginBottom: "0.75rem" }}>Partner access</h2>
          <p style={{ fontSize: "0.875rem", color: "#71717a", lineHeight: 1.7, marginBottom: "2rem" }}>Get full API access to 10 premium games for your licensed casino.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {benefits.map(b => (
              <div key={b} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", fontSize: "0.875rem", color: "#a1a1aa" }}>
                <CheckCircle2 size={14} style={{ color: "#34d399", marginTop: "0.125rem", flexShrink: 0 }} />{b}
              </div>
            ))}
          </div>
        </div>
        <p style={{ fontSize: "0.75rem", color: "#3f3f46" }}>Requires valid casino operator license</p>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem" }}>
        <div style={{ width: "100%", maxWidth: "28rem" }}>
          <div style={{ marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fafafa", marginBottom: "0.375rem" }}>Apply for partner access</h1>
            <p style={{ fontSize: "0.875rem", color: "#71717a" }}>All fields required. Your account will be active immediately for testing.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {error && <div style={{ background: "rgba(28,10,10,0.9)", border: "1px solid #450a0a", borderRadius: "0.375rem", padding: "0.75rem", fontSize: "0.875rem", color: "#f87171" }}>{error}</div>}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div><label style={lbl}>Full name</label><input value={form.name} onChange={set("name")} placeholder="Alex Smith" required style={inp} /></div>
              <div><label style={lbl}>Work email</label><input type="email" value={form.email} onChange={set("email")} placeholder="you@casino.com" required style={inp} /></div>
            </div>
            <div><label style={lbl}>Company / Casino name</label><input value={form.company} onChange={set("company")} placeholder="Ace Casino Ltd." required style={inp} /></div>
            <div><label style={lbl}>Casino website</label><input type="url" value={form.website} onChange={set("website")} placeholder="https://acecasino.com" style={inp} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={lbl}>Country</label>
                <select value={form.country} onChange={set("country")} style={{ ...inp, color: form.country ? "#fafafa" : "#52525b" }}>
                  <option value="">Select</option>
                  {["Malta","Gibraltar","Isle of Man","Curaçao","United Kingdom","Estonia","Other"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label style={lbl}>License number</label><input value={form.licenseNumber} onChange={set("licenseNumber")} placeholder="MGA/B2C/..." style={inp} /></div>
            </div>
            <div><label style={lbl}>Password</label><input type="password" value={form.password} onChange={set("password")} placeholder="Min 8 characters" required minLength={8} style={inp} /></div>

            <button type="submit" disabled={loading}
              style={{ background: loading ? "#52525b" : "#fafafa", color: "#09090b", fontWeight: 600, fontSize: "0.875rem", padding: "0.625rem", borderRadius: "0.375rem", border: "none", cursor: loading ? "not-allowed" : "pointer", marginTop: "0.5rem" }}>
              {loading ? "Creating account…" : "Create account"}
            </button>
            <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#71717a" }}>
              Already have an account? <Link href="/partner/login" style={{ color: "#a1a1aa", textDecoration: "none" }}>Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
