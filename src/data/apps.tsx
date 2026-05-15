import { Terminal, Layout, Settings, FolderKanban, Info, ShieldCheck, Music } from "lucide-react";
import AboutApp from "../components/apps/AboutApp";
import WorkspaceApp from "../components/apps/WorkspaceApp";
import ProjectViewer from "../components/apps/workspace/ProjectViewer";
import ProjectProperties from "../components/apps/workspace/ProjectProperties";
import SettingsApp from "../components/apps/SettingsApp";
import TerminalApp from "../components/apps/TerminalApp";
import MusicApp from "../components/apps/MusicApp";
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
    defaultMaximized: true,
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
    component: TerminalApp,
    defaultSize: { width: 600, height: 400 },
  },
  {
    id: "music",
    title: "Music",
    icon: Music,
    component: MusicApp,
    defaultSize: { width: 900, height: 600 },
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    component: SettingsApp,
    defaultSize: { width: 800, height: 600 },
  },
];
