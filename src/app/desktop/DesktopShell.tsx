import DesktopIcons from "../../components/os/DesktopIcons";
import WindowManager from "../../components/os/WindowManager";
import Taskbar from "../../components/taskbar/Taskbar";
import ContextMenu from "../../components/os/ContextMenu";
import StartMenu from "../../components/os/StartMenu";
import WidgetManager from "../../components/os/WidgetManager";
import { useContextMenuStore } from "../../stores/contextMenuStore";
import { useWindowStore } from "../../stores/windowStore";
import { useDesktopStore } from "../../stores/desktopStore";
import { apps } from "../../data/apps";
import { useConfigStore } from "../../stores/configStore";
import { useEffect } from "react";
import {
  RefreshCw,
  Image as ImageIcon,
  Layout,
  Terminal,
  ShieldCheck,
  Settings as SettingsIcon,
  AppWindow,
  Plus,
  Clock,
  StickyNote,
  Calendar,
  CloudSun,
  Cpu
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
  const { wallpaper, setWallpaper, defaultNoteContent } = useConfigStore();
  const { addWidget } = useDesktopStore();

  useEffect(() => {
    // Fresh launch key to ensure it triggers for you
    const firstLaunchKey = "portfolio-os:initial-maximized:v10";
    if (localStorage.getItem(firstLaunchKey)) return;
    localStorage.setItem(firstLaunchKey, "1");

    const app = apps.find((a) => a.id === "projects");
    if (!app) return;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    openWindow({
      id: crypto.randomUUID(),
      appId: app.id,
      title: app.title,
      position: { x: 0, y: 0 },
      isMaximized: true,
      size: { width: screenWidth, height: screenHeight - 64 },
      minSize: { width: 420, height: 300 },
      prevSize: app.defaultSize,
      prevPosition: {
        x: Math.max(0, screenWidth / 2 - app.defaultSize.width / 2),
        y: Math.max(0, screenHeight / 2 - app.defaultSize.height / 2 - 32),
      }
    });
  }, [openWindow]);

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
        isMaximized: app.defaultMaximized ?? false,
        size: app.defaultSize,
        minSize: { width: 420, height: 300 },
        ...(app.defaultMaximized ? {
          prevSize: app.defaultSize,
          prevPosition: {
            x: window.innerWidth / 2 - app.defaultSize.width / 2,
            y: window.innerHeight / 2 - app.defaultSize.height / 2 - 32,
          }
        } : {})
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
        label: "Add Widget",
        icon: Plus,
        children: [
          {
            label: "Clock",
            icon: Clock,
            action: () => addWidget({ type: 'clock', position: { x: e.clientX, y: e.clientY } })
          },
          {
            label: "Sticky Note",
            icon: StickyNote,
            action: () => addWidget({
              type: 'sticky-note',
              position: { x: e.clientX, y: e.clientY },
              content: defaultNoteContent
            })
          },
          {
            label: "Calendar",
            icon: Calendar,
            action: () => addWidget({ type: 'calendar', position: { x: e.clientX, y: e.clientY } })
          },
          {
            label: "Weather",
            icon: CloudSun,
            action: () => addWidget({ type: 'weather', position: { x: e.clientX, y: e.clientY } })
          },
          {
            label: "Performance",
            icon: Cpu,
            action: () => addWidget({ type: 'performance', position: { x: e.clientX, y: e.clientY } })
          }
        ]
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

      <WidgetManager />

      <DesktopIcons />

      <WindowManager />

      <StartMenu />

      <Taskbar />

      <ContextMenu />
    </main>
  );
}
