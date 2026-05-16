import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, Command } from "lucide-react";

export default function FullscreenPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [os, setOs] = useState<"mac" | "windows" | "other">("other");

  useEffect(() => {
    const platform = navigator.platform.toUpperCase();
    if (platform.indexOf('MAC') >= 0) setOs("mac");
    else if (platform.indexOf('WIN') >= 0) setOs("windows");
    else setOs("other");

    const hasPrompted = localStorage.getItem("portfolio-os:fullscreen-prompt");
    if (!hasPrompted) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000); // Show after 3 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    localStorage.setItem("portfolio-os:fullscreen-prompt", "true");
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    }
    dismiss();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-md px-4"
        >
          <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl ring-1 ring-white/5 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Maximize2 size={24} />
              </div>

              <div className="flex-1 space-y-1">
                <h3 className="text-sm font-bold text-white tracking-tight">Immersive Experience</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  For the best experience, we recommend running this OS in full screen.
                </p>

                <div className="pt-4 flex items-center gap-3">
                  <button
                    onClick={handleFullscreen}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                  >
                    Enter Full Screen
                  </button>
                  <button
                    onClick={dismiss}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 text-[11px] font-bold rounded-lg transition-colors border border-white/5"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>

              <button
                onClick={dismiss}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Hint Footer */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
              <span>Shortcut Guide</span>
              <div className="flex items-center gap-1.5">
                {os === "mac" ? (
                  <>
                    <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-white/5 flex items-center gap-1">
                      <Command size={8} />
                      <span>CMD</span>
                    </kbd>
                    <span>+</span>
                    <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-white/5">F12</kbd>
                  </>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="opacity-50">WIN:</span>
                    <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-white/5">F11</kbd>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
