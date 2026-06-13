import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #27272a", background: "#09090b" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "3.5rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "2.5rem" }}>
          <div style={{ gridColumn: "span 2" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", marginBottom: "1rem" }}>
              <div style={{ width: "1.75rem", height: "1.75rem", background: "#fafafa", borderRadius: "0.375rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={14} style={{ color: "#09090b", fill: "#09090b" }} />
              </div>
              <span style={{ fontWeight: 600, color: "#fafafa" }}>NexusPlay</span>
            </Link>
            <p style={{ fontSize: "0.875rem", color: "#52525b", lineHeight: 1.625, maxWidth: "18rem" }}>
              Premium crash and arcade game provider for licensed casino operators worldwide.
            </p>
            <p style={{ fontSize: "0.75rem", color: "#3f3f46", marginTop: "1rem" }}>
              &copy; 2024 NexusPlay Ltd. All rights reserved.
            </p>
          </div>

          {[
            { heading: "Platform", links: [["Games", "/games"], ["Pricing", "/about"], ["Partners", "/partner"]] },
            { heading: "Developers", links: [["Documentation", "/docs"], ["API Reference", "/docs/api"], ["SDKs", "/docs/sdk"], ["Webhooks", "/docs/webhooks"]] },
            { heading: "Company", links: [["About", "/about"], ["Contact", "/contact"], ["Status", "#"], ["Security", "#"]] },
          ].map(col => (
            <div key={col.heading}>
              <h4 style={{ fontSize: "0.875rem", fontWeight: 500, color: "#d4d4d8", marginBottom: "1rem" }}>{col.heading}</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} style={{ fontSize: "0.875rem", color: "#52525b", textDecoration: "none" }}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
