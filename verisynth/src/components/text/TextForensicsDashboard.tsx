"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Zap, Eye, FileText, AlertTriangle, TrendingUp, CheckCircle } from "lucide-react";

const SAMPLE_TEXT = `The algorithmic progression of artificial intelligence systems demonstrates a remarkable capacity for generating syntactically uniform prose. This systematic approach exhibits characteristic patterns of lexical distribution that deviate significantly from natural human writing styles. The uniformity of sentence structure and the consistent deployment of transitional phrases represent strong indicators of machine-generated content.`;

const SANITIZATION_STEPS = [
  { step: "Tokenizing input stream...",                         ms: 0 },
  { step: "Scanning for zero-width spaces (U+200B)...",        ms: 550 },
  { step: "Detecting homoglyph substitutions (Cyr↔Lat)...",   ms: 1100 },
  { step: "Normalizing Unicode codepoints...",                  ms: 1650 },
  { step: "Stripping invisible control characters...",          ms: 2200 },
  { step: "ReAct Agent: validating sanitized output...",        ms: 2750 },
  { step: "✓ Sanitization complete — 14 artifacts removed",    ms: 3300 },
];

const TOKEN_DATA = [
  { word: "The",           score: 0.08 },
  { word: "algorithmic",   score: 0.92 },
  { word: "progression",   score: 0.78 },
  { word: "of",            score: 0.10 },
  { word: "artificial",    score: 0.89 },
  { word: "intelligence",  score: 0.95 },
  { word: "systems",       score: 0.71 },
  { word: "demonstrates",  score: 0.65 },
  { word: "a",             score: 0.06 },
  { word: "remarkable",    score: 0.58 },
  { word: "capacity",      score: 0.74 },
  { word: "for",           score: 0.09 },
  { word: "generating",    score: 0.87 },
  { word: "syntactically", score: 0.96 },
  { word: "uniform",       score: 0.91 },
  { word: "prose",         score: 0.68 },
];

const AUDIT_FINDINGS = [
  { icon: AlertTriangle, label: "High Syntactic Uniformity",    detail: "Sentence length variance σ=2.1 (human avg: σ=8.4)", score: 94, accent: "var(--error)" },
  { icon: TrendingUp,    label: "Unnatural Lexical Distribution", detail: "Zipf's Law deviation: 0.37 (threshold: 0.15)", score: 82, accent: "var(--warning)" },
  { icon: AlertTriangle, label: "Zero-Width Space Homoglyphs",  detail: "14 invisible Unicode chars stripped by ReAct agent", score: 88, accent: "var(--error)" },
  { icon: AlertTriangle, label: "Perplexity Collapse Detected", detail: "GPT-2 perplexity: 23.4 (human baseline: 89.2)", score: 76, accent: "var(--warning)" },
  { icon: CheckCircle,   label: "No Emotional Arc Variance",    detail: "Sentiment remains flat across all paragraphs", score: 71, accent: "var(--success)" },
];

/** Map saliency score → violet intensity on white background */
function scoreToStyle(score: number): React.CSSProperties {
  const alpha = score * 0.9 + 0.08;
  return {
    background: `rgba(140,82,255,${(alpha * 0.22).toFixed(2)})`,
    color: score > 0.6 ? "var(--accent)" : "var(--text-secondary)",
    border: `1px solid rgba(140,82,255,${(alpha * 0.35).toFixed(2)})`,
  };
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
});

// ── Panel header helper ──────────────────────────────────────────────────────
function PanelHeader({
  icon, iconBg, title, subtitle, right,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  right?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 12,
          background: iconBg,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          {icon}
        </div>
        <div>
          <div style={{
            fontSize: 14, fontWeight: 700,
            color: "var(--text-primary)",
            fontFamily: "var(--font-heading)",
          }}>{title}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{subtitle}</div>
        </div>
      </div>
      {right}
    </div>
  );
}

