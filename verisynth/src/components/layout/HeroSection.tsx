"use client";
import { motion } from "framer-motion";
import { Brain, Zap, Shield, Activity, FlaskConical, Mic } from "lucide-react";

const STATS = [
  { value: "96.3%", label: "Detection Accuracy",   sub: "DeBERTa-v3 ensemble" },
  { value: "90.2%", label: "Voice Confidence",      sub: "4-branch adaptive fusion" },
  { value: "84.7",  label: "AOPC Faithfulness",     sub: "Explanation quality metric" },
  { value: "<1.2s", label: "Processing Latency",    sub: "Per document inference" },
];

const MEMBERS = [
  { name: "Athapaththu", role: "Agentic Sanitization",     color: "#818cf8", border: "rgba(99,102,241,0.3)",   bg: "rgba(99,102,241,0.1)" },
  { name: "Fernando",    role: "Neural Interpretability",   color: "#c4b5fd", border: "rgba(139,92,246,0.3)",  bg: "rgba(139,92,246,0.1)" },
  { name: "Wijesundara", role: "Multi-Branch Voice",        color: "#5eead4", border: "rgba(20,184,166,0.3)",  bg: "rgba(20,184,166,0.1)" },
  { name: "Silva",       role: "ESVAS Explainability",      color: "#fcd34d", border: "rgba(245,158,11,0.3)",  bg: "rgba(245,158,11,0.1)" },
];

const TECH_TAGS = ["DeBERTa-v3", "LlamaIndex ReAct", "AASIST", "WavLM-Large", "ESVAS", "SHAP", "IG × Attention Rollout"];

export function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <section style={{
      minHeight: "calc(100vh - 0px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 0 60px",
      textAlign: "center",
      position: "relative",
    }}>
      {/* Dot-grid background */}
      <div className="dot-grid" style={{
        position: "absolute", inset: 0, opacity: 0.4, borderRadius: 24, pointerEvents: "none"
      }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 800, margin: "0 auto" }}>

        {/* Top badge */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          style={{ marginBottom: 32, display: "flex", justifyContent: "center" }}>
          <span className="badge badge-indigo" style={{ fontSize: 11, padding: "6px 14px" }}>
            <span className="pulse-dot" style={{ background: "#818cf8", color: "#818cf8" }} />
            Research Prototype — Multi-Modal Forensics
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ fontSize: "clamp(52px, 8vw, 88px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.0, marginBottom: 16, color: "#fff" }}>
          VeriSynth
          <br />
          <span className="gradient-text-indigo">Forensic Lab</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ fontSize: 20, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 10 }}>
          Turning &ldquo;What If&rdquo; into &ldquo;It&apos;s Live.&rdquo;
        </motion.p>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
          style={{ fontSize: 15, color: "var(--text-muted)", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.7 }}>
          An enterprise-grade AI forensics platform unifying text and voice authenticity verification
          through explainable deep learning and agentic orchestration.
        </motion.p>

        {/* CTA buttons */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
          style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 44 }}>
          <button id="hero-explore-text-btn" className="btn-primary" onClick={onStart}
            style={{ fontSize: 15, padding: "14px 28px" }}>
            <Brain size={16} />
            Explore Research Modules
          </button>
          <button className="btn-secondary" style={{ fontSize: 15, padding: "14px 28px" }}>
            <Zap size={16} />
            Live Demo
          </button>
        </motion.div>

        {/* Team members */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}
          style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}>
          {MEMBERS.map(m => (
            <span key={m.name} style={{
              padding: "6px 14px", borderRadius: 999,
              background: m.bg, border: `1px solid ${m.border}`,
              fontSize: 12, fontWeight: 500, color: m.color, letterSpacing: "0.01em",
            }}>
              {m.name} · <span style={{ opacity: 0.75 }}>{m.role}</span>
            </span>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12,
            marginBottom: 36,
          }}>
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 + i * 0.06 }}
                className="glass" style={{ padding: "20px 16px", textAlign: "center" }}>
                <div className="mono gradient-text-indigo" style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1, marginBottom: 6 }}>{s.value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech tags */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
          {TECH_TAGS.map(t => (
            <span key={t} className="mono" style={{
              fontSize: 10, padding: "4px 10px", borderRadius: 6,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
              color: "var(--text-muted)", letterSpacing: "0.03em",
            }}>{t}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
