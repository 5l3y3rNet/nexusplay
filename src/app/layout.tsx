import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth";
import { Navbar } from "@/components/layout/navbar";
import { ConditionalFooter } from "@/components/layout/conditional-footer";

export const metadata: Metadata = {
  title: "NexusPlay — Premium Game Provider",
  description: "Professional crash and arcade games for licensed casino operators.",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          <main style={{ minHeight: "100vh" }}>{children}</main>
          <ConditionalFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
