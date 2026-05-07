"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart2, Waves, Radio, Mic, Layers, Activity, Brain, ChevronDown, ChevronUp } from "lucide-react";

const BRANCHES = [
  {
    id: "spectral", label: "Spectral Analysis", subtitle: "LFCC + TCN",
    Icon: BarChart2, accent: "#818cf8", badgeClass: "badge-indigo",
    score: 91.4, progressClass: "progress-indigo",
    features: ["LFCC Coefficients: 40D", "TCN Depth: 8 layers", "Receptive Field: 4096ms"],
    verdict: "SYNTHETIC",
  },
  {
    id: "spectrotemporal", label: "Spectro-Temporal", subtitle: "AASIST Graph",
    Icon: Waves, accent: "#5eead4", badgeClass: "badge-teal",
    score: 88.7, progressClass: "progress-teal",
    features: ["RawGAT-ST Layer", "Spectral Graph: 23 nodes", "Temporal Graph: 17 nodes"],
    verdict: "SYNTHETIC",
  },
  {
    id: "temporal", label: "Temporal Modeling", subtitle: "WavLM / XLSR-53",
    Icon: Radio, accent: "#c4b5fd", badgeClass: "badge-violet",
    score: 94.2, progressClass: "progress-violet",
    features: ["WavLM-Large 94 layers", "Fine-tuned: ASVspoof5", "Frame Shift: 20ms"],
    verdict: "SYNTHETIC",
  },
  {
    id: "physiological", label: "Physiological", subtitle: "Glottal Source Analysis",
    Icon: Mic, accent: "#fcd34d", badgeClass: "badge-amber",
    score: 85.6, progressClass: "progress-amber",
    features: ["GCI Detection: SEDREAMS", "HNR Ratio: −4.2 dB", "Jitter: 8.3%"],
    verdict: "SYNTHETIC",
  },
];

const FUSION_WEIGHTS = [
  { label: "Spectral (LFCC+TCN)",         weight: 0.28, color: "#818cf8", cls: "progress-indigo" },
  { label: "Spectro-Temporal (AASIST)",    weight: 0.24, color: "#5eead4", cls: "progress-teal" },
  { label: "Temporal (WavLM)",             weight: 0.31, color: "#c4b5fd", cls: "progress-violet" },
  { label: "Physiological (GSA)",          weight: 0.17, color: "#fcd34d", cls: "progress-amber" },
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

// ── Branch Card ──────────────────────────────────────────────────────────────
function BranchCard({ b, delay }: { b: typeof BRANCHES[0]; delay: number }) {
  const [open, setOpen] = useState(false);
  const { Icon } = b;
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="glass" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: `${b.accent}20` }}>
            <Icon size={15} color={b.accent} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{b.label}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{b.subtitle}</div>
          </div>
        </div>
        <span className={`badge ${b.badgeClass}`} style={{ fontSize: 10 }}>{b.verdict}</span>
      </div>

      {/* Score ring + bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
          <svg viewBox="0 0 100 100" style={{ width: 52, height: 52, transform: "rotate(-90deg)" }}>
            <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
            <motion.circle cx="50" cy="50" r="38" fill="none" stroke={b.accent} strokeWidth="14" strokeLinecap="round"
              strokeDasharray="238.8"
              initial={{ strokeDashoffset: 238.8 }}
              animate={{ strokeDashoffset: 238.8 * (1 - b.score / 100) }}
              transition={{ duration: 1.2, delay: delay + 0.2 }}
            />
          </svg>
          <div className="mono" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>{Math.round(b.score)}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div className="progress-track">
            <motion.div className={`progress-fill ${b.progressClass}`} initial={{ width: 0 }} animate={{ width: `${b.score}%` }} transition={{ duration: 1, delay: delay + 0.3 }} />
          </div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 5 }}>Confidence: {b.score.toFixed(1)}%</div>
        </div>
      </div>

      {/* Expand */}
      <button onClick={() => setOpen(o => !o)} className="btn-ghost" style={{ width: "100%", justifyContent: "center", fontSize: 11, padding: "6px 12px" }}>
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        {open ? "Hide" : "Show"} Features
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden" }}>
            <div style={{ paddingTop: 12, display: "flex", flexDirection: "column", gap: 5, borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 12 }}>
              {b.features.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-secondary)" }}>
                  <span style={{ color: b.accent, fontSize: 8 }}>◆</span> {f}
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Layers size={16} color="#818cf8" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Adaptive Fusion</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Attention-Based Weight Combination</div>
          </div>
        </div>
        <div className="mono gradient-text-indigo" style={{ fontSize: 28, fontWeight: 900 }}>90.2%</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
        {FUSION_WEIGHTS.map((fw, i) => (
          <div key={fw.label}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: fw.color, flexShrink: 0 }} />
                <span style={{ color: "var(--text-secondary)" }}>{fw.label}</span>
              </div>
              <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{(fw.weight * 100).toFixed(0)}%</span>
            </div>
            <div className="progress-track">
              <motion.div className={`progress-fill ${fw.cls}`} initial={{ width: 0 }} animate={{ width: `${fw.weight * 100}%` }} transition={{ duration: 0.9, delay: i * 0.1 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Verdict */}
      <div style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.25)", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f43f5e", animation: "pulse-ring 1.5s ease-out infinite", flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#fda4af" }}>SYNTHETIC VOICE DETECTED</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Fused Confidence: 90.2% | Threshold: 70%</div>
        </div>
      </div>
    </div>
  );
}

