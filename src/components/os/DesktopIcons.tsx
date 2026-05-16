import { apps } from "../../data/apps";
import { useWindowStore } from "../../stores/windowStore";
import { useContextMenuStore } from "../../stores/contextMenuStore";
import { useDesktopStore } from "../../stores/desktopStore";
import { ExternalLink, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState, useRef, useMemo } from "react";
import type { AppDefinition } from "../../types/app";

const GRID_STEP_X = 112;
const GRID_STEP_Y = 126;
const PADDING = 24;

export default function DesktopIcons() {
  const openWindow = useWindowStore((state) => state.openWindow);
  const windows = useWindowStore((state) => state.windows);
  const openContextMenu = useContextMenuStore((state) => state.openContextMenu);
  const { iconPositions, setIconPosition } = useDesktopStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [gridSize, setGridSize] = useState({ rows: 0, cols: 0 });

  const desktopApps = useMemo(() => apps.filter(app => !app.hideFromDesktop), []);

  useEffect(() => {
    const updateGrid = () => {
      if (containerRef.current) {
        const height = containerRef.current.offsetHeight;
        const width = containerRef.current.offsetWidth;
        setGridSize({
          rows: Math.max(1, Math.floor((height - PADDING * 2) / GRID_STEP_Y)),
          cols: Math.max(1, Math.floor((width - PADDING * 2) / GRID_STEP_X))
        });
      }
    };

    updateGrid();
    window.addEventListener("resize", updateGrid);
    return () => window.removeEventListener("resize", updateGrid);
  }, []);

  const getAppPosition = (appId: string, index: number) => {
    if (iconPositions[appId]) return iconPositions[appId];

    // Default column-first layout
    const col = Math.floor(index / gridSize.rows);
    const row = index % gridSize.rows;
    return { x: col * GRID_STEP_X, y: row * GRID_STEP_Y };
  };

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
      minSize: { width: 420, height: 300 },
    });
  };

  const handleContextMenu = (e: React.MouseEvent, app: AppDefinition) => {
    e.preventDefault();
    e.stopPropagation();
    openContextMenu(e.clientX, e.clientY, [
      { label: `Open ${app.title}`, icon: ExternalLink, action: () => handleOpenApp(app) },
      { label: "Properties", icon: Info, action: () => console.log(`Properties for ${app.title}`) },
    ]);
  };

  if (gridSize.rows === 0) return <div ref={containerRef} className="h-full w-full" />;

  return (
    <div ref={containerRef} className="relative h-full w-full p-6 pointer-events-none overflow-hidden">
      {desktopApps.map((app, index) => {
        const Icon = app.icon;
        const currentPos = getAppPosition(app.id, index);
        const iconColors: Record<string, string> = {
          about: "from-blue-500 to-blue-600",
          projects: "from-amber-400 to-orange-500",
          terminal: "from-zinc-700 to-zinc-900",
          settings: "from-slate-400 to-slate-600",
          music: "from-purple-500 to-indigo-600",
        };

        return (
          <motion.button
            key={app.id}
            drag
            dragConstraints={containerRef}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              let nx = currentPos.x + info.offset.x;
              let ny = currentPos.y + info.offset.y;

              let sx = Math.round(nx / GRID_STEP_X) * GRID_STEP_X;
              let sy = Math.round(ny / GRID_STEP_Y) * GRID_STEP_Y;

              // Collision & Bounds
              sx = Math.max(0, Math.min(sx, (gridSize.cols - 1) * GRID_STEP_X));
              sy = Math.max(0, Math.min(sy, (gridSize.rows - 1) * GRID_STEP_Y));

              const isOccupied = desktopApps.some((other, i) =>
                other.id !== app.id && getAppPosition(other.id, i).x === sx && getAppPosition(other.id, i).y === sy
              );

              if (!isOccupied) setIconPosition(app.id, { x: sx, y: sy });
            }}
            animate={{ x: currentPos.x, y: currentPos.y }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onDoubleClick={() => handleOpenApp(app)}
            onContextMenu={(e) => handleContextMenu(e, app)}
            className="absolute top-6 left-6 pointer-events-auto group flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-2xl hover:bg-white/10 transition-colors cursor-grab active:cursor-grabbing z-10"
          >
            <div className={`relative flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-gradient-to-br ${iconColors[app.id] || "from-zinc-700 to-zinc-800"} shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
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
  );
}
