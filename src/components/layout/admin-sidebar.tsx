"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, BarChart3, Gamepad2, Users, Key, Settings, LogOut, Shield, Activity, Upload, FileText, X } from "lucide-react";

const navItems = [
  { icon: <BarChart3 size={15}/>, label: "Dashboard", href: "/admin/dashboard" },
  { icon: <Gamepad2 size={15}/>, label: "Games", href: "/admin/games" },
  { icon: <Upload size={15}/>, label: "Uploads", href: "/admin/uploads" },
  { icon: <Users size={15}/>, label: "Partners", href: "/admin/partners" },
  { icon: <Key size={15}/>, label: "API Keys", href: "/admin/api-keys" },
  { icon: <Activity size={15}/>, label: "Analytics", href: "/admin/analytics" },
  { icon: <FileText size={15}/>, label: "Audit Log", href: "/admin/audit" },
  { icon: <Settings size={15}/>, label: "Settings", href: "/admin/settings" },
];

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  return (
    <aside style={{ display: "flex", flexDirection: "column", width: "14rem", borderRight: "1px solid #27272a", background: "#09090b", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "4rem", padding: "0 1.25rem", borderBottom: "1px solid #27272a", flexShrink: 0 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <div style={{ width: "1.5rem", height: "1.5rem", background: "#fafafa", borderRadius: "0.25rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={11} style={{ color: "#09090b", fill: "#09090b" }} />
          </div>
          <span style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.875rem" }}>NexusPlay</span>
        </Link>
        {onClose && <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a" }}><X size={16} /></button>}
      </div>

      <nav style={{ flex: 1, padding: "0.75rem", overflowY: "auto" }}>
        <div style={{ fontSize: "0.625rem", fontFamily: "monospace", color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0.5rem 0.75rem", marginBottom: "0.25rem" }}>Admin</div>
        {navItems.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.label} href={item.href} style={{
              display: "flex", alignItems: "center", gap: "0.625rem",
              padding: "0.5rem 0.75rem", borderRadius: "0.375rem", textDecoration: "none",
              fontSize: "0.875rem", marginBottom: "0.125rem",
              background: active ? "#27272a" : "transparent",
              color: active ? "#fafafa" : "#71717a",
            }}>
              {item.icon}{item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "0.75rem", borderTop: "1px solid #27272a" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", marginBottom: "0.25rem" }}>
          <div style={{ width: "1.5rem", height: "1.5rem", background: "rgba(69,10,10,0.8)", border: "1px solid #450a0a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={10} style={{ color: "#f87171" }} />
          </div>
          <div style={{ fontSize: "0.75rem", fontWeight: 500, color: "#d4d4d8" }}>Super Admin</div>
        </div>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "0.75rem", color: "#52525b", textDecoration: "none" }}>
          <LogOut size={12} /> Sign out
        </Link>
      </div>
    </aside>
  );
}
