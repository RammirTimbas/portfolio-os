import { useState, useEffect } from "react";
import { useConfigStore } from "../../stores/configStore";
import { useWindowStore } from "../../stores/windowStore";
import MobileIcons from "../../components/mobile/MobileIcons";
import { Battery, Wifi, Signal, Search } from "lucide-react";
import { apps } from "../../data/apps";
import { motion, AnimatePresence } from "framer-motion";

const wallpaperClasses = {
  default: "bg-[radial-gradient(circle_at_top,#27272a,transparent_60%)]",
  blue: "bg-[radial-gradient(circle_at_top,#1e3a8a,transparent_60%)]",
  green: "bg-[radial-gradient(circle_at_top,#064e3b,transparent_60%)]",
  purple: "bg-[radial-gradient(circle_at_top,#4c1d95,transparent_60%)]",
};

export default function MobileShell() {
  const { wallpaper } = useConfigStore();
  const { windows, closeWindow } = useWindowStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeWindow = windows.find(w => w.isFocused) || windows[windows.length - 1];

  return (
    <main className="fixed inset-0 flex h-screen w-screen flex-col overflow-hidden bg-zinc-950 text-white select-none">
      {/* Dynamic Wallpaper */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${wallpaperClasses[wallpaper as keyof typeof wallpaperClasses] || wallpaperClasses.default}`} />

      {/* Top Status Bar */}
      <div className="relative z-[100] flex h-12 items-center justify-between px-6 shrink-0">
        <div className="text-[13px] font-bold">
          {time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false })}
        </div>

        {/* Dynamic Island Mimic / Notch Space */}
        <div className="absolute left-1/2 top-2 h-7 w-28 -translate-x-1/2 rounded-full bg-black shadow-lg" />

        <div className="flex items-center gap-1.5 text-zinc-300">
          <Signal size={14} />
          <Wifi size={14} />
          <Battery size={14} className="rotate-90" />
        </div>
      </div>

      {/* Search Bar Mimic */}
      <div className="relative z-10 px-6 py-2">
        <div className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/5 px-4 py-2.5 backdrop-blur-md">
          <Search size={16} className="text-zinc-500" />
          <span className="text-[13px] text-zinc-500">Search apps & artifacts</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {!activeWindow ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="h-full"
            >
              <MobileIcons />
            </motion.div>
          ) : (
            <motion.div
              key={activeWindow.id}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-50 flex flex-col bg-zinc-950"
            >
              {/* Mobile App Header */}
              <div className="flex h-14 items-center justify-between border-b border-white/5 px-4 shrink-0 bg-black/20">
                <button
                  onClick={() => closeWindow(activeWindow.id)}
                  className="text-[13px] font-medium text-blue-400"
                >
                  Done
                </button>
                <div className="text-[13px] font-bold uppercase tracking-widest opacity-60">
                  {activeWindow.title}
                </div>
                <div className="w-8" /> {/* Spacer */}
              </div>

              {/* App Content */}
              <div className="flex-1 overflow-hidden">
                {(() => {
                  const app = apps.find(a => a.id === activeWindow.appId);
                  if (!app) return null;
                  const Component = app.component;
                  return <Component params={activeWindow.params} windowId={activeWindow.id} isMobile={true} />;
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Dock */}
      {!activeWindow && (
        <div className="relative z-10 mb-8 mt-auto flex justify-center px-6">
          <div className="flex items-center gap-4 rounded-[2.5rem] bg-white/10 p-4 backdrop-blur-2xl border border-white/10 shadow-2xl">
            {apps.filter(a => ['about', 'projects', 'terminal', 'settings'].includes(a.id)).map(app => (
              <motion.button
                key={app.id}
                whileTap={{ scale: 0.8 }}
                onClick={() => {
                   useWindowStore.getState().openWindow({
                      id: crypto.randomUUID(),
                      appId: app.id,
                      title: app.title,
                      position: { x: 0, y: 0 },
                      isMaximized: true,
                      size: { width: window.innerWidth, height: window.innerHeight },
                      minSize: { width: 300, height: 300 },
                   });
                }}
                className={`h-14 w-14 rounded-2xl bg-gradient-to-br shadow-lg flex items-center justify-center ${
                  app.id === 'about' ? 'from-blue-500 to-blue-600' :
                  app.id === 'projects' ? 'from-amber-400 to-orange-500' :
                  app.id === 'terminal' ? 'from-zinc-700 to-zinc-900' :
                  'from-slate-400 to-slate-600'
                }`}
              >
                <app.icon className="text-white" size={28} />
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Home Indicator Mimic */}
      <div className="relative z-[100] pb-2 flex justify-center shrink-0">
        <div className="h-1.5 w-36 rounded-full bg-white/20" />
      </div>
    </main>
  );
}
