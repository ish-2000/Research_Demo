"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Mic, Cpu, CheckCircle, Download, AlertTriangle, Eye, Brain, Activity, Zap, RefreshCw } from "lucide-react";

type Mode = "idle" | "uploading" | "processing" | "done";
type FileType = "text" | "voice";

const STEPS_TEXT  = ["Loading DeBERTa-v3 model weights...", "Running ReAct Sanitization Agent...", "Extracting token embeddings (768D)...", "Computing Attention Rollout matrices...", "Applying Integrated Gradients (IG)...", "Generating NL forensic audit...", "Computing AOPC faithfulness score..."];
const STEPS_VOICE = ["Loading AASIST + WavLM-Large models...", "Running Spectral branch (LFCC+TCN)...", "Running Spectro-Temporal branch (AASIST)...", "Running Temporal branch (WavLM-Large)...", "Running Physiological analysis (GSA)...", "Computing adaptive attention fusion...", "Generating ESVAS + SHAP explanations..."];

const REPORT_TEXT = {
  verdict: "AI GENERATED",
  confidence: 96.3,
  summary: "Analysis reveals high syntactic uniformity (σ=2.1) and low perplexity (23.4) consistent with large language model output. 14 Unicode homoglyph artifacts were detected and stripped by the ReAct agent. The DeBERTa-v3 classification engine assigns 96.3% probability of AI authorship, corroborated by Integrated Gradients showing concentrated saliency on syntactically rigid tokens.",
  findings: [
    { label: "Syntactic Uniformity", value: "94%",    Icon: AlertTriangle, accent: "#f43f5e" },
    { label: "Perplexity Score",     value: "23.4",   Icon: Zap,           accent: "#f59e0b" },
    { label: "AOPC Faithfulness",    value: "84.7",   Icon: CheckCircle,   accent: "#34d399" },
    { label: "Homoglyph Artifacts",  value: "14 chars", Icon: Eye,         accent: "#c4b5fd" },
  ],
};

const REPORT_VOICE = {
  verdict: "SYNTHETIC VOICE",
  confidence: 90.2,
  summary: "Voice signal exhibits characteristic GAN-synthesis artifacts in two temporal regions (1.0–1.75s, 2.75–3.4s). Jitter (8.3%) and Shimmer (APQ11) deviate significantly from natural speech distributions. The adaptive fusion of all four analysis branches yields 90.2% synthetic confidence. ESVAS attribution confirms Glottal Closure Irregularity as the primary discriminative feature.",
  findings: [
    { label: "Jitter Irregularity",    value: "91%",      Icon: Activity,      accent: "#f43f5e" },
    { label: "Glottal Closure Irreg.", value: "85%",      Icon: Mic,           accent: "#f59e0b" },
    { label: "WavLM Branch Score",     value: "94.2%",    Icon: Brain,         accent: "#c4b5fd" },
    { label: "Suspicious Segments",    value: "2 regions", Icon: AlertTriangle, accent: "#f43f5e" },
  ],
};

const WAVEFORM_SEGS = Array.from({ length: 64 }, (_, i) => ({ h: Math.random() * 0.65 + 0.1, sus: (i >= 14 && i <= 25) || (i >= 40 && i <= 52) }));
const TOKEN_WORDS   = ["The", "algorithmic", "progression", "of", "AI", "systems", "demonstrates", "uniform", "prose", "structure"];
const TOKEN_SCORES  = [0.08, 0.92, 0.78, 0.10, 0.95, 0.71, 0.65, 0.91, 0.68, 0.87];

