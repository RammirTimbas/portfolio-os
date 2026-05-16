import { useState, useEffect } from "react";
import ProfileHeader from "./about/ProfileHeader";
import SystemInfoPanel from "./about/SystemInfoPanel";
import ResumePanel from "./about/ResumePanel";
import TerminalView from "./about/TerminalView";
import { profileData } from "../../data/profile";
import {
  Terminal,
  Layout,
  ChevronLeft,
  FileJson,
  Check,
  Eye,
  ShieldCheck,
  Cpu
} from "lucide-react";

interface Props {
  isMobile?: boolean;
}

export default function AboutApp({ isMobile }: Props) {
  const [bootStep, setBootStep] = useState(0);
  const [view, setView] = useState<"gui" | "cli" | "preview">("gui");
  const [copied, setCopied] = useState(false);

  const bootLogs = [
    "Establishing secure link to Identity.sys...",
    "Decrypting Profile Layer (AES-256)...",
    "Mounting /mnt/user/rammir_timbas...",
    "Verifying Identity Artifacts...",
    "GUI Subsystem Ready."
  ];

  useEffect(() => {
    if (bootStep < bootLogs.length) {
      const timer = setTimeout(() => setBootStep(s => s + 1), 400 + Math.random() * 600);
      return () => clearTimeout(timer);
    }
  }, [bootStep]);

  const copyIdentityJson = () => {
    navigator.clipboard.writeText(JSON.stringify(profileData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (bootStep < bootLogs.length) {
    return (
      <div className="flex h-full w-full flex-col bg-black p-8 font-mono">
        <div className="flex items-center gap-2 mb-8 text-blue-500">
          <Cpu className="animate-pulse" size={20} />
          <span className="text-xs font-bold tracking-[0.2em] uppercase">Identity Boot Loader v4.0</span>
        </div>

        <div className="space-y-2">
          {bootLogs.slice(0, bootStep + 1).map((log, i) => (
            <div key={i} className="flex gap-4 text-[11px]">
              <span className="text-zinc-600">[{new Date().toLocaleTimeString()}]</span>
              <span className={i === bootStep ? "text-white animate-pulse" : "text-emerald-500"}>
                {i === bootStep ? "> " : "✓ "}{log}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-auto flex justify-between items-center text-[10px] text-zinc-700">
          <span>MEM_ALLOC: 0x7FF8E210</span>
          <span className="animate-pulse">KERNEL_ACTIVE</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-zinc-950 overflow-hidden selection:bg-blue-500/30">
      {/* OS App Bar - Hidden on mobile as MobileShell provides it */}
      {!isMobile && (
        <div className="flex items-center justify-between border-b border-white/5 bg-zinc-900/80 backdrop-blur-md px-4 py-2">
          <div className="flex items-center gap-3">
            {view === "preview" ? (
              <button
                onClick={() => setView("gui")}
                className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 hover:text-white transition-colors"
              >
                <ChevronLeft size={14} /> Back to Dashboard
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-blue-500" size={14} />
                <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Identity Dashboard</span>
              </div>
            )}
          </div>

          <div className="flex items-center rounded-lg bg-black/40 p-0.5 border border-white/5">
            <button
              onClick={() => setView("gui")}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[9px] font-bold transition-all ${
                view === "gui" ? "bg-blue-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Layout size={12} /> GUI
            </button>
            <button
              onClick={() => setView("cli")}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[9px] font-bold transition-all ${
                view === "cli" ? "bg-zinc-700 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Terminal size={12} /> CLI
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {view === "cli" ? (
          <TerminalView />
        ) : view === "preview" ? (
          <div className="flex h-full w-full flex-col items-center justify-center p-8 bg-zinc-950">
            <div className="w-full max-w-2xl h-full border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col bg-zinc-900">
               <div className="p-3 border-b border-white/5 bg-zinc-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500/50" />
                    <span className="text-[10px] font-mono text-zinc-400">artifact_v4_stable.pdf</span>
                  </div>
                  <a href={profileData.resumeUrl} download className="text-[10px] bg-blue-600 px-3 py-1 rounded text-white font-bold">Download</a>
               </div>
               <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-white/5 p-12 text-center">
                  <div className="relative">
                    <Eye size={40} className="text-blue-500/50" />
                    <div className="absolute inset-0 border-t-2 border-blue-500 animate-[scan_2s_linear_infinite]" />
                  </div>
                  <p className="text-xs font-mono text-zinc-500">Decrypting Visual Buffer...</p>
               </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <ProfileHeader />
            <SystemInfoPanel />
            <div className="px-6 pb-2">
               <button
                 onClick={() => setView("preview")}
                 className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-blue-500/10 bg-blue-500/5 hover:bg-blue-500/10 text-xs font-bold text-blue-400/80 transition-all group"
               >
                 <Eye size={14} className="group-hover:scale-110 transition-transform" />
                 Open Visual Artifact (Preview)
               </button>
            </div>
            <ResumePanel />
          </div>
        )}
      </div>

      {/* Footer Metadata Bar - Hidden on mobile */}
      {!isMobile && (
        <div className="border-t border-white/5 bg-zinc-900/80 backdrop-blur-md p-2 px-4 flex justify-between items-center">
          <button
            onClick={copyIdentityJson}
            className="flex items-center gap-2 group"
          >
            <FileJson size={12} className="text-zinc-500 group-hover:text-blue-400 transition-colors" />
            <span className="text-[9px] font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors">
              {copied ? "IDENTITY_DATA_COPIED" : "EXPORT IDENTITY.JSON"}
            </span>
            {copied && <Check size={10} className="text-emerald-400" />}
          </button>

          <div className="flex gap-4">
            <span className="text-[9px] font-mono text-zinc-600">SECURE_TUNNEL: ENABLED</span>
            <span className="text-[9px] font-mono text-zinc-600">v4.0.0-PRO</span>
          </div>
        </div>
      )}

      {/* Mobile view switchers at bottom of AboutApp for easier access */}
      {isMobile && view !== "preview" && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center rounded-full bg-black/60 backdrop-blur-xl p-1 border border-white/10 shadow-2xl z-[60]">
          <button
            onClick={() => setView("gui")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-bold transition-all ${
              view === "gui" ? "bg-blue-600 text-white" : "text-zinc-500"
            }`}
          >
            <Layout size={14} /> DASHBOARD
          </button>
          <button
            onClick={() => setView("cli")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-[10px] font-bold transition-all ${
              view === "cli" ? "bg-zinc-700 text-white" : "text-zinc-500"
            }`}
          >
            <Terminal size={14} /> CONSOLE
          </button>
        </div>
      )}
    </div>
  );
}