// ── Sanitization Panel ──────────────────────────────────────────────────────
function SanitizationPanel() {
  const [running, setRunning] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const run = () => { setVisibleSteps([]); setDone(false); setRunning(true); };

  useEffect(() => {
    if (!running) return;
    const timers = SANITIZATION_STEPS.map((s, i) =>
      setTimeout(() => {
        setVisibleSteps(prev => [...prev, i]);
        if (i === SANITIZATION_STEPS.length - 1) { setDone(true); setRunning(false); }
      }, s.ms)
    );
    return () => timers.forEach(clearTimeout);
  }, [running]);

  return (
    <div className="glass" style={{ padding: 24, height: "100%" }}>
      <PanelHeader
        icon={<Cpu size={16} color="var(--accent)" />}
        iconBg="var(--accent-light)"
        title="Agentic Sanitization"
        subtitle="LlamaIndex ReAct Agent"
        right={
          <span className={`badge ${done ? "badge-emerald" : "badge-indigo"}`}>
            {done ? "✓ Sanitized" : running ? "Processing..." : "Ready"}
          </span>
        }
      />

      {/* Terminal — clean card style */}
      <div style={{
        background: "var(--bg-surface)",
        borderRadius: 12, padding: 16,
        minHeight: 160, marginBottom: 16,
        position: "relative", overflow: "hidden",
        border: "1px solid var(--border)",
        fontFamily: "var(--font-mono)", fontSize: 12,
      }}>
        {running && <div className="scan-line" />}
        {!running && !done && (
          <div style={{ color: "var(--text-muted)", fontStyle: "italic" }}>Click &quot;Run Agent&quot; to begin sanitization...</div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {visibleSteps.map(i => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              style={{
                display: "flex", alignItems: "flex-start", gap: 8,
                color: SANITIZATION_STEPS[i].step.startsWith("✓")
                  ? "var(--success)"
                  : "var(--text-secondary)",
              }}
            >
              <span style={{ color: "var(--accent)", flexShrink: 0 }}>›</span>
              <span>{SANITIZATION_STEPS[i].step}</span>
              {i === Math.max(...visibleSteps) && running && (
                <span className="cursor-blink" style={{ color: "var(--accent)" }}>_</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats after done */}
      {done && (
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 }}
        >
          {[["14", "Artifacts Removed"], ["100%", "Unicode Normalized"], ["0", "Residuals"]].map(([v, l]) => (
            <div key={l} style={{
              background: "var(--accent-light)", borderRadius: 12, padding: "12px 8px",
              textAlign: "center", border: "1px solid var(--border)",
            }}>
              <div className="mono gradient-text-violet" style={{ fontSize: 20, fontWeight: 800 }}>{v}</div>
              <div style={{ fontSize: 10, color: "var(--text-secondary)", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </motion.div>
      )}

      <button
        id="run-sanitization-btn"
        className="btn-primary"
        onClick={run}
        disabled={running}
        style={{ width: "100%", justifyContent: "center" }}
      >
        <Cpu size={14} />
        {running ? "Running Agent..." : done ? "Re-run Agent" : "Run Agent"}
      </button>
    </div>
  );
}

// ── Classification Panel ────────────────────────────────────────────────────
function ClassificationPanel() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="glass" style={{ padding: 24, height: "100%" }}>
      <PanelHeader
        icon={<Zap size={16} color="var(--error)" />}
        iconBg="#FEF2F2"
        title="Classification Engine"
        subtitle="DeBERTa-v3-large"
        right={
          <button
            id="reveal-classification-btn"
            className="btn-ghost"
            onClick={() => setRevealed(true)}
          >
            {revealed ? "Re-classify" : "Classify ›"}
          </button>
        }
      />

      {!revealed ? (
        <div style={{
          height: 160, display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--text-muted)", fontSize: 13,
          background: "var(--bg-surface)", borderRadius: 12,
          border: "1px solid var(--border)",
        }}>
          Run classification to see DeBERTa-v3 results
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Verdict banner */}
          <div style={{
            background: "#FEF2F2",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 12, padding: "12px 16px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <AlertTriangle size={18} color="var(--error)" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#DC2626", fontFamily: "var(--font-heading)" }}>
                AI Generated — High Confidence
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>DeBERTa-v3 | Attention Rollout × IG</div>
            </div>
            <div className="mono" style={{ fontSize: 26, fontWeight: 900, color: "var(--error)", flexShrink: 0 }}>96.3%</div>
          </div>

          {/* Probability bars */}
          {[
            { label: "AI Generated", pct: 96.3, cls: "progress-rose" },
            { label: "Human Written", pct: 3.7, cls: "progress-teal" },
          ].map(b => (
            <div key={b.label}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6, color: "var(--text-secondary)" }}>
                <span>{b.label}</span>
                <span className="mono" style={{ color: "var(--text-primary)", fontWeight: 600 }}>{b.pct}%</span>
              </div>
              <div className="progress-track">
                <motion.div
                  className={`progress-fill ${b.cls}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${b.pct}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
            <div className="section-label">Model Internals</div>
            {[
              { label: "DeBERTa-v3 Confidence", pct: 94.1, cls: "progress-indigo" },
              { label: "Ensemble Agreement",    pct: 97.8, cls: "progress-violet" },
              { label: "Cross-lingual Check",   pct: 91.5, cls: "progress-teal" },
            ].map(b => (
              <div key={b.label} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4, color: "var(--text-secondary)" }}>
                  <span>{b.label}</span>
                  <span className="mono" style={{ color: "var(--text-primary)" }}>{b.pct}%</span>
                </div>
                <div className="progress-track" style={{ height: 4 }}>
                  <motion.div
                    className={`progress-fill ${b.cls}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${b.pct}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ── Token Heatmap ───────────────────────────────────────────────────────────
function TokenHeatmap() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="glass" style={{ padding: 24 }}>
      <PanelHeader
        icon={<Eye size={16} color="var(--accent)" />}
        iconBg="var(--accent-light)"
        title="Token Saliency Heatmap"
        subtitle="Attention Rollout × Integrated Gradients"
        right={<span className="badge badge-violet">Fernando Method</span>}
      />

      <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 14 }}>
        Hover any token to see saliency breakdown
      </div>

      {/* Token pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {TOKEN_DATA.map((t, i) => {
          const style = scoreToStyle(t.score);
          const isHovered = hovered === i;
          return (
            <motion.span
              key={i}
              id={`token-${i}`}
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered(null)}
              whileHover={{ scale: 1.08, y: -2 }}
              className="mono"
              style={{
                padding: "6px 12px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                cursor: "pointer",
                background: isHovered ? "var(--accent)" : style.background,
                color: isHovered ? "#fff" : style.color,
                border: isHovered ? "1px solid var(--accent)" : style.border,
                transition: "background 0.15s, color 0.15s",
              }}
            >
              {t.word}
            </motion.span>
          );
        })}
      </div>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hovered !== null && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: 14, padding: 16, marginBottom: 16,
              boxShadow: "var(--shadow-card-hover)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Token Analysis</span>
              <span className="mono" style={{ fontSize: 15, fontWeight: 700, color: "var(--accent)" }}>
                &ldquo;{TOKEN_DATA[hovered].word}&rdquo;
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {[
                ["Saliency Score",   `${(TOKEN_DATA[hovered].score * 100).toFixed(1)}%`],
                ["Attention Rollout", `${(TOKEN_DATA[hovered].score * 87).toFixed(1)}%`],
                ["Integrated Grad",  `${(TOKEN_DATA[hovered].score * 94).toFixed(1)}%`],
              ].map(([k, v]) => (
                <div key={k} style={{
                  textAlign: "center",
                  background: "var(--accent-light)",
                  borderRadius: 8, padding: "10px 8px",
                  border: "1px solid var(--border)",
                }}>
                  <div style={{ fontSize: 9, color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k}</div>
                  <div className="mono" style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>{v}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saliency legend */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11, color: "var(--text-muted)" }}>
        <span>Low</span>
        <div style={{
          flex: 1, height: 6, borderRadius: 999,
          background: "linear-gradient(to right, rgba(140,82,255,0.1), rgba(140,82,255,0.5), rgba(140,82,255,1))",
        }} />
        <span>High Saliency</span>
      </div>
    </div>
  );
}

// ── Audit Panel ─────────────────────────────────────────────────────────────
function AuditPanel() {
  return (
    <div className="glass" style={{ padding: 24 }}>
      <PanelHeader
        icon={<FileText size={16} color="var(--warning)" />}
        iconBg="#FFFBEB"
        title="Forensic Audit Report"
        subtitle="Agentic SDK — Natural Language Explanation"
        right={<span className="badge badge-amber">Auto-Generated</span>}
      />

      {/* Findings */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {AUDIT_FINDINGS.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              background: "var(--bg-surface)",
              borderRadius: 12, padding: "12px 14px",
              border: "1px solid var(--border)",
            }}
          >
            {/* Accent dot */}
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: f.accent, marginTop: 6, flexShrink: 0 }} />
            <f.icon size={14} color={f.accent} style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>{f.label}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2, lineHeight: 1.5 }}>{f.detail}</div>
            </div>
            <span className="mono" style={{
              fontSize: 12, fontWeight: 700,
              color: f.score > 85 ? "var(--error)" : "var(--warning)",
              flexShrink: 0,
            }}>{f.score}%</span>
          </motion.div>
        ))}
      </div>

      {/* AOPC Gauge */}
      <div style={{
        background: "var(--bg-surface)",
        borderRadius: 14, padding: 20,
        border: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}>
              AOPC Score
            </div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
              Area Over Perturbation Curve — Faithfulness Metric
            </div>
          </div>
          <span className="badge badge-emerald">High Faithfulness</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {/* Circular gauge */}
          <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
            <svg viewBox="0 0 100 100" style={{ width: 88, height: 88, transform: "rotate(-90deg)" }}>
              <circle cx="50" cy="50" r="38" fill="none" stroke="var(--border)" strokeWidth="12" />
              <motion.circle
                cx="50" cy="50" r="38" fill="none"
                stroke="url(#aopc-g)" strokeWidth="12" strokeLinecap="round"
                strokeDasharray="238.8"
                initial={{ strokeDashoffset: 238.8 }}
                animate={{ strokeDashoffset: 238.8 * (1 - 0.847) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="aopc-g" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8C52FF" />
                  <stop offset="100%" stopColor="#C084FC" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div className="mono" style={{ fontSize: 18, fontWeight: 900, color: "var(--accent)", lineHeight: 1 }}>84.7</div>
              <div style={{ fontSize: 8, color: "var(--text-muted)", marginTop: 2 }}>AOPC</div>
            </div>
          </div>
          {/* Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {[
              ["Faithfulness",      "High"],
              ["Perturbation Steps","20"],
              ["Random Baseline",   "50.0"],
              ["Sufficiency Metric","0.912"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", gap: 10, fontSize: 12 }}>
                <span style={{ color: "var(--text-muted)", minWidth: 130 }}>{k}</span>
                <span className="mono" style={{
                  color: v === "High" ? "var(--success)" : "var(--text-primary)",
                  fontWeight: 600,
                }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Export ──────────────────────────────────────────────────────────────
export function TextForensicsDashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Page Header */}
      <motion.div {...fadeUp()} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div>
          {/* Section label */}
          <div className="section-label" style={{ marginBottom: 6 }}>
            Text Forensics Module
          </div>
          <h1 style={{
            fontSize: 30, fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em", lineHeight: 1.15,
            fontFamily: "var(--font-heading)",
          }}>
            Analysis{" "}
            <span className="gradient-text-violet">Engine</span>
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
            Member 1 (Athapaththu) · Member 2 (Fernando) — DeBERTa-v3 + LlamaIndex ReAct
          </p>
        </div>
        <span className="badge badge-indigo" style={{
          flexShrink: 0, alignSelf: "flex-start", marginTop: 4,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <span className="pulse-dot" style={{ background: "var(--accent)", color: "var(--accent)" }} />
          Active Pipeline
        </span>
      </motion.div>

      {/* Input Text Preview */}
      <motion.div {...fadeUp(0.05)}>
        <div className="card-accent" style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <FileText size={12} color="var(--accent)" />
            <span style={{
              fontSize: 10, color: "var(--accent)", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              fontFamily: "var(--font-heading)",
            }}>Input Text — Sample Document</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>
            {SAMPLE_TEXT}
          </p>
        </div>
      </motion.div>

      {/* 2-column grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <motion.div {...fadeUp(0.1)} style={{ display: "flex" }}>
          <div style={{ flex: 1 }}><SanitizationPanel /></div>
        </motion.div>
        <motion.div {...fadeUp(0.15)} style={{ display: "flex" }}>
          <div style={{ flex: 1 }}><ClassificationPanel /></div>
        </motion.div>
      </div>

      {/* Full-width heatmap */}
      <motion.div {...fadeUp(0.2)}>
        <TokenHeatmap />
      </motion.div>

      {/* Full-width audit */}
      <motion.div {...fadeUp(0.25)}>
        <AuditPanel />
      </motion.div>
    </div>
  );
}
