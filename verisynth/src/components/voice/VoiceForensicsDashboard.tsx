"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart2, Waves, Radio, Mic, Layers, Activity, Brain, ChevronDown, ChevronUp } from "lucide-react";

const BRANCHES = [
  {
    id: "spectral", label: "Spectral Analysis", subtitle: "LFCC + TCN",
    Icon: BarChart2, accent: "var(--accent)", iconBg: "var(--accent-light)",
    score: 91.4,
    features: ["LFCC Coefficients: 40D", "TCN Depth: 8 layers", "Receptive Field: 4096ms"],
    verdict: "SYNTHETIC",
  },
  {
    id: "spectrotemporal", label: "Spectro-Temporal", subtitle: "AASIST Graph",
    Icon: Waves, accent: "#22C55E", iconBg: "#F0FDF4",
    score: 88.7,
    features: ["RawGAT-ST Layer", "Spectral Graph: 23 nodes", "Temporal Graph: 17 nodes"],
    verdict: "SYNTHETIC",
  },
  {
    id: "temporal", label: "Temporal Modeling", subtitle: "WavLM / XLSR-53",
    Icon: Radio, accent: "#7C3AED", iconBg: "#EDE9FF",
    score: 94.2,
    features: ["WavLM-Large 94 layers", "Fine-tuned: ASVspoof5", "Frame Shift: 20ms"],
    verdict: "SYNTHETIC",
  },
  {
    id: "physiological", label: "Physiological", subtitle: "Glottal Source Analysis",
    Icon: Mic, accent: "#D97706", iconBg: "#FFFBEB",
    score: 85.6,
    features: ["GCI Detection: SEDREAMS", "HNR Ratio: −4.2 dB", "Jitter: 8.3%"],
    verdict: "SYNTHETIC",
  },
];

const FUSION_WEIGHTS = [
  { label: "Spectral (LFCC+TCN)",       weight: 0.28, color: "var(--accent)" },
  { label: "Spectro-Temporal (AASIST)", weight: 0.24, color: "#22C55E" },
  { label: "Temporal (WavLM)",          weight: 0.31, color: "#7C3AED" },
  { label: "Physiological (GSA)",       weight: 0.17, color: "#D97706" },
];

const SHAP_FEATURES = [
  { name: "Jitter (local)",          impact: +0.34, positive: true },
  { name: "Glottal Closure Irreg.",  impact: +0.28, positive: true },
  { name: "Shimmer (APQ11)",         impact: +0.22, positive: true },
  { name: "HNR Ratio",               impact: +0.18, positive: true },
  { name: "LFCC-Δ Coefficient",      impact: +0.15, positive: true },
  { name: "F0 Tremor Rate",          impact: -0.09, positive: false },
  { name: "Breathiness Index",       impact: -0.12, positive: false },
  { name: "Spectral Flux",           impact: +0.11, positive: true },
];

const WAVEFORM = Array.from({ length: 80 }, (_, i) => ({
  h: Math.random() * 0.65 + 0.1,
  suspicious: (i >= 18 && i <= 33) || (i >= 54 && i <= 68),
}));

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
});

