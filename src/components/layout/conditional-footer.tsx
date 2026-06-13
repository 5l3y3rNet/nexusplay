"use client";
import { usePathname } from "next/navigation";
import { Footer } from "./footer";

export function ConditionalFooter() {
  const p = usePathname();
  const hide = p.startsWith("/partner/dashboard") || p.startsWith("/admin") ||
    p === "/partner/login" || p === "/partner/register" || p === "/play";
  if (hide) return null;
  return <Footer />;
}
