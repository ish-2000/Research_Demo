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
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const TECH_PILLS = ["DeBERTa-v3", "LlamaIndex ReAct", "AASIST", "WavLM-Large", "ESVAS", "SHAP", "Attention Rollout"];

export default function HomePage() {
  const [tab, setTab] = useState<Tab | null>(null);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {tab && <Navbar active={tab} onTab={t => setTab(t)} />}

      <main style={{ flex: 1 }}>
        <AnimatePresence mode="wait">
          {!tab ? (
            <motion.div key="hero" variants={PAGE} initial="initial" animate="animate" exit="exit">
              <div className="page-container">
                <HeroSection onStart={() => setTab("text")} />
              </div>
            </motion.div>
          ) : (
            <motion.div key={tab} variants={PAGE} initial="initial" animate="animate" exit="exit">
              <div className="page-container" style={{ paddingTop: 36, paddingBottom: 60 }}>
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
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "20px 0",
        }}>
          <div className="page-container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
              VeriSynth Multi-Modal Forensic Lab · Research Prototype v2.1.0-α
            </span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {TECH_PILLS.map(t => (
                <span key={t} className="mono" style={{ fontSize: 10, padding: "3px 8px", borderRadius: 5, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "var(--text-muted)" }}>{t}</span>
              ))}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
