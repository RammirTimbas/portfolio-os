import { apps } from "../../data/apps";
import { useWindowStore } from "../../stores/windowStore";
import { useShellStore } from "../../stores/shellStore";
import { Search, Power, User, Settings as SettingsIcon, ShieldCheck, AppWindow, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { profileData } from "../../data/profile";

export default function StartMenu() {
  const { isStartMenuOpen, closeStartMenu } = useShellStore();
  const openWindow = useWindowStore((state) => state.openWindow);

  const pinnedApps = apps.filter(app => !app.hideFromDesktop);

  const handleOpenApp = (app: any) => {
    openWindow({
      id: crypto.randomUUID(),
      appId: app.id,
      title: app.title,
      position: {
        x: window.innerWidth / 2 - app.defaultSize.width / 2 + (Math.random() * 40),
        y: window.innerHeight / 2 - app.defaultSize.height / 2 + (Math.random() * 40),
      },
      isMaximized: false,
      size: app.defaultSize,
      minSize: { width: 420, height: 300 },
    });
    closeStartMenu();
  };

  return (
    <AnimatePresence>
      {isStartMenuOpen && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={closeStartMenu} />
          <motion.div
            initial={{ y: 300, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 300, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-20 left-1/2 z-[9999] h-[640px] w-[540px] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur-3xl"
          >
            {/* Search Bar */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input
                type="text"
                placeholder="Search for apps, settings, and documents"
                className="w-full rounded-full bg-black/20 border border-white/5 py-3 pl-12 pr-4 text-sm text-white placeholder:text-zinc-500 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all shadow-inner"
              />
            </div>

            {/* Pinned Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between px-2 mb-4">
                <h3 className="text-xs font-bold text-white tracking-tight">Pinned</h3>
                <button className="rounded bg-white/5 px-2 py-1 text-[10px] font-bold text-zinc-400 hover:bg-white/10 transition-colors">All apps {'>'}</button>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {pinnedApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => handleOpenApp(app)}
                    className="flex flex-col items-center gap-2 rounded-xl p-3 hover:bg-white/5 transition-all group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-lg group-hover:scale-110 transition-transform">
                      <app.icon className="text-white" size={20} strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] font-medium text-zinc-300 text-center leading-tight truncate w-full">
                      {app.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recommended Section */}
            <div>
              <div className="px-2 mb-4">
                <h3 className="text-xs font-bold text-white tracking-tight">Recommended</h3>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <div
                  onClick={() => handleOpenApp(apps.find(a => a.id === 'about'))}
                  className="flex items-center gap-3 rounded-xl p-3 hover:bg-white/5 cursor-pointer group transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-zinc-200">Identity.sys</p>
                    <p className="text-[9px] text-zinc-500">Recently updated</p>
                  </div>
                </div>
                <div
                  onClick={() => handleOpenApp(apps.find(a => a.id === 'projects'))}
                  className="flex items-center gap-3 rounded-xl p-3 hover:bg-white/5 cursor-pointer group transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
                    <AppWindow size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-zinc-200">Workspace</p>
                    <p className="text-[9px] text-zinc-500">4 builds discovered</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl p-3 hover:bg-white/5 cursor-pointer group opacity-40">
                  <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-500">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-zinc-200">Terminal Log</p>
                    <p className="text-[9px] text-zinc-500">2h ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom User Bar */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t border-white/5 bg-black/20 px-8 py-4">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="relative">
                  <img src={profileData.avatar} className="h-8 w-8 rounded-full border border-white/10" alt="User" />
                  <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-zinc-900" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">{profileData.name}</span>
                  <span className="text-[9px] text-zinc-500 font-mono">System Admin</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                  <SettingsIcon size={16} />
                </button>
                <button className="p-2 text-zinc-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5">
                  <Power size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