// ── Drop Zone ────────────────────────────────────────────────────────────────
function DropZone({ onUpload }: { onUpload: (t: FileType) => void }) {
  const [dragging, setDragging] = useState(false);
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) onUpload(f.name.endsWith(".wav") || f.name.endsWith(".mp3") ? "voice" : "text");
  }, [onUpload]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      style={{
        border: `2px dashed ${dragging ? "rgba(99,102,241,0.7)" : "rgba(255,255,255,0.12)"}`,
        borderRadius: 20, padding: "60px 40px", textAlign: "center",
        background: dragging ? "rgba(99,102,241,0.06)" : "rgba(255,255,255,0.02)",
        transition: "all 0.25s",
        boxShadow: dragging ? "0 0 40px rgba(99,102,241,0.15)" : "none",
      }}>
      <motion.div animate={{ y: dragging ? -8 : 0 }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 18,
          background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))",
          border: "1px solid rgba(99,102,241,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Upload size={30} color="#818cf8" />
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Drop your file here</div>
          <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Supports{" "}
            <span style={{ color: "#818cf8", fontWeight: 600 }}>.txt</span>
            {" "}for text analysis or{" "}
            <span style={{ color: "#5eead4", fontWeight: 600 }}>.wav / .mp3</span>
            {" "}for voice forensics
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button id="upload-text-btn" className="btn-secondary" onClick={() => onUpload("text")} style={{ borderColor: "rgba(99,102,241,0.4)", color: "#818cf8" }}>
            <FileText size={14} /> Simulate .txt
          </button>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>or</span>
          <button id="upload-voice-btn" className="btn-secondary" onClick={() => onUpload("voice")} style={{ borderColor: "rgba(20,184,166,0.4)", color: "#5eead4" }}>
            <Mic size={14} /> Simulate .wav
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Processing View ───────────────────────────────────────────────────────────
function ProcessingView({ fileType, onDone }: { fileType: FileType; onDone: () => void }) {
  const [stepIdx, setStepIdx] = useState(0);
  const steps = fileType === "text" ? STEPS_TEXT : STEPS_VOICE;

  useEffect(() => {
    const timers = steps.map((_, i) => setTimeout(() => {
      setStepIdx(i);
      if (i === steps.length - 1) setTimeout(onDone, 700);
    }, i * 650));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pct = Math.round(((stepIdx + 1) / steps.length) * 100);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Neural animation */}
      <div className="glass" style={{ padding: 40, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div className="scan-line" />
        <div style={{ position: "relative", display: "inline-flex", marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: 20, background: "linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))", border: "1px solid rgba(99,102,241,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
              <Cpu size={36} color="#818cf8" />
            </motion.div>
          </div>
          {[1, 2, 3].map(r => (
            <motion.div key={r} style={{ position: "absolute", inset: 0, borderRadius: 20, border: "1px solid rgba(99,102,241,0.3)" }}
              animate={{ scale: [1, 1.4 + r * 0.25], opacity: [0.5, 0] }}
              transition={{ duration: 1.5, delay: r * 0.4, repeat: Infinity }} />
          ))}
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 6 }}>
          <span className="gradient-text-indigo">Neuro-Extraction Pipeline</span>
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24 }}>Simulating tensor hooks across model layers...</div>
        <div style={{ maxWidth: 320, margin: "0 auto 10px" }}>
          <div className="progress-track" style={{ height: 8 }}>
            <motion.div className="progress-fill progress-indigo" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>
        <div className="mono" style={{ fontSize: 11, color: "var(--text-muted)" }}>{pct}% complete</div>
      </div>

      {/* Step log */}
      <div className="glass" style={{ padding: 24 }}>
        <div className="section-label">Pipeline Log</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, fontFamily: "var(--font-mono)", fontSize: 12 }}>
          {steps.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: i <= stepIdx ? 1 : 0.25 }}
              style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {i < stepIdx ? (
                <CheckCircle size={13} color="#34d399" style={{ flexShrink: 0 }} />
              ) : i === stepIdx ? (
                <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.7, repeat: Infinity }}
                  style={{ width: 12, height: 12, borderRadius: "50%", background: "#818cf8", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 12, height: 12, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)", flexShrink: 0 }} />
              )}
              <span style={{ color: i <= stepIdx ? "var(--text-secondary)" : "var(--text-muted)" }}>{s}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Result View ───────────────────────────────────────────────────────────────
