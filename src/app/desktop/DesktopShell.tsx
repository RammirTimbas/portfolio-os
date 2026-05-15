import DesktopIcons from "../../components/os/DesktopIcons";
import WindowManager from "../../components/os/WindowManager";
import Taskbar from "../../components/taskbar/Taskbar";
import ContextMenu from "../../components/os/ContextMenu";
import { useContextMenuStore } from "../../stores/contextMenuStore";
import { useWindowStore } from "../../stores/windowStore";
import { apps } from "../../data/apps";
import { useConfigStore } from "../../stores/configStore";
import { Monitor, RefreshCw, Image as ImageIcon } from "lucide-react";

const wallpaperClasses = {
  default: "bg-[radial-gradient(circle_at_top,#27272a,transparent_60%)]",
  blue: "bg-[radial-gradient(circle_at_top,#1e3a8a,transparent_60%)]",
  green: "bg-[radial-gradient(circle_at_top,#064e3b,transparent_60%)]",
  purple: "bg-[radial-gradient(circle_at_top,#4c1d95,transparent_60%)]",
};

export default function DesktopShell() {
  const openContextMenu = useContextMenuStore((state) => state.openContextMenu);
  const openWindow = useWindowStore((state) => state.openWindow);
  const { wallpaper, setWallpaper } = useConfigStore();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();

    const menuItems = [
      {
        label: "Open Settings",
        icon: Monitor,
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
        }
      },
      {
        label: "Next Wallpaper",
        icon: ImageIcon,
        action: () => {
          const keys = Object.keys(wallpaperClasses);
          const currentIndex = keys.indexOf(wallpaper);
          const nextIndex = (currentIndex + 1) % keys.length;
          setWallpaper(keys[nextIndex]);
        }
      },
      { divider: true },
      {
        label: "Refresh",
        icon: RefreshCw,
        action: () => window.location.reload()
      }
    ];

    openContextMenu(e.clientX, e.clientY, menuItems);
  };

  return (
    <main
      className="relative h-screen w-screen overflow-hidden bg-zinc-950"
      onContextMenu={handleContextMenu}
    >
      <div className={`absolute inset-0 transition-colors duration-700 ${wallpaperClasses[wallpaper as keyof typeof wallpaperClasses] || wallpaperClasses.default}`} />

      <DesktopIcons />

      <WindowManager />

      <Taskbar />

      <ContextMenu />
    </main>
  );
}
