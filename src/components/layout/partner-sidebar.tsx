"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, BarChart3, Gamepad2, Key, Webhook, Activity, BookOpen, Settings, LogOut, CircleUser, X } from "lucide-react";

const navItems = [
  { icon: <BarChart3 size={15}/>, label: "Overview", href: "/partner/dashboard" },
  { icon: <Gamepad2 size={15}/>, label: "Games", href: "/partner/dashboard/games" },
  { icon: <Key size={15}/>, label: "API Keys", href: "/partner/dashboard/api-keys" },
  { icon: <Webhook size={15}/>, label: "Webhooks", href: "/partner/dashboard/webhooks" },
  { icon: <Activity size={15}/>, label: "Analytics", href: "/partner/dashboard/analytics" },
  { icon: <BookOpen size={15}/>, label: "Documentation", href: "/docs" },
  { icon: <Settings size={15}/>, label: "Settings", href: "/partner/dashboard/settings" },
];

export function PartnerSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <aside style={{ display: "flex", flexDirection: "column", width: "15rem", borderRight: "1px solid #27272a", background: "#09090b", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "4rem", padding: "0 1.25rem", borderBottom: "1px solid #27272a", flexShrink: 0 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <div style={{ width: "1.5rem", height: "1.5rem", background: "#fafafa", borderRadius: "0.25rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={11} style={{ color: "#09090b", fill: "#09090b" }} />
          </div>
          <span style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.875rem" }}>KANI</span>
        </Link>
        {onClose && (
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a" }}><X size={16} /></button>
        )}
      </div>

      <div style={{ flex: 1, padding: "0.75rem", overflowY: "auto" }}>
        <div style={{ fontSize: "0.625rem", fontFamily: "monospace", color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0.5rem 0.75rem", marginBottom: "0.25rem" }}>Partner Portal</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
          {navItems.map(item => {
            const active = pathname === item.href || (item.href !== "/docs" && pathname.startsWith(item.href));
            return (
              <Link key={item.label} href={item.href} style={{
                display: "flex", alignItems: "center", gap: "0.625rem",
                padding: "0.5rem 0.75rem", borderRadius: "0.375rem", textDecoration: "none",
                fontSize: "0.875rem",
                background: active ? "#27272a" : "transparent",
                color: active ? "#fafafa" : "#71717a",
              }}>
                {item.icon}{item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div style={{ padding: "0.75rem", borderTop: "1px solid #27272a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.5rem 0.75rem", marginBottom: "0.25rem" }}>
          <div style={{ width: "1.75rem", height: "1.75rem", background: "#27272a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <CircleUser size={13} style={{ color: "#a1a1aa" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 500, color: "#d4d4d8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Ace Casino Ltd.</div>
            <div style={{ fontSize: "0.625rem", color: "#52525b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>partner@ace.com</div>
          </div>
        </div>
        <Link href="/login" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "0.75rem", color: "#52525b", textDecoration: "none", borderRadius: "0.375rem" }}>
          <LogOut size={12} /> Sign out
        </Link>
      </div>
    </aside>
  );
}
