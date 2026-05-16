import { apps } from "../../data/apps";
import { useWindowStore } from "../../stores/windowStore";
import { useContextMenuStore } from "../../stores/contextMenuStore";
import { useDesktopStore } from "../../stores/desktopStore";
import { ExternalLink, Info } from "lucide-react";
import { motion } from "framer-motion";
import type { AppDefinition } from "../../types/app";

const GRID_STEP_X = 112; // w-24 (96px) + gap-4 (16px)
const GRID_STEP_Y = 126; // row height (110px) + gap-4 (16px)

export default function DesktopIcons() {
  const openWindow = useWindowStore((state) => state.openWindow);
  const windows = useWindowStore((state) => state.windows);
  const openContextMenu = useContextMenuStore((state) => state.openContextMenu);
  const { iconPositions, setIconPosition } = useDesktopStore();

  const desktopApps = apps.filter(app => !app.hideFromDesktop);

  const handleOpenApp = (app: AppDefinition) => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    openWindow({
      id: crypto.randomUUID(),
      appId: app.id,
      title: app.title,
      position: {
        x: screenWidth / 2 - app.defaultSize.width / 2 + (windows.length * 20),
        y: screenHeight / 2 - app.defaultSize.height / 2 + (windows.length * 20),
      },
      isMaximized: app.defaultMaximized ?? false,
      size: app.defaultSize,
      minSize: {
        width: 420,
        height: 300,
      },
      ...(app.defaultMaximized ? {
        prevSize: app.defaultSize,
        prevPosition: {
          x: screenWidth / 2 - app.defaultSize.width / 2,
          y: screenHeight / 2 - app.defaultSize.height / 2 - 32,
        }
      } : {})
    });
  };

  const handleContextMenu = (e: React.MouseEvent, app: AppDefinition) => {
    e.preventDefault();
    e.stopPropagation();

    openContextMenu(e.clientX, e.clientY, [
      {
        label: `Open ${app.title}`,
        icon: ExternalLink,
        action: () => handleOpenApp(app),
      },
      {
        label: "Properties",
        icon: Info,
        action: () => {
           console.log(`Properties for ${app.title}`);
        },
      },
    ]);
  };

  return (
    <div className="relative h-full w-full p-6 pointer-events-none overflow-hidden">
      <div className="grid grid-flow-col grid-rows-[repeat(auto-fill,110px)] gap-4 h-full pb-32">
        {desktopApps.map((app) => {
          const Icon = app.icon;
          const iconColors: Record<string, string> = {
            about: "from-blue-500 to-blue-600",
            projects: "from-amber-400 to-orange-500",
            terminal: "from-zinc-700 to-zinc-900",
            settings: "from-slate-400 to-slate-600",
            music: "from-purple-500 to-indigo-600",
          };

          const position = iconPositions[app.id] || { x: 0, y: 0 };

          return (
            <motion.button
              key={app.id}
              drag
              dragMomentum={false}
              dragElastic={0.1}
              onDragEnd={(_, info) => {
                const newX = position.x + info.offset.x;
                const newY = position.y + info.offset.y;

                // Snap to grid
                const snappedX = Math.round(newX / GRID_STEP_X) * GRID_STEP_X;
                const snappedY = Math.round(newY / GRID_STEP_Y) * GRID_STEP_Y;

                setIconPosition(app.id, {
                  x: snappedX,
                  y: snappedY,
                });
              }}
              initial={false}
              animate={{
                x: position.x,
                y: position.y,
                transition: { type: "spring", stiffness: 300, damping: 30 }
              }}
              onDoubleClick={() => handleOpenApp(app)}
              onContextMenu={(e) => handleContextMenu(e, app)}
              className="
                pointer-events-auto
                group
                flex
                h-24
                w-24
                flex-col
                items-center
                justify-center
                gap-2
                rounded-2xl
                hover:bg-white/10
                transition-colors
                duration-300
                focus:outline-none
                focus:bg-white/10
                active:scale-95
                cursor-grab
                active:cursor-grabbing
                z-10
              "
            >
              <div
                className={`
                  relative
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-[1.25rem]
                  bg-gradient-to-br
                  ${iconColors[app.id] || "from-zinc-700 to-zinc-800"}
                  shadow-xl
                  transition-all
                  duration-500
                  group-hover:scale-110
                  group-hover:rotate-3
                  group-active:scale-90
                `}
              >
                <div className="absolute inset-0 bg-white/10 rounded-[1.25rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                <Icon className="text-white drop-shadow-2xl" size={32} strokeWidth={1.5} />
              </div>

              <span className="text-[11px] font-bold text-white drop-shadow-2xl text-center px-1 truncate w-full tracking-tight opacity-80 group-hover:opacity-100">
                {app.title}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
