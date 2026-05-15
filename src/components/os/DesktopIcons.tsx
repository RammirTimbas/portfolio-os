import { apps } from "../../data/apps";
import { useWindowStore } from "../../stores/windowStore";
import { useContextMenuStore } from "../../stores/contextMenuStore";
import { ExternalLink, Info } from "lucide-react";
import type { AppDefinition } from "../../types/app";

export default function DesktopIcons() {
  const openWindow = useWindowStore((state) => state.openWindow);
  const windows = useWindowStore((state) => state.windows);
  const openContextMenu = useContextMenuStore((state) => state.openContextMenu);

  const handleOpenApp = (app: AppDefinition) => {
    openWindow({
      id: crypto.randomUUID(),
      appId: app.id,
      title: app.title,
      position: {
        x: window.innerWidth / 2 - app.defaultSize.width / 2 + (windows.length * 20),
        y: window.innerHeight / 2 - app.defaultSize.height / 2 + (windows.length * 20),
      },
      isMaximized: false,
      size: app.defaultSize,
      minSize: {
        width: 420,
        height: 300,
      },
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
        action: () => console.log(`Properties for ${app.title}`),
      },
    ]);
  };

  return (
    <div className="grid grid-flow-col grid-rows-[repeat(auto-fill,100px)] gap-2 p-4 h-full pointer-events-none">
      {apps.map((app) => {
        const Icon = app.icon;
        const iconColors: Record<string, string> = {
          about: "from-blue-500 to-blue-600",
          projects: "from-amber-400 to-orange-500",
          terminal: "from-zinc-700 to-zinc-900",
          settings: "from-slate-400 to-slate-600",
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
              gap-1
              rounded-lg
              hover:bg-white/10
              transition-colors
              focus:outline-none
              focus:bg-white/10
            "
          >
            <div
              className={`
                relative
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                ${iconColors[app.id] || "from-zinc-700 to-zinc-800"}
                shadow-lg
                transition-transform
                group-hover:scale-105
                group-active:scale-95
              `}
            >
              <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Icon className="text-white drop-shadow-md" size={32} strokeWidth={1.5} />
            </div>

            <span className="text-[11px] font-medium text-white drop-shadow-lg text-center px-1 truncate w-full">
              {app.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}
