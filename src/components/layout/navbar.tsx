"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Zap, LayoutDashboard, Shield } from "lucide-react";
import { useAuth } from "@/contexts/auth";

const navLinks = [
  { href: "/games", label: "Games" },
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);

  const hide =
    pathname.startsWith("/partner/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname === "/partner/login" ||
    pathname === "/partner/register" ||
    pathname === "/play";
  if (hide) return null;

  const isAdmin = user?.role === "admin";
  const dashHref = isAdmin ? "/admin/dashboard" : "/partner/dashboard";

  return (
    <>
      <style>{`
        .nav-desktop { display: none; }
        .nav-mobile-btn { display: flex; }
        @media (min-width: 768px) {
          .nav-desktop { display: flex; }
          .nav-mobile-btn { display: none; }
        }
      `}</style>
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, borderBottom: "1px solid rgba(39,39,42,0.7)", background: "rgba(9,9,11,0.92)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "4rem" }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none", flexShrink: 0 }}>
              <div style={{ width: "1.875rem", height: "1.875rem", background: "#fafafa", borderRadius: "0.375rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Zap size={15} style={{ color: "#09090b", fill: "#09090b" }} />
              </div>
              <span style={{ fontWeight: 700, color: "#fafafa", fontSize: "1rem", letterSpacing: "-0.01em" }}>NexusPlay</span>
            </Link>

            <nav className="nav-desktop" style={{ alignItems: "center", gap: "0.25rem" }}>
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} style={{ padding: "0.375rem 0.75rem", fontSize: "0.9375rem", borderRadius: "0.375rem", textDecoration: "none", color: pathname.startsWith(link.href) ? "#fafafa" : "#71717a", background: pathname.startsWith(link.href) ? "#27272a" : "transparent" }}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="nav-desktop" style={{ alignItems: "center", gap: "0.75rem" }}>
              {loading ? (
                <div style={{ width: "8rem", height: "2rem" }} />
              ) : user ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "#a1a1aa" }}>
                    {isAdmin && <Shield size={14} style={{ color: "#f87171" }} />}
                    <span style={{ maxWidth: "10rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.company}</span>
                  </div>
                  <Link href={dashHref} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#fafafa", color: "#09090b", fontSize: "0.9375rem", fontWeight: 700, padding: "0.5rem 1.125rem", borderRadius: "0.5rem", textDecoration: "none" }}>
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/partner/login" style={{ fontSize: "0.9375rem", color: "#71717a", textDecoration: "none" }}>Sign in</Link>
                  <Link href="/partner/register" style={{ display: "inline-flex", alignItems: "center", background: "#fafafa", color: "#09090b", fontSize: "0.9375rem", fontWeight: 700, padding: "0.5rem 1.125rem", borderRadius: "0.5rem", textDecoration: "none" }}>Partner Portal</Link>
                </>
              )}
            </div>

            <button className="nav-mobile-btn" onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", color: "#a1a1aa", padding: "0.375rem", alignItems: "center", justifyContent: "center" }}>
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {open && (
          <div style={{ background: "#09090b", borderTop: "1px solid #27272a", padding: "1rem 1.25rem 1.5rem" }}>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem", marginBottom: "1rem" }}>
              {navLinks.map(link => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} style={{ display: "block", padding: "0.875rem 1rem", fontSize: "1.0625rem", fontWeight: 500, color: pathname.startsWith(link.href) ? "#fafafa" : "#a1a1aa", textDecoration: "none", borderRadius: "0.5rem", background: pathname.startsWith(link.href) ? "#18181b" : "transparent" }}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <div style={{ borderTop: "1px solid #27272a", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {user ? (
                <>
                  <div style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", color: "#71717a" }}>Signed in as {user.company}</div>
                  <Link href={dashHref} onClick={() => setOpen(false)} style={{ display: "block", padding: "0.875rem", fontSize: "1.0625rem", fontWeight: 700, background: "#fafafa", color: "#09090b", textDecoration: "none", textAlign: "center", borderRadius: "0.5rem" }}>Dashboard</Link>
                </>
              ) : (
                <>
                  <Link href="/partner/login" onClick={() => setOpen(false)} style={{ display: "block", padding: "0.875rem", fontSize: "1.0625rem", color: "#a1a1aa", textDecoration: "none", textAlign: "center", borderRadius: "0.5rem", border: "1px solid #27272a" }}>Sign in</Link>
                  <Link href="/partner/register" onClick={() => setOpen(false)} style={{ display: "block", padding: "0.875rem", fontSize: "1.0625rem", fontWeight: 700, background: "#fafafa", color: "#09090b", textDecoration: "none", textAlign: "center", borderRadius: "0.5rem" }}>Partner Portal</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
