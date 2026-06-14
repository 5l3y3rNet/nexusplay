import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#090D1A", padding: "1rem" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "5rem", fontWeight: 700, color: "#1e2740", fontFamily: "monospace", lineHeight: 1, marginBottom: "1.5rem" }}>404</div>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fafafa", marginBottom: "0.5rem" }}>Page not found</h1>
        <p style={{ color: "#71717a", fontSize: "0.875rem", marginBottom: "2rem" }}>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#a1a1aa", textDecoration: "none" }}>
          <ArrowLeft size={14} /> Back to homepage
        </Link>
      </div>
    </div>
  );
}
