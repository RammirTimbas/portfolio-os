import DesktopIcons from "../../components/os/DesktopIcons";
import WindowManager from "../../components/os/WindowManager";
import Taskbar from "../../components/taskbar/Taskbar";
import ContextMenu from "../../components/os/ContextMenu";
import StartMenu from "../../components/os/StartMenu";
import { useContextMenuStore } from "../../stores/contextMenuStore";
import { useWindowStore } from "../../stores/windowStore";
import { apps } from "../../data/apps";
import { useConfigStore } from "../../stores/configStore";
import {
  Monitor,
  RefreshCw,
  Image as ImageIcon,
  Layout,
  Terminal,
  ShieldCheck,
  Settings as SettingsIcon,
  AppWindow
} from "lucide-react";

const wallpaperClasses = {
  default: "bg-[radial-gradient(circle_at_top,#27272a,transparent_60%)]",
  blue: "bg-[radial-gradient(circle_at_top,#1e3a8a,transparent_60%)]",
  green: "bg-[radial-gradient(circle_at_top,#064e3b,transparent_60%)]",
  purple: "bg-[radial-gradient(circle_at_top,#4c1d95,transparent_60%)]",
};

export default function DesktopShell() {
  const openContextMenu = useContextMenuStore((state) => state.openContextMenu);
  const { openWindow, minimizeAll } = useWindowStore();
  const { wallpaper, setWallpaper } = useConfigStore();

  const handleOpenApp = (appId: string) => {
    const app = apps.find(a => a.id === appId);
    if (app) {
      openWindow({
        id: crypto.randomUUID(),
        appId: app.id,
        title: app.title,
        position: {
          x: window.innerWidth / 2 - app.defaultSize.width / 2 + (Math.random() * 20),
          y: window.innerHeight / 2 - app.defaultSize.height / 2 + (Math.random() * 20),
        },
        isMaximized: false,
        size: app.defaultSize,
        minSize: { width: 420, height: 300 },
      });
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();

    const menuItems = [
      {
        label: "Show Desktop",
        icon: Layout,
        action: () => minimizeAll()
      },
      { divider: true },
      {
        label: "Open Workspace",
        icon: AppWindow,
        action: () => handleOpenApp("projects")
      },
      {
        label: "Open Terminal",
        icon: Terminal,
        action: () => handleOpenApp("terminal")
      },
      {
        label: "Identity Dashboard",
        icon: ShieldCheck,
        action: () => handleOpenApp("about")
      },
      { divider: true },
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
      {
        label: "Settings",
        icon: SettingsIcon,
        action: () => handleOpenApp("settings")
      },
      { divider: true },
      {
        label: "Refresh System",
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
      <div className={`absolute inset-0 transition-colors duration-1000 ${wallpaperClasses[wallpaper as keyof typeof wallpaperClasses] || wallpaperClasses.default}`} />

      <DesktopIcons />

      <WindowManager />

      <StartMenu />

      <Taskbar />

      <ContextMenu />
    </main>
  );
}
