"use client";
import { motion } from "framer-motion";
import { Shield, FlaskConical, Activity, Zap } from "lucide-react";

type Tab = "text" | "voice" | "demo";

const TABS: { id: Tab; label: string; Icon: typeof FlaskConical }[] = [
  { id: "text",  label: "Text Forensics",   Icon: FlaskConical },
  { id: "voice", label: "Voice Forensics",  Icon: Activity },
  { id: "demo",  label: "Interactive Demo", Icon: Zap },
];

export function Navbar({ active, onTab }: { active: Tab; onTab: (t: Tab) => void }) {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      borderBottom: "1px solid var(--border)",
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
    }}>
      <div className="page-container" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 64,
      }}>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
          style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(140,82,255,0.35)",
            flexShrink: 0,
          }}>
            <Shield size={18} color="#fff" />
          </div>
          <div>
            <div style={{
              fontWeight: 800, fontSize: 15,
              color: "var(--accent)",
              letterSpacing: "-0.02em", lineHeight: 1,
              fontFamily: "var(--font-heading)",
            }}>VeriSynth</div>
            <div style={{
              fontWeight: 500, fontSize: 9,
              color: "var(--text-muted)",
              letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 2,
              fontFamily: "var(--font-body)",
            }}>Forensic Lab</div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.nav
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          style={{
            display: "flex", gap: 4, padding: 4,
            borderRadius: 14,
            border: "1px solid var(--border)",
            background: "var(--bg-surface)",
          }}
        >
          {TABS.map(({ id, label, Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                id={`nav-tab-${id}`}
                onClick={() => onTab(id)}
                style={{
                  position: "relative", display: "flex", alignItems: "center", gap: 7,
                  padding: "8px 16px", borderRadius: 10,
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  color: isActive ? "var(--accent)" : "var(--text-secondary)",
                  background: "transparent", border: "none",
                  transition: "color 0.2s", fontFamily: "var(--font-body)",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)"; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"; }}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    style={{
                      position: "absolute", inset: 0, borderRadius: 10,
                      background: "var(--accent-light)",
                    }}
                  />
                )}
                <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center" }}>
                  <Icon size={13} />
                </span>
                <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
              </button>
            );
          })}
        </motion.nav>

        {/* Right — status badge */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12 }}
          style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}
        >
          <span className="badge badge-emerald" style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span className="pulse-dot" style={{ background: "#22C55E", color: "#22C55E", width: 6, height: 6 }} />
            Live Build
          </span>
          <span className="mono" style={{ fontSize: 10, color: "var(--text-muted)" }}>v2.1.0-α</span>
        </motion.div>

      </div>
    </header>
  );
}
