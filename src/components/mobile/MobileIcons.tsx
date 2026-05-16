import { apps } from "../../data/apps";
import { useWindowStore } from "../../stores/windowStore";
import { motion } from "framer-motion";

export default function MobileIcons() {
  const openWindow = useWindowStore((state) => state.openWindow);
  const desktopApps = apps.filter(app => !app.hideFromDesktop);

  const handleOpenApp = (app: any) => {
    openWindow({
      id: crypto.randomUUID(),
      appId: app.id,
      title: app.title,
      position: { x: 0, y: 0 },
      isMaximized: true,
      size: { width: window.innerWidth, height: window.innerHeight },
      minSize: { width: 300, height: 300 },
    });
  };

  const iconColors: Record<string, string> = {
    about: "from-blue-500 to-blue-600",
    projects: "from-amber-400 to-orange-500",
    terminal: "from-zinc-700 to-zinc-900",
    settings: "from-slate-400 to-slate-600",
    music: "from-purple-500 to-indigo-600",
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-6 pt-12">
      {desktopApps.map((app) => {
        const Icon = app.icon;
        return (
          <motion.button
            key={app.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleOpenApp(app)}
            className="flex flex-col items-center gap-1.5"
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${iconColors[app.id] || "from-zinc-700 to-zinc-800"} shadow-lg shadow-black/20`}>
              <Icon className="text-white" size={28} strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-medium text-white/80 tracking-tight">
              {app.title}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
