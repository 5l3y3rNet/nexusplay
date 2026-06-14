"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FaqItem { q: string; a: string; }

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} style={{ background: "#0f1424", border: `1px solid ${isOpen ? "rgba(245,166,35,0.3)" : "#1e2740"}`, borderRadius: "0.75rem", overflow: "hidden", transition: "border-color 0.15s" }}>
            <button onClick={() => setOpen(isOpen ? null : i)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: "1.125rem 1.25rem", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: "1rem", fontWeight: 600, color: "#fafafa" }}>{item.q}</span>
              <span style={{ flexShrink: 0, color: isOpen ? "#f5a623" : "#71717a" }}>{isOpen ? <Minus size={18} /> : <Plus size={18} />}</span>
            </button>
            {isOpen && (
              <div style={{ padding: "0 1.25rem 1.25rem", fontSize: "0.9375rem", color: "#a1a1aa", lineHeight: 1.7 }}>{item.a}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
