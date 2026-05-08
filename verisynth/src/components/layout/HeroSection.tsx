"use client";
import { motion } from "framer-motion";
import { Brain, Zap, ArrowRight } from "lucide-react";

const STATS = [
  { value: "96.3%", label: "Detection Accuracy",  sub: "DeBERTa-v3 ensemble" },
  { value: "90.2%", label: "Voice Confidence",     sub: "4-branch adaptive fusion" },
  { value: "84.7",  label: "AOPC Faithfulness",    sub: "Explanation quality metric" },
  { value: "<1.2s", label: "Processing Latency",   sub: "Per document inference" },
];

const MEMBERS = [
  { name: "Athapaththu", role: "Agentic Sanitization" },
  { name: "Fernando",    role: "Neural Interpretability" },
  { name: "Wijesundara", role: "Multi-Branch Voice" },
  { name: "Silva",       role: "ESVAS Explainability" },
];

const TECH_TAGS = ["DeBERTa-v3", "LlamaIndex ReAct", "AASIST", "WavLM-Large", "ESVAS", "SHAP", "IG × Attention Rollout"];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { ease: [0.22, 1, 0.36, 1], duration: 0.55 } },
};

export function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <section style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "96px 0 72px",
      textAlign: "center",
      position: "relative",
    }}>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{ width: "100%", maxWidth: 820, margin: "0 auto" }}
      >
        {/* Research badge */}
        <motion.div variants={fadeUp} style={{ marginBottom: 28, display: "flex", justifyContent: "center" }}>
          <span className="badge badge-indigo" style={{ fontSize: 11, padding: "6px 16px", gap: 8 }}>
            <span className="pulse-dot" style={{ background: "var(--accent)", color: "var(--accent)" }} />
            Research Prototype — Multi-Modal Forensics
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          style={{
            fontSize: "clamp(52px, 8vw, 80px)",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            lineHeight: 1.0,
            marginBottom: 20,
            color: "var(--text-primary)",
            fontFamily: "var(--font-heading)",
          }}
        >
          VeriSynth
          <br />
          <span className="gradient-text-violet">Forensic Lab</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: 20, fontWeight: 600,
            color: "var(--text-secondary)",
            marginBottom: 10,
            fontFamily: "var(--font-heading)",
          }}
        >
          Turning &ldquo;What If&rdquo; into &ldquo;It&apos;s Live.&rdquo;
        </motion.p>
        <motion.p
          variants={fadeUp}
          style={{
            fontSize: 16, color: "var(--text-secondary)",
            maxWidth: 560, margin: "0 auto 40px",
            lineHeight: 1.8,
            fontFamily: "var(--font-body)",
          }}
        >
          An enterprise-grade AI forensics platform unifying text and voice authenticity
          verification through explainable deep learning and agentic orchestration.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={fadeUp}
          style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}
        >
          <button
            id="hero-explore-text-btn"
            className="btn-primary"
            onClick={onStart}
            style={{ fontSize: 15, padding: "14px 32px", gap: 10 }}
          >
            <Brain size={16} />
            Explore Research Modules
            <ArrowRight size={15} />
          </button>
          <button className="btn-secondary" style={{ fontSize: 15, padding: "14px 32px" }}>
            <Zap size={16} />
            Live Demo
          </button>
        </motion.div>

        {/* Team members */}
        <motion.div
          variants={fadeUp}
          style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}
        >
          {MEMBERS.map(m => (
            <span key={m.name} style={{
              padding: "6px 14px", borderRadius: 999,
              background: "var(--accent-light)",
              border: "1px solid var(--border)",
              fontSize: 12, fontWeight: 500,
              color: "var(--accent)",
              letterSpacing: "0.01em",
              fontFamily: "var(--font-body)",
            }}>
              {m.name} <span style={{ color: "var(--text-secondary)" }}>· {m.role}</span>
            </span>
          ))}
        </motion.div>

        {/* Stats grid */}
        <motion.div
          variants={container}
          style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 40 }}
        >
          {STATS.map(s => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              className="card"
              style={{ padding: "24px 16px", textAlign: "center", cursor: "default" }}
            >
              <div className="mono gradient-text-violet" style={{
                fontSize: 30, fontWeight: 900, lineHeight: 1.1, marginBottom: 8,
              }}>{s.value}</div>
              <div style={{
                fontSize: 13, fontWeight: 700,
                color: "var(--text-primary)", marginBottom: 4,
                fontFamily: "var(--font-heading)",
              }}>{s.label}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>{s.sub}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tech tags */}
        <motion.div
          variants={fadeUp}
          style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}
        >
          {TECH_TAGS.map(t => (
            <span key={t} className="mono" style={{
              fontSize: 10, padding: "4px 10px", borderRadius: 6,
              background: "var(--accent-light)",
              border: "1px solid var(--border)",
              color: "var(--accent)",
              letterSpacing: "0.03em",
            }}>{t}</span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
