"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);
    const r = await login(email, password);
    setLoading(false);
    if (r.error) { setError(r.error); return; }
    router.push("/partner/dashboard");
  }

  const inp: React.CSSProperties = { width: "100%", background: "#111113", border: "1px solid #27272a", borderRadius: "0.625rem", color: "#fafafa", fontSize: "1rem", padding: "0.8125rem", outline: "none" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#09090b", padding: "1.25rem" }}>
      <div style={{ width: "100%", maxWidth: "23rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontWeight: 800, color: "#fafafa", fontSize: "1.75rem", letterSpacing: "0.05em" }}>KAN<span style={{ color: "#3b82f6" }}>I</span></span>
          </a>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 700, color: "#fafafa", marginTop: "1.25rem", marginBottom: "0.375rem" }}>Operator sign in</h1>
          <p style={{ fontSize: "0.9375rem", color: "#71717a" }}>Use the credentials provided by KANI</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "1rem", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {error && <div style={{ background: "rgba(40,12,12,0.9)", border: "1px solid #4a1515", borderRadius: "0.625rem", padding: "0.8125rem", fontSize: "0.9375rem", color: "#f87171" }}>{error}</div>}
          <div>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "#a1a1aa", marginBottom: "0.5rem" }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required style={inp} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "#a1a1aa", marginBottom: "0.5rem" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ ...inp, paddingRight: "3rem" }} />
              <button type="button" onClick={() => setShow(!show)} style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#71717a" }}>
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ background: loading ? "#2563eb" : "#3b82f6", color: "#ffffff", fontWeight: 700, fontSize: "1rem", padding: "0.8125rem", borderRadius: "0.75rem", border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
