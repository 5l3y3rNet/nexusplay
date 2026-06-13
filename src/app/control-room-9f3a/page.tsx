"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Shield } from "lucide-react";
import { useAuth } from "@/contexts/auth";

export default function AdminLoginPage() {
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
    // Redirect to admin dashboard; the dashboard itself checks role
    router.push("/admin/dashboard");
  }

  const inp: React.CSSProperties = { width: "100%", background: "#0c0e16", border: "1px solid #1e2230", borderRadius: "0.625rem", color: "#fafafa", fontSize: "1rem", padding: "0.8125rem", outline: "none" };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#070809", padding: "1.25rem" }}>
      <div style={{ width: "100%", maxWidth: "23rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: "3rem", height: "3rem", borderRadius: "0.875rem", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
            <Shield size={22} style={{ color: "#f87171" }} />
          </div>
          <h1 style={{ fontSize: "1.375rem", fontWeight: 700, color: "#fafafa", marginBottom: "0.375rem" }}>Control Room</h1>
          <p style={{ fontSize: "0.9375rem", color: "#71757f" }}>Administrator access only</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: "#0c0e16", border: "1px solid #161a26", borderRadius: "1rem", padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {error && <div style={{ background: "rgba(40,12,12,0.9)", border: "1px solid #4a1515", borderRadius: "0.625rem", padding: "0.8125rem", fontSize: "0.9375rem", color: "#f87171" }}>{error}</div>}
          <div>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "#9aa0ad", marginBottom: "0.5rem" }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@kani.studio" required style={inp} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, color: "#9aa0ad", marginBottom: "0.5rem" }}>Password</label>
            <div style={{ position: "relative" }}>
              <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ ...inp, paddingRight: "3rem" }} />
              <button type="button" onClick={() => setShow(!show)} style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#71757f" }}>
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ background: loading ? "#444" : "#fafafa", color: "#09090b", fontWeight: 700, fontSize: "1rem", padding: "0.8125rem", borderRadius: "0.75rem", border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Verifying…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
