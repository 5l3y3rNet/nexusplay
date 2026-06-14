"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, BarChart3, Gamepad2, Users, Inbox, FileText, LogOut, Shield, X } from "lucide-react";
import { useAuth } from "@/contexts/auth";

const navItems = [
  { icon: <BarChart3 size={15} />, label: "Dashboard", href: "/admin/dashboard" },
  { icon: <Gamepad2 size={15} />, label: "Games", href: "/admin/games" },
  { icon: <Users size={15} />, label: "Users", href: "/admin/users" },
  { icon: <Inbox size={15} />, label: "Inquiries", href: "/admin/inquiries" },
];

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  return (
    <aside style={{ display: "flex", flexDirection: "column", width: "14rem", borderRight: "1px solid #1e2740", background: "#090D1A", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "4rem", padding: "0 1.25rem", borderBottom: "1px solid #1e2740", flexShrink: 0 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <span style={{ fontWeight: 800, color: "#fafafa", fontSize: "1.0625rem", letterSpacing: "0.05em" }}>KAN<span style={{ color: "#f5a623" }}>I</span></span>
        </Link>
        {onClose && <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#71757f" }}><X size={16} /></button>}
      </div>

      <nav style={{ flex: 1, padding: "0.75rem", overflowY: "auto" }}>
        <div style={{ fontSize: "0.625rem", fontFamily: "monospace", color: "#3f4250", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0.5rem 0.75rem", marginBottom: "0.25rem" }}>Admin</div>
        {navItems.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.label} href={item.href} style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.625rem 0.75rem", borderRadius: "0.5rem", textDecoration: "none", fontSize: "0.9375rem", marginBottom: "0.125rem", background: active ? "rgba(245,166,35,0.12)" : "transparent", color: active ? "#f5a623" : "#8b8f9b" }}>
              {item.icon}{item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "0.75rem", borderTop: "1px solid #1e2740" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", marginBottom: "0.25rem" }}>
          <div style={{ width: "1.5rem", height: "1.5rem", background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={10} style={{ color: "#f87171" }} />
          </div>
          <div style={{ fontSize: "0.8125rem", fontWeight: 500, color: "#c4c7cf" }}>Administrator</div>
        </div>
        <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "0.8125rem", color: "#71757f", background: "none", border: "none", cursor: "pointer", width: "100%" }}>
          <LogOut size={12} /> Sign out
        </button>
      </div>
    </aside>
  );
}
