"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Zap } from "lucide-react";
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

  const inp: React.CSSProperties = { width: "100%", background: "#18181b", border: "1px solid #27272a", borderRadius: "0.5rem", color: "#fafafa", fontSize: "1rem", padding: "0.75rem", outline: "none" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#09090b", padding: "1.25rem" }}>
      <div style={{ width: "100%", maxWidth: "24rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", marginBottom: "1.5rem" }}>
            <div style={{ width: "2.25rem", height: "2.25rem", background: "#fafafa", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={17} style={{ color: "#09090b", fill: "#09090b" }} />
            </div>
            <span style={{ fontWeight: 700, color: "#fafafa", fontSize: "1.125rem" }}>NexusPlay</span>
          </Link>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fafafa", marginBottom: "0.375rem" }}>Partner sign in</h1>
          <p style={{ fontSize: "0.9375rem", color: "#71717a" }}>Access your integration dashboard</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "0.875rem", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {error && <div style={{ background: "rgba(28,10,10,0.9)", border: "1px solid #450a0a", borderRadius: "0.5rem", padding: "0.875rem", fontSize: "0.9375rem", color: "#f87171" }}>{error}</div>}

          <div>
            <label style={{ display: "block", fontSize: "0.9375rem", fontWeight: 500, color: "#d4d4d8", marginBottom: "0.5rem" }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@casino.com" required style={inp} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.9375rem", fontWeight: 500, color: "#d4d4d8", marginBottom: "0.5rem" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ ...inp, paddingRight: "3rem" }} />
              <button type="button" onClick={() => setShow(!show)} style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#71717a" }}>
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ background: loading ? "#52525b" : "#fafafa", color: "#09090b", fontWeight: 700, fontSize: "1rem", padding: "0.875rem", borderRadius: "0.5rem", border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <div style={{ textAlign: "center", fontSize: "0.8125rem", color: "#52525b", paddingTop: "0.5rem", borderTop: "1px solid #27272a" }}>
            Demo: admin@nexusplay.io / Admin1234!
          </div>
        </form>

        <p style={{ textAlign: "center", fontSize: "0.9375rem", color: "#71717a", marginTop: "1.25rem" }}>
          Not a partner? <Link href="/partner/register" style={{ color: "#d4d4d8", textDecoration: "none", fontWeight: 500 }}>Apply for access →</Link>
        </p>
      </div>
    </div>
  );
}
