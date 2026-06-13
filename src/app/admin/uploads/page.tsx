"use client";
import { useState, useRef } from "react";
import { Menu, CloudUpload, CheckCircle2, File } from "lucide-react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

const existing = [
  { name:"ELEVATOR", file:"Elevator.html", size:"124 KB", uploaded:"2024-11-15" },
  { name:"DEEP HOOK", file:"Hook.html", size:"98 KB", uploaded:"2024-11-15" },
  { name:"XENOCRAFT", file:"alien-enchant.html", size:"156 KB", uploaded:"2024-11-12" },
  { name:"Bunny Job", file:"bell-jump.html", size:"210 KB", uploaded:"2024-11-15" },
  { name:"Bomb Defusal", file:"bomb-defusal.html", size:"88 KB", uploaded:"2024-11-15" },
  { name:"CHIP DROP", file:"chip_drop_v3.html", size:"143 KB", uploaded:"2024-11-15" },
  { name:"DAREDEVIL DROP", file:"daredevil_drop.html", size:"167 KB", uploaded:"2024-12-01" },
  { name:"Glass Rush", file:"game_squid.html", size:"119 KB", uploaded:"2024-11-15" },
  { name:"MULTIPLIER RUSH", file:"multiplier-rush.html", size:"76 KB", uploaded:"2024-11-15" },
  { name:"TRAIN", file:"train.html", size:"201 KB", uploaded:"2024-11-28" },
];

export default function UploadsPage() {
  const [mob, setMob] = useState(false);
  const [drag, setDrag] = useState(false);
  const [queue, setQueue] = useState<{name:string; size:string; status:string}[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const arr = Array.from(files).map(f => ({ name: f.name, size: `${Math.round(f.size/1024)} KB`, status: "processing" }));
    setQueue(q => [...q, ...arr]);
    setTimeout(() => setQueue(q => q.map(f => f.status === "processing" ? { ...f, status: "ready" } : f)), 2000);
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#09090b", overflow: "hidden" }}>
      <div className="hidden lg:block" style={{ width: "14rem", flexShrink: 0 }}><AdminSidebar /></div>
      {mob && <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}><div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} onClick={() => setMob(false)} /><div style={{ position: "relative", width: "14rem", height: "100%" }}><AdminSidebar onClose={() => setMob(false)} /></div></div>}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{ height: "4rem", borderBottom: "1px solid #27272a", display: "flex", alignItems: "center", gap: "0.75rem", padding: "0 1.5rem", flexShrink: 0 }}>
          <button onClick={() => setMob(true)} className="lg:hidden" style={{ background: "none", border: "none", cursor: "pointer", color: "#71717a" }}><Menu size={18} /></button>
          <h2 style={{ fontWeight: 600, color: "#fafafa", fontSize: "0.875rem" }}>Upload Management</h2>
        </header>
        <main style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          <div
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
            onClick={() => inputRef.current?.click()}
            style={{ border: `2px dashed ${drag ? "#71717a" : "#27272a"}`, borderRadius: "0.75rem", padding: "3rem", textAlign: "center", cursor: "pointer", background: drag ? "#18181b" : "transparent", marginBottom: "1.5rem", transition: "all 0.15s" }}>
            <input ref={inputRef} type="file" accept=".html,.zip" multiple style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
            <CloudUpload size={32} style={{ color: "#52525b", margin: "0 auto 0.75rem" }} />
            <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "#d4d4d8", marginBottom: "0.375rem" }}>Drop game files here, or click to select</div>
            <div style={{ fontSize: "0.75rem", color: "#52525b" }}>Supports .html files or .zip archives</div>
          </div>

          {queue.length > 0 && (
            <div style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "0.75rem", overflow: "hidden", marginBottom: "1rem" }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #27272a" }}>
                <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fafafa" }}>Upload Queue</h3>
              </div>
              {queue.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1.25rem", borderBottom: "1px solid #27272a" }}>
                  <File size={14} style={{ color: "#52525b", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.875rem", color: "#d4d4d8", flex: 1 }}>{f.name}</span>
                  <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#71717a" }}>{f.size}</span>
                  {f.status === "processing"
                    ? <span style={{ fontSize: "0.75rem", color: "#facc15", fontFamily: "monospace" }}>Processing…</span>
                    : <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "#34d399", fontFamily: "monospace" }}><CheckCircle2 size={12} /> Ready</div>}
                </div>
              ))}
            </div>
          )}

          <div style={{ background: "#111113", border: "1px solid #27272a", borderRadius: "0.75rem", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid #27272a" }}>
              <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fafafa" }}>Ingested Games</h3>
              <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#52525b" }}>{existing.length} files</span>
            </div>
            {existing.map(g => (
              <div key={g.file} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1.25rem", borderBottom: "1px solid #27272a" }}>
                <CheckCircle2 size={13} style={{ color: "#34d399", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.875rem", color: "#d4d4d8" }}>{g.name}</div>
                  <div style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#52525b" }}>{g.file}</div>
                </div>
                <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "#71717a" }}>{g.size}</span>
                <span style={{ fontSize: "0.75rem", color: "#52525b" }}>{g.uploaded}</span>
                <span style={{ fontSize: "0.625rem", fontFamily: "monospace", background: "rgba(2,44,34,0.9)", color: "#34d399", border: "1px solid #064e3b", padding: "0.125rem 0.5rem", borderRadius: "0.25rem" }}>published</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
