import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VeriSynth: Multi-Modal Forensic Lab",
  description: "Turning 'What If' into 'It's Live.' — Enterprise-grade AI forensics for text and voice authenticity verification.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="noise" aria-hidden="true" />
        <div className="blob blob-1" aria-hidden="true" />
        <div className="blob blob-2" aria-hidden="true" />
        <div className="blob blob-3" aria-hidden="true" />
        <div style={{ position: "relative", zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