// ── Branch Card ──────────────────────────────────────────────────────────────
function BranchCard({ b, delay }: { b: typeof BRANCHES[0]; delay: number }) {
  const [open, setOpen] = useState(false);
  const { Icon } = b;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass glass-hover"
      style={{ padding: 20, cursor: "default" }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: b.iconBg,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Icon size={15} color={b.accent} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>{b.label}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{b.subtitle}</div>
          </div>
        </div>
        <span style={{
          display: "inline-flex", alignItems: "center",
          padding: "3px 10px", borderRadius: 999, fontSize: 10, fontWeight: 700,
          background: "#FEF2F2", color: "#DC2626",
          border: "1px solid rgba(239,68,68,0.25)",
          fontFamily: "var(--font-body)",
        }}>{b.verdict}</span>
      </div>

      {/* Score ring + bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        {/* Ring */}
        <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
          <svg viewBox="0 0 100 100" style={{ width: 52, height: 52, transform: "rotate(-90deg)" }}>
            <circle cx="50" cy="50" r="38" fill="none" stroke="var(--border)" strokeWidth="14" />
            <motion.circle
              cx="50" cy="50" r="38" fill="none"
              stroke={b.accent} strokeWidth="14" strokeLinecap="round"
              strokeDasharray="238.8"
              initial={{ strokeDashoffset: 238.8 }}
              animate={{ strokeDashoffset: 238.8 * (1 - b.score / 100) }}
              transition={{ duration: 1.2, delay: delay + 0.2, ease: "easeOut" }}
            />
          </svg>
          <div className="mono" style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 800, color: b.accent,
          }}>{Math.round(b.score)}</div>
        </div>
        {/* Bar */}
        <div style={{ flex: 1 }}>
          <div className="progress-track">
            <motion.div
              className="progress-fill"
              style={{ background: b.accent }}
              initial={{ width: 0 }}
              animate={{ width: `${b.score}%` }}
              transition={{ duration: 1, delay: delay + 0.3, ease: "easeOut" }}
            />
          </div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 5 }}>
            Confidence: {b.score.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Toggle features */}
      <button
        onClick={() => setOpen(o => !o)}
        className="btn-ghost"
        style={{ width: "100%", justifyContent: "center", fontSize: 11, padding: "6px 12px" }}
      >
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {open ? "Hide" : "Show"} Features
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{
              paddingTop: 12, display: "flex", flexDirection: "column", gap: 5,
              borderTop: "1px solid var(--border)", marginTop: 12,
            }}>
              {b.features.map(f => (
                <div key={f} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: 11, color: "var(--text-secondary)",
                }}>
                  <span style={{ color: b.accent, fontSize: 7 }}>◆</span>
                  {f}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Adaptive Fusion ──────────────────────────────────────────────────────────
function FusionPanel() {
  return (
    <div className="glass" style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: "var(--accent-light)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Layers size={16} color="var(--accent)" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
              Adaptive Fusion
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              Attention-Based Weight Combination
            </div>
          </div>
        </div>
        <div className="mono gradient-text-violet" style={{ fontSize: 28, fontWeight: 900 }}>90.2%</div>
      </div>

      {/* Weight bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
        {FUSION_WEIGHTS.map((fw, i) => (
          <div key={fw.label}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: fw.color, flexShrink: 0 }} />
                <span style={{ color: "var(--text-secondary)" }}>{fw.label}</span>
              </div>
              <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
                {(fw.weight * 100).toFixed(0)}%
              </span>
            </div>
            <div className="progress-track">
              <motion.div
                className="progress-fill"
                style={{ background: fw.color }}
                initial={{ width: 0 }}
                animate={{ width: `${fw.weight * 100}%` }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Verdict */}
      <div style={{
        background: "#FEF2F2",
        border: "1px solid rgba(239,68,68,0.25)",
        borderRadius: 12, padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <div style={{
          width: 10, height: 10, borderRadius: "50%",
          background: "var(--error)", flexShrink: 0,
          animation: "pulse-ring 1.5s ease-out infinite",
        }} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#DC2626", fontFamily: "var(--font-heading)" }}>
            SYNTHETIC VOICE DETECTED
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
            Fused Confidence: 90.2% | Threshold: 70%
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Waveform Panel ───────────────────────────────────────────────────────────
function WaveformPanel() {
  return (
    <div className="glass" style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: "#F0FDF4",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Activity size={16} color="#22C55E" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
              Temporal Localization
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              ESVAS — Attention Rollout Highlighting
            </div>
          </div>
        </div>
        <span className="badge badge-emerald">Silva Method</span>
      </div>

      {/* Waveform */}
      <div style={{
        background: "var(--bg-surface)",
        borderRadius: 12, padding: "16px 16px 12px",
        border: "1px solid var(--border)", marginBottom: 12,
      }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 72 }}>
          {WAVEFORM.map((seg, i) => (
            <motion.div
              key={i}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.006, duration: 0.25 }}
              style={{
                flex: 1, borderRadius: 3,
                height: `${seg.h * 100}%`,
                background: seg.suspicious
                  ? "linear-gradient(to top, var(--error), #F97316)"
                  : "var(--accent)",
                opacity: seg.suspicious ? 0.85 : 0.4,
                transformOrigin: "bottom",
                minWidth: 2,
                /* violet glow on suspicious segments */
                boxShadow: seg.suspicious
                  ? "0 0 12px rgba(239,68,68,0.4)"
                  : "none",
              }}
            />
          ))}
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between",
          marginTop: 8, fontSize: 9,
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
        }}>
          {["0.0s", "1.0s", "2.0s", "3.0s", "4.0s"].map(t => <span key={t}>{t}</span>)}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 20, fontSize: 11, color: "var(--text-muted)", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 8, borderRadius: 3, background: "linear-gradient(to right, var(--error), #F97316)" }} />
          Suspicious Segments
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 8, borderRadius: 3, background: "rgba(140,82,255,0.4)" }} />
          Normal Audio
        </div>
      </div>

      <div style={{
        background: "#FEF2F2",
        border: "1px solid rgba(239,68,68,0.2)",
        borderRadius: 10, padding: "10px 14px",
        fontSize: 12, color: "var(--text-secondary)",
      }}>
        ⚠ Suspicious at{" "}
        <span style={{ color: "var(--error)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>1.0–1.75s</span>
        {" "}and{" "}
        <span style={{ color: "var(--error)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>2.75–3.4s</span>
        {" "}— GAN artifact pattern detected
      </div>
    </div>
  );
}

// ── SHAP Panel ───────────────────────────────────────────────────────────────
function SHAPPanel() {
  const maxImpact = Math.max(...SHAP_FEATURES.map(f => Math.abs(f.impact)));

  return (
    <div className="glass" style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: "var(--accent-light)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Brain size={16} color="var(--accent)" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
              SHAP Waterfall Plot
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              Semantic Attribution — Acoustic Features
            </div>
          </div>
        </div>
        <span className="badge badge-violet">ESVAS Explainability</span>
      </div>

      {/* Base/output */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginBottom: 16, padding: "0 2px" }}>
        <span>E[f(x)] = <span className="mono" style={{ color: "var(--text-primary)" }}>0.50</span> (base)</span>
        <span>f(x) = <span className="mono" style={{ color: "var(--error)", fontWeight: 700 }}>0.902</span></span>
      </div>

      {/* Dashed baseline */}
      <div style={{ position: "relative", marginBottom: 8 }}>
        <div style={{
          position: "absolute", left: 152, right: 0, top: 0,
          height: 1, borderTop: "2px dashed var(--text-muted)",
          opacity: 0.4,
        }} />
      </div>

      {/* SHAP bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {SHAP_FEATURES.map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <div style={{ width: 148, fontSize: 11, color: "var(--text-secondary)", textAlign: "right", flexShrink: 0, lineHeight: 1.3 }}>
              {f.name}
            </div>
            <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(Math.abs(f.impact) / maxImpact) * 100}%` }}
                transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: 28, borderRadius: "0 8px 8px 0",
                  display: "flex", alignItems: "center", padding: "0 10px",
                  background: f.positive
                    ? "var(--accent)"
                    : "var(--accent-light)",
                  border: f.positive ? "none" : "1px solid var(--border)",
                  minWidth: 48,
                }}
              >
                <span className="mono" style={{
                  fontSize: 10, fontWeight: 700,
                  color: f.positive ? "#fff" : "var(--text-secondary)",
                  whiteSpace: "nowrap",
                }}>
                  {f.positive ? "+" : ""}{f.impact.toFixed(2)}
                </span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div style={{
        display: "flex", gap: 24, marginTop: 20,
        fontSize: 11, color: "var(--text-muted)",
        borderTop: "1px solid var(--border)", paddingTop: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 14, height: 8, borderRadius: 4, background: "var(--accent)" }} />
          Pushes toward SYNTHETIC
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 14, height: 8, borderRadius: 4, background: "var(--accent-light)", border: "1px solid var(--border)" }} />
          Pushes toward HUMAN
        </div>
      </div>
    </div>
  );
}

// ── Main Export ──────────────────────────────────────────────────────────────
export function VoiceForensicsDashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Header */}
      <motion.div {...fadeUp()} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div className="section-label" style={{ marginBottom: 6 }}>Voice Forensics Module</div>
          <h1 style={{
            fontSize: 30, fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            fontFamily: "var(--font-heading)",
          }}>
            Analysis{" "}
            <span className="gradient-text-violet">Engine</span>
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
            Member 3 (Wijesundara) · Member 4 (Silva) — AASIST + WavLM + ESVAS Explainability
          </p>
        </div>
        <span className="badge badge-emerald" style={{
          flexShrink: 0, alignSelf: "flex-start", marginTop: 4,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span className="pulse-dot" style={{ background: "#22C55E", color: "#22C55E" }} />
          Active Pipeline
        </span>
      </motion.div>

      {/* 4-branch grid */}
      <div>
        <div className="section-label">
          <Radio size={11} color="var(--accent)" />
          Multi-Branch Parallel Analysis — Wijesundara Architecture
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {BRANCHES.map((b, i) => <BranchCard key={b.id} b={b} delay={i * 0.08} />)}
        </div>
      </div>

      {/* Fusion + Waveform */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <motion.div {...fadeUp(0.3)}>
          <FusionPanel />
        </motion.div>
        <motion.div {...fadeUp(0.35)}>
          <WaveformPanel />
        </motion.div>
      </div>

      {/* SHAP */}
      <motion.div {...fadeUp(0.4)}>
        <SHAPPanel />
      </motion.div>
    </div>
  );
}
