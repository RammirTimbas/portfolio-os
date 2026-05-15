import { Terminal, User, FileText, Settings } from "lucide-react";
import AboutApp from "../components/apps/AboutApp";
import type { AppDefinition } from "../types/app";

// Temporary placeholder components for new apps
const ProjectsApp = () => <div className="p-6 text-white"><h1>Projects</h1><p className="text-zinc-400 mt-2">Showcasing my work...</p></div>;
const SettingsApp = () => <div className="p-6 text-white"><h1>Settings</h1><p className="text-zinc-400 mt-2">System preferences...</p></div>;

export const apps: AppDefinition[] = [
  {
    id: "about",
    title: "About Me",
    icon: User,
    component: AboutApp,
    defaultSize: { width: 700, height: 500 },
  },
  {
    id: "projects",
    title: "Projects",
    icon: FileText,
    component: ProjectsApp,
    defaultSize: { width: 800, height: 600 },
  },
  {
    id: "terminal",
    title: "Terminal",
    icon: Terminal,
    component: () => <div className="p-4 font-mono text-green-400 bg-black h-full">user@portfolio:~$ _</div>,
    defaultSize: { width: 600, height: 400 },
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    component: SettingsApp,
    defaultSize: { width: 700, height: 500 },
  },
];
