import { apps } from "../../data/apps";
import { useWindowStore } from "../../stores/windowStore";
import { useContextMenuStore } from "../../stores/contextMenuStore";
import { useShellStore } from "../../stores/shellStore";
import { useConfigStore } from "../../stores/configStore";
import { motion } from "framer-motion";
import {
  Layout,
  Settings,
  Wifi,
  Volume2,
  Battery,
  ChevronUp
} from "lucide-react";
import { useState, useEffect } from "react";

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
  const { taskbarAlignment, showSeconds, transparency } = useConfigStore();
  const openContextMenu = useContextMenuStore((state) => state.openContextMenu);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    if (showSeconds) {
      options.second = '2-digit';
    }
    return date.toLocaleTimeString([], options);
  };

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

  const appDockContent = (
    <div className="flex items-center gap-1">
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

      <div className="mx-1 h-6 w-px shrink-0 bg-white/10" />

      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
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
            music: "text-purple-400",
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

              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none px-3 py-1 bg-zinc-800 border border-white/10 rounded-md text-xs text-white whitespace-nowrap shadow-xl z-[10000]">
                {window.title}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      onContextMenu={handleTaskbarContextMenu}
      className={`
        fixed
        bottom-4
        left-4
        right-4
        z-[9999]
        grid
        grid-cols-[1fr_auto_1fr]
        h-14
        items-center
        rounded-2xl
        border
        border-white/10
        px-2
        py-1
        shadow-2xl
        transition-all
        duration-500
        ${transparency ? "bg-zinc-900/40 backdrop-blur-2xl" : "bg-zinc-900"}
      `}
    >
      {/* 1. Left Section */}
      <div className="flex items-center min-w-0 h-full">
        {taskbarAlignment === 'left' && appDockContent}
      </div>

      {/* 2. Center Section */}
      <div className="flex items-center justify-center min-w-0 h-full px-4 overflow-hidden">
        {taskbarAlignment === 'center' && (
          <div className="max-w-full overflow-hidden">
             {appDockContent}
          </div>
        )}
      </div>

      {/* 3. Right Section */}
      <div className="flex items-center justify-end min-w-fit h-full">
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors cursor-default">
             <ChevronUp size={14} className="text-zinc-500" />
             <div className="flex items-center gap-2 text-zinc-400">
               <Wifi size={14} />
               <Volume2 size={14} />
               <Battery size={14} />
             </div>
          </div>

          <div className="flex flex-col items-end justify-center px-3 py-1 rounded-lg hover:bg-white/5 transition-colors cursor-default select-none border-l border-white/5 ml-1">
            <span className="text-[11px] font-bold text-zinc-200 leading-none">
              {formatTime(time)}
            </span>
            <span className="text-[9px] text-zinc-500 font-medium mt-0.5">
              {time.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div
            className="w-1.5 h-6 border-l border-white/10 ml-1 hover:bg-white/5 transition-colors cursor-pointer"
            onClick={() => minimizeAll()}
            title="Show Desktop"
          />
        </div>
      </div>
    </div>
  );
}
