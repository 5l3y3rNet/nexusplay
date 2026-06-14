"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, LayoutDashboard, Shield } from "lucide-react";
import { useAuth } from "@/contexts/auth";

const navLinks = [
  { href: "/", label: "Home", exact: true },
  { href: "/games", label: "Games" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  const hide =
    pathname.startsWith("/partner/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/play";
  if (hide) return null;

  const isAdmin = user?.role === "admin";
  const dashHref = isAdmin ? "/admin/dashboard" : "/partner/dashboard";
  const isActive = (l: typeof navLinks[0]) => l.exact ? pathname === l.href : pathname.startsWith(l.href);

  return (
    <>
      <style>{`
        .nav-desktop { display: none; }
        .nav-mobile-btn { display: flex; }
        @media (min-width: 820px) {
          .nav-desktop { display: flex; }
          .nav-mobile-btn { display: none; }
        }
      `}</style>
      <header style={{ position: "fixed", top: "0.75rem", left: "50%", transform: "translateX(-50%)", zIndex: 50, width: "calc(100% - 1.5rem)", maxWidth: "62rem" }}>
        <div style={{ background: "rgba(14,16,22,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid #1c1f2b", borderRadius: "9999px", padding: "0 0.5rem 0 1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "3.25rem" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", flexShrink: 0 }}>
              <span style={{ fontWeight: 800, color: "#fafafa", fontSize: "1.125rem", letterSpacing: "0.05em" }}>KAN<span style={{ color: "#3b82f6" }}>I</span></span>
            </Link>

            <nav className="nav-desktop" style={{ alignItems: "center", gap: "0.25rem", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} style={{ padding: "0.4rem 0.875rem", fontSize: "0.9375rem", borderRadius: "9999px", textDecoration: "none", color: isActive(link) ? "#fafafa" : "#8b8f9b" }}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="nav-desktop" style={{ alignItems: "center", gap: "0.5rem" }}>
              {!loading && user ? (
                <Link href={dashHref} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#3b82f6", color: "#ffffff", fontSize: "0.875rem", fontWeight: 700, padding: "0.5rem 1.125rem", borderRadius: "9999px", textDecoration: "none" }}>
                  {isAdmin && <Shield size={14} />}<LayoutDashboard size={14} /> Dashboard
                </Link>
              ) : (
                <Link href="/partner" style={{ display: "inline-flex", alignItems: "center", background: "#3b82f6", color: "#ffffff", fontSize: "0.875rem", fontWeight: 700, padding: "0.5rem 1.25rem", borderRadius: "9999px", textDecoration: "none" }}>
                  Partner with us
                </Link>
              )}
            </div>

            <button className="nav-mobile-btn" onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", color: "#c4c7cf", padding: "0.5rem", alignItems: "center", justifyContent: "center" }}>
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <div style={{ marginTop: "0.5rem", background: "rgba(14,16,22,0.97)", backdropFilter: "blur(20px)", border: "1px solid #1c1f2b", borderRadius: "1.25rem", padding: "0.75rem" }}>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.125rem", marginBottom: "0.5rem" }}>
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} style={{ display: "block", padding: "0.75rem 1rem", fontSize: "1rem", fontWeight: 500, color: isActive(link) ? "#fafafa" : "#9aa0ad", textDecoration: "none", borderRadius: "0.625rem", background: isActive(link) ? "#161a26" : "transparent" }}>
                  {link.label}
                </Link>
              ))}
            </nav>
            {!loading && user ? (
              <Link href={dashHref} onClick={() => setOpen(false)} style={{ display: "block", padding: "0.875rem", fontSize: "1rem", fontWeight: 700, background: "#3b82f6", color: "#ffffff", textDecoration: "none", textAlign: "center", borderRadius: "0.75rem" }}>Dashboard</Link>
            ) : (
              <Link href="/partner" onClick={() => setOpen(false)} style={{ display: "block", padding: "0.875rem", fontSize: "1rem", fontWeight: 700, background: "#3b82f6", color: "#ffffff", textDecoration: "none", textAlign: "center", borderRadius: "0.75rem" }}>Partner with us</Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}