function ResultView({ fileType, onReset }: { fileType: FileType; onReset: () => void }) {
  const [pdfState, setPdfState] = useState<"idle" | "loading" | "done">("idle");
  const report = fileType === "text" ? REPORT_TEXT : REPORT_VOICE;

  const genPDF = () => { setPdfState("loading"); setTimeout(() => setPdfState("done"), 2200); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Verdict Banner */}
      <div style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.25)", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(244,63,94,0.15)", border: "1px solid rgba(244,63,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <AlertTriangle size={22} color="#f43f5e" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#fda4af", letterSpacing: "-0.01em" }}>{report.verdict}</div>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
            Overall Confidence: <span className="mono" style={{ color: "#fff", fontWeight: 700 }}>{report.confidence}%</span>
          </div>
        </div>
        <span className="badge badge-rose" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className="pulse-dot" style={{ background: "#f43f5e", color: "#f43f5e" }} />
          Forensic Alert
        </span>
      </div>

      {/* Split screen */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Evidence Viewer */}
        <div className="glass" style={{ padding: 24 }}>
          <div className="section-label">
            <Eye size={11} color="#818cf8" /> Evidence Viewer
          </div>

          {fileType === "text" ? (
            <>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12 }}>Token Saliency Heatmap</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                {TOKEN_WORDS.map((w, i) => (
                  <span key={i} className="mono" style={{
                    padding: "5px 10px", borderRadius: 8, fontSize: 12, fontWeight: 500,
                    background: `rgba(244,63,94,${TOKEN_SCORES[i] * 0.35})`,
                    color: TOKEN_SCORES[i] > 0.5 ? "#fda4af" : "var(--text-secondary)",
                    border: `1px solid rgba(244,63,94,${TOKEN_SCORES[i] * 0.4})`,
                  }}>{w}</span>
                ))}
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 12 }}>Audio Waveform + Suspicious Regions</div>
              <div style={{ height: 64, display: "flex", alignItems: "flex-end", gap: 2, background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "10px 10px 8px", marginBottom: 20 }}>
                {WAVEFORM_SEGS.map((s, i) => (
                  <div key={i} style={{ flex: 1, borderRadius: 3, height: `${s.h * 100}%`, background: s.sus ? "linear-gradient(to top, #f43f5e, #f97316)" : "rgba(99,102,241,0.35)", minWidth: 2 }} />
                ))}
              </div>
            </>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {report.findings.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "14px 12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <f.Icon size={14} color={f.accent} style={{ marginBottom: 8 }} />
                <div className="mono" style={{ fontSize: 18, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{f.value}</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 5 }}>{f.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Forensic Report */}
        <div className="glass" style={{ padding: 24, display: "flex", flexDirection: "column" }}>
          <div className="section-label">
            <FileText size={11} color="#fcd34d" /> Forensic Report
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 16, border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 8 }}>AI Forensic Audit Summary</div>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.75 }}>{report.summary}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {report.findings.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <f.Icon size={12} color={f.accent} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", flex: 1 }}>{f.label}</span>
                  <span className="mono" style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            <button id="generate-pdf-btn" className="btn-primary" onClick={genPDF} disabled={pdfState === "loading"}
              style={{ width: "100%", justifyContent: "center", padding: "13px 20px" }}>
              {pdfState === "loading" ? (
                <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><RefreshCw size={14} /></motion.div> Generating PDF...</>
              ) : pdfState === "done" ? (
                <><CheckCircle size={14} /> Report Generated!</>
              ) : (
                <><Download size={14} /> Generate PDF Forensic Report</>
              )}
            </button>
            <button id="reset-demo-btn" className="btn-secondary" onClick={onReset} style={{ width: "100%", justifyContent: "center" }}>
              <RefreshCw size={14} /> Analyze New File
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export function InteractiveDemoPage() {
  const [mode, setMode] = useState<Mode>("idle");
  const [fileType, setFileType] = useState<FileType>("text");
  const [fileName, setFileName] = useState("");

  const handleUpload = (type: FileType) => {
    setFileType(type);
    setFileName(type === "text" ? "sample_document.txt" : "voice_recording.wav");
    setMode("uploading");
    setTimeout(() => setMode("processing"), 900);
  };

  const steps = ["Upload", "Validate", "Process", "Results"];
  const stepIdx = { idle: 0, uploading: 1, processing: 2, done: 3 }[mode];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
              Interactive <span className="gradient-text-indigo">Process Demo</span>
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
              End-to-end forensic analysis pipeline — Upload → Process → Report → Export
            </p>
          </div>
          {/* Step indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {steps.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700,
                    background: i < stepIdx ? "#34d399" : i === stepIdx ? "#6366f1" : "rgba(255,255,255,0.07)",
                    color: i <= stepIdx ? "#fff" : "var(--text-muted)",
                    boxShadow: i === stepIdx ? "0 0 12px rgba(99,102,241,0.6)" : "none",
                    transition: "all 0.3s",
                  }}>
                    {i < stepIdx ? <CheckCircle size={12} /> : i + 1}
                  </div>
                  <span style={{ fontSize: 9, color: i <= stepIdx ? "var(--text-secondary)" : "var(--text-muted)", whiteSpace: "nowrap" }}>{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: 32, height: 1, background: i < stepIdx ? "#34d399" : "rgba(255,255,255,0.1)", marginBottom: 16, transition: "background 0.3s" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {mode === "idle" && (
          <motion.div key="idle" exit={{ opacity: 0, y: -10 }}>
            <DropZone onUpload={handleUpload} />
          </motion.div>
        )}

        {mode === "uploading" && (
          <motion.div key="uploading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="glass" style={{ padding: 24, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {fileType === "text" ? <FileText size={20} color="#34d399" /> : <Mic size={20} color="#34d399" />}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{fileName}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>File validated — initializing pipeline...</div>
              </div>
              <span className="badge badge-emerald" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                <span className="pulse-dot" style={{ background: "#34d399", color: "#34d399" }} /> Queued
              </span>
            </div>
          </motion.div>
        )}

        {mode === "processing" && (
          <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ProcessingView fileType={fileType} onDone={() => setMode("done")} />
          </motion.div>
        )}

        {mode === "done" && (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ResultView fileType={fileType} onReset={() => { setMode("idle"); }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
