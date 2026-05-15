import { apps } from "../../data/apps";
import { useWindowStore } from "../../stores/windowStore";
import { useContextMenuStore } from "../../stores/contextMenuStore";
import { useShellStore } from "../../stores/shellStore";
import { motion } from "framer-motion";
import { Layout, Settings } from "lucide-react";

export default function Taskbar() {
  const {
    windows,
    restoreWindow,
    focusWindow,
    minimizeWindow,
    minimizeAll,
    openWindow,
  } = useWindowStore();

  const { toggleStartMenu } = useShellStore();
  const openContextMenu = useContextMenuStore((state) => state.openContextMenu);

  const handleTaskbarContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY - 100, [
      {
        label: "Show Desktop",
        icon: Layout,
        action: () => minimizeAll(),
      },
      { divider: true },
      {
        label: "Taskbar Settings",
        icon: Settings,
        action: () => {
          const settingsApp = apps.find(a => a.id === "settings");
          if (settingsApp) {
            openWindow({
              id: crypto.randomUUID(),
              appId: settingsApp.id,
              title: settingsApp.title,
              position: {
                x: window.innerWidth / 2 - settingsApp.defaultSize.width / 2,
                y: window.innerHeight / 2 - settingsApp.defaultSize.height / 2,
              },
              isMaximized: false,
              size: settingsApp.defaultSize,
              minSize: { width: 420, height: 300 },
            });
          }
        },
      },
    ]);
  };

  return (
    <div
      onContextMenu={handleTaskbarContextMenu}
      className="
        absolute
        bottom-4
        left-1/2
        z-[9999]
        flex
        h-14
        -translate-x-1/2
        items-center
        gap-1
        rounded-2xl
        border
        border-white/10
        bg-zinc-900/40
        px-2
        py-1
        backdrop-blur-2xl
        shadow-2xl
        min-w-[64px]
        transition-all
        duration-300
      "
    >
      {/* Start Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleStartMenu();
        }}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg hover:bg-white/5 transition-colors group"
      >
        <div className="grid grid-cols-2 gap-0.5">
          <div className="h-2 w-2 rounded-sm bg-blue-400 group-hover:scale-110 transition-transform" />
          <div className="h-2 w-2 rounded-sm bg-blue-500 group-hover:scale-110 transition-transform" />
          <div className="h-2 w-2 rounded-sm bg-blue-600 group-hover:scale-110 transition-transform" />
          <div className="h-2 w-2 rounded-sm bg-blue-300 group-hover:scale-110 transition-transform" />
        </div>
      </button>

      {windows.length > 0 && (
        <div className="mx-1 h-6 w-px shrink-0 bg-white/10" />
      )}

      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[80vw]">
        {windows.map((window) => {
          const app = apps.find((a) => a.id === window.appId);
          if (!app) return null;

          const isFocused = window.isFocused;
          const isMinimized = window.isMinimized;
          const Icon = app.icon;

          const iconColors: Record<string, string> = {
            about: "text-blue-400",
            projects: "text-amber-400",
            terminal: "text-emerald-400",
            settings: "text-slate-400",
            'project-viewer': "text-blue-500",
          };

          return (
            <button
              key={window.id}
              onClick={() => {
                if (isFocused) {
                  minimizeWindow(window.id);
                } else if (isMinimized) {
                  restoreWindow(window.id);
                } else {
                  focusWindow(window.id);
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openContextMenu(e.clientX, e.clientY - 60, [
                   {
                     label: isMinimized ? "Restore" : "Minimize",
                     action: () => isMinimized ? restoreWindow(window.id) : minimizeWindow(window.id)
                   },
                   {
                     label: "Close",
                     action: () => useWindowStore.getState().closeWindow(window.id)
                   }
                ]);
              }}
              className={`
                group
                relative
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-lg
                transition-all
                duration-200
                ${isFocused ? "bg-white/10 shadow-inner scale-95" : "hover:bg-white/5"}
              `}
            >
              <div className={`transition-transform duration-200 group-hover:scale-110 ${iconColors[app.id] || "text-white"}`}>
                <Icon size={24} strokeWidth={1.5} />
              </div>

              {/* Indicator Bar */}
              <motion.div
                layoutId={`indicator-${window.id}`}
                className={`
                  absolute
                  bottom-1
                  h-1
                  rounded-full
                  bg-blue-400
                  transition-all
                  duration-300
                  ${isFocused ? "w-4 opacity-100" : "w-1 opacity-60 group-hover:w-2"}
                `}
              />
              
              {/* Tooltip */}
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none px-3 py-1 bg-zinc-800 border border-white/10 rounded-md text-xs text-white whitespace-nowrap shadow-xl z-[10000]">
                {window.title}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
