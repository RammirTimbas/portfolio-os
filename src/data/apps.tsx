import { Terminal, User, Layout, Settings, FolderKanban, Info, ShieldCheck } from "lucide-react";
import AboutApp from "../components/apps/AboutApp";
import WorkspaceApp from "../components/apps/WorkspaceApp";
import ProjectViewer from "../components/apps/workspace/ProjectViewer";
import ProjectProperties from "../components/apps/workspace/ProjectProperties";
import SettingsApp from "../components/apps/SettingsApp";
import type { AppDefinition } from "../types/app";

export const apps: AppDefinition[] = [
  {
    id: "about",
    title: "Identity",
    icon: ShieldCheck,
    component: AboutApp,
    defaultSize: { width: 700, height: 500 },
  },
  {
    id: "projects",
    title: "Workspace",
    icon: Layout,
    component: WorkspaceApp,
    defaultSize: { width: 1000, height: 700 },
  },
  {
    id: "project-viewer",
    title: "Artifact Viewer",
    icon: FolderKanban,
    component: ProjectViewer,
    defaultSize: { width: 900, height: 700 },
    hideFromDesktop: true,
  },
  {
    id: "project-properties",
    title: "Properties",
    icon: Info,
    component: ProjectProperties,
    defaultSize: { width: 350, height: 420 },
    hideFromDesktop: true,
  },
  {
    id: "terminal",
    title: "Terminal",
    icon: Terminal,
    component: () => (
      <div className="p-4 font-mono text-green-400 bg-black h-full overflow-hidden select-none">
        <div className="mb-2 text-xs text-zinc-500">Identity CLI [Version 1.0.42]</div>
        <div className="flex gap-2">
          <span className="text-emerald-500 font-bold">visitor@identity:~$</span>
          <span className="animate-pulse">_</span>
        </div>
      </div>
    ),
    defaultSize: { width: 600, height: 400 },
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    component: SettingsApp,
    defaultSize: { width: 800, height: 600 },
  },
];
