import { apps } from "../../data/apps";
import { useWindowStore } from "../../stores/windowStore";
import { useContextMenuStore } from "../../stores/contextMenuStore";
import { ExternalLink, Info } from "lucide-react";
import type { AppDefinition } from "../../types/app";

export default function DesktopIcons() {
  const openWindow = useWindowStore((state) => state.openWindow);
  const windows = useWindowStore((state) => state.windows);
  const openContextMenu = useContextMenuStore((state) => state.openContextMenu);

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
    <div className="grid grid-flow-col grid-rows-[repeat(auto-fill,110px)] gap-4 p-6 h-full pb-32 pointer-events-none">
      {desktopApps.map((app) => {
        const Icon = app.icon;
        const iconColors: Record<string, string> = {
          about: "from-blue-500 to-blue-600",
          projects: "from-amber-400 to-orange-500",
          terminal: "from-zinc-700 to-zinc-900",
          settings: "from-slate-400 to-slate-600",
          music: "from-purple-500 to-indigo-600",
        };

        return (
          <button
            key={app.id}
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
              transition-all
              duration-300
              focus:outline-none
              focus:bg-white/10
              active:scale-95
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
          </button>
        );
      })}
    </div>
  );
}
