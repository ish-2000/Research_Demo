"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/layout/HeroSection";
import { TextForensicsDashboard } from "@/components/text/TextForensicsDashboard";
import { VoiceForensicsDashboard } from "@/components/voice/VoiceForensicsDashboard";
import { InteractiveDemoPage } from "@/components/demo/InteractiveDemoPage";

type Tab = "text" | "voice" | "demo";

const PAGE = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const TECH_PILLS = ["DeBERTa-v3", "LlamaIndex ReAct", "AASIST", "WavLM-Large", "ESVAS", "SHAP", "Attention Rollout"];

export default function HomePage() {
  const [tab, setTab] = useState<Tab | null>(null);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "var(--bg-page)",
    }}>
      {tab && <Navbar active={tab} onTab={t => setTab(t)} />}

      <main style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          {!tab ? (
            <motion.div key="hero" variants={PAGE} initial="initial" animate="animate" exit="exit">
              {/* Subtle dot-grid hero background */}
              <div style={{ position: "relative" }}>
                <div className="dot-grid" style={{ position: "absolute", inset: 0, opacity: 1, pointerEvents: "none", zIndex: 0 }} />
                <div className="page-container" style={{ position: "relative", zIndex: 1 }}>
                  <HeroSection onStart={() => setTab("text")} />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key={tab} variants={PAGE} initial="initial" animate="animate" exit="exit">
              <div className="page-container" style={{ paddingTop: 40, paddingBottom: 64 }}>
                {tab === "text"  && <TextForensicsDashboard />}
                {tab === "voice" && <VoiceForensicsDashboard />}
                {tab === "demo"  && <InteractiveDemoPage />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {tab && (
        <footer style={{
          borderTop: "1px solid var(--border)",
          padding: "20px 0",
          background: "var(--bg-page)",
        }}>
          <div className="page-container" style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 12,
          }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
              VeriSynth Multi-Modal Forensic Lab · Research Prototype v2.1.0-α
            </span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {TECH_PILLS.map(t => (
                <span key={t} className="mono" style={{
                  fontSize: 10, padding: "3px 9px", borderRadius: 6,
                  background: "var(--accent-light)", border: "1px solid var(--border)",
                  color: "var(--accent)", letterSpacing: "0.02em",
                }}>{t}</span>
              ))}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