// ── Waveform Panel ───────────────────────────────────────────────────────────
function WaveformPanel() {
  return (
    <div className="glass" style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(20,184,166,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Activity size={16} color="#5eead4" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Temporal Localization</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>ESVAS — Attention Rollout Highlighting</div>
          </div>
        </div>
        <span className="badge badge-teal">Silva Method</span>
      </div>

      {/* Waveform */}
      <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: 12, padding: "16px 16px 12px", border: "1px solid rgba(255,255,255,0.05)", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 72 }}>
          {WAVEFORM.map((seg, i) => (
            <motion.div key={i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.006, duration: 0.25 }}
              style={{
                flex: 1, borderRadius: 3,
                height: `${seg.h * 100}%`,
                background: seg.suspicious
                  ? "linear-gradient(to top, #f43f5e, #f97316)"
                  : "rgba(99,102,241,0.35)",
                transformOrigin: "bottom",
                minWidth: 2,
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 9, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          {["0.0s", "1.0s", "2.0s", "3.0s", "4.0s"].map(t => <span key={t}>{t}</span>)}
        </div>
      </div>

      <div style={{ display: "flex", gap: 20, fontSize: 11, color: "var(--text-muted)", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 8, borderRadius: 3, background: "linear-gradient(to right, #f43f5e, #f97316)" }} />
          Suspicious Segments (Attention Rollout)
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 8, borderRadius: 3, background: "rgba(99,102,241,0.5)" }} />
          Normal Audio
        </div>
      </div>

      <div style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "var(--text-secondary)" }}>
        ⚠ Suspicious at{" "}
        <span style={{ color: "#fda4af", fontFamily: "var(--font-mono)", fontWeight: 600 }}>1.0–1.75s</span>
        {" "}and{" "}
        <span style={{ color: "#fda4af", fontFamily: "var(--font-mono)", fontWeight: 600 }}>2.75–3.4s</span>
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(139,92,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Brain size={16} color="#c4b5fd" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>SHAP Waterfall Plot</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Semantic Attribution — Acoustic Features</div>
          </div>
        </div>
        <span className="badge badge-violet">ESVAS Explainability</span>
      </div>

      {/* Base/output values */}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text-muted)", marginBottom: 16, padding: "0 2px" }}>
        <span>E[f(x)] = <span className="mono" style={{ color: "#fff" }}>0.50</span> (base)</span>
        <span>f(x) = <span className="mono" style={{ color: "#f43f5e", fontWeight: 700 }}>0.902</span></span>
      </div>

      {/* SHAP bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {SHAP_FEATURES.map((f, i) => (
          <motion.div key={f.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
            style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 140, fontSize: 11, color: "var(--text-secondary)", textAlign: "right", flexShrink: 0, lineHeight: 1.3 }}>{f.name}</div>
            <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${(Math.abs(f.impact) / maxImpact) * 100}%` }}
                transition={{ duration: 0.9, delay: i * 0.06 }}
                style={{
                  height: 28, borderRadius: "0 8px 8px 0", display: "flex", alignItems: "center", padding: "0 10px",
                  background: f.positive
                    ? "linear-gradient(90deg, rgba(244,63,94,0.7), rgba(244,63,94,0.9))"
                    : "linear-gradient(90deg, rgba(20,184,166,0.7), rgba(20,184,166,0.9))",
                  minWidth: 48,
                }}>
                <span className="mono" style={{ fontSize: 10, color: "#fff", fontWeight: 700, whiteSpace: "nowrap" }}>
                  {f.positive ? "+" : ""}{f.impact.toFixed(2)}
                </span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 24, marginTop: 18, fontSize: 11, color: "var(--text-muted)", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 14, height: 8, borderRadius: 4, background: "rgba(244,63,94,0.7)" }} />
          Pushes toward SYNTHETIC
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 14, height: 8, borderRadius: 4, background: "rgba(20,184,166,0.7)" }} />
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
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
            Voice Forensics{" "}
            <span className="gradient-text-violet">Analysis Engine</span>
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
            Member 3 (Wijesundara) · Member 4 (Silva) — AASIST + WavLM + ESVAS Explainability
          </p>
        </div>
        <span className="badge badge-teal" style={{ flexShrink: 0, alignSelf: "flex-start", marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
          <span className="pulse-dot" style={{ background: "#5eead4", color: "#5eead4" }} />
          Active Pipeline
        </span>
      </motion.div>

      {/* 4-branch grid */}
      <div>
        <div className="section-label">
          <Radio size={11} color="#5eead4" />
          Multi-Branch Parallel Analysis — Wijesundara Architecture
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {BRANCHES.map((b, i) => <BranchCard key={b.id} b={b} delay={i * 0.08} />)}
        </div>
      </div>

      {/* Fusion + Waveform */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <FusionPanel />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <WaveformPanel />
        </motion.div>
      </div>

      {/* SHAP */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <SHAPPanel />
      </motion.div>
    </div>
  );
}
