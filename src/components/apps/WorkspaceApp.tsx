import { useState } from "react";
import WorkspaceSidebar from "./workspace/WorkspaceSidebar";
import ProjectGrid from "./workspace/ProjectGrid";
import ProjectDetails from "./workspace/ProjectDetails";
import WorkspaceTerminal from "./workspace/WorkspaceTerminal";
import { useProjectSelection } from "../../hooks/useProjectSelection";
import type { ProjectCategory, Project } from "../../types/project";
import {
  Search,
  ChevronRight,
  LayoutGrid,
  RotateCcw,
  Plus,
  ArrowLeft,
  ArrowRight,
  List,
  Share2,
  Copy,
  Terminal,
  Layout,
  X,
  Folder,
  ArrowUp,
  MoreHorizontal,
  RefreshCw,
  History
} from "lucide-react";
import { useWindowStore } from "../../stores/windowStore";

export default function WorkspaceApp() {
  const {
    activeCategory,
    changeCategory,
    searchQuery,
    setSearchQuery,
    filteredProjects,
    selectedProject,
    selectProject,
  } = useProjectSelection();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [interfaceMode, setInterfaceMode] = useState<"gui" | "cli">("gui");
  const openWindow = useWindowStore((state) => state.openWindow);

  const handleLaunchProject = (project: Project) => {
    openWindow({
      id: `window-${project.id}-${crypto.randomUUID().slice(0, 4)}`,
      appId: "project-viewer",
      title: `${project.title} - Artifact Viewer`,
      position: {
        x: window.innerWidth / 2 - 450 + (Math.random() * 60),
        y: window.innerHeight / 2 - 350 + (Math.random() * 60),
      },
      isMaximized: false,
      size: { width: 900, height: 700 },
      minSize: { width: 600, height: 500 },
      params: { project },
    });
  };

  return (
    <div className="flex h-full w-full flex-col bg-zinc-950 text-white selection:bg-blue-500/30 overflow-hidden">
      {/* Windows 11 Tabs Bar */}
      <div className="flex h-10 items-center bg-black/40 px-2 pt-1 gap-1 justify-between shrink-0">
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-t-lg border-x border-t border-white/10 min-w-[160px] relative group shadow-sm">
            <Folder size={12} className="text-blue-400" />
            <span className="text-[11px] font-medium truncate">
              {interfaceMode === 'cli' ? 'Workspace Terminal' : `Workspace / ${activeCategory}`}
            </span>
            <X size={10} className="ml-auto text-zinc-500 hover:text-white transition-colors cursor-pointer" />
            <div className="absolute -bottom-[1px] left-0 right-0 h-[1px] bg-zinc-900" />
          </div>
          <button className="p-1.5 rounded-md hover:bg-white/5 transition-colors">
            <Plus size={14} className="text-zinc-400" />
          </button>
        </div>

        <div className="flex items-center gap-2 pr-2">
          <div className="flex items-center rounded-lg bg-black/40 p-0.5 border border-white/5 shadow-inner">
            <button
              onClick={() => setInterfaceMode("gui")}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[9px] font-bold transition-all ${
                interfaceMode === "gui" ? "bg-blue-600 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Layout size={10} /> GUI
            </button>
            <button
              onClick={() => setInterfaceMode("cli")}
              className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[9px] font-bold transition-all ${
                interfaceMode === "cli" ? "bg-zinc-700 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Terminal size={10} /> CLI
            </button>
          </div>
        </div>
      </div>

      {interfaceMode === "cli" ? (
        <WorkspaceTerminal onRun={handleLaunchProject} />
      ) : (
        <>
          {/* Navigation & Address Bar */}
          <div className="flex h-12 items-center gap-4 border-b border-white/5 bg-zinc-900/40 px-4 shrink-0">
            <div className="flex gap-1 text-zinc-500">
              <ArrowLeft size={16} className="hover:text-white cursor-pointer transition-colors p-1" />
              <ArrowRight size={16} className="opacity-30 p-1" />
              <ArrowUp size={16} onClick={() => changeCategory('all')} className="hover:text-white cursor-pointer transition-colors p-1" />
              <RefreshCw size={16} onClick={() => window.location.reload()} className="hover:text-white cursor-pointer transition-colors p-1 ml-1" />
            </div>

            <div className="flex-1 flex items-center gap-1 bg-zinc-900/80 border border-white/10 rounded-md px-3 py-1.5 text-zinc-400 overflow-hidden shadow-inner group focus-within:border-blue-500/50 transition-all">
              <Folder size={12} className="text-blue-400 shrink-0" />
              <div className="flex items-center gap-1 truncate text-[11px]">
                <span onClick={() => changeCategory('all')} className="hover:text-zinc-200 cursor-pointer">This PC</span>
                <ChevronRight size={10} className="opacity-40" />
                <span onClick={() => changeCategory('all')} className="hover:text-zinc-200 cursor-pointer">System (C:)</span>
                <ChevronRight size={10} className="opacity-40" />
                <span className="text-zinc-500">Users</span>
                <ChevronRight size={10} className="opacity-40" />
                <span onClick={() => changeCategory('all')} className="hover:text-zinc-200 cursor-pointer">rammir</span>
                <ChevronRight size={10} className="opacity-40" />
                <span className="text-zinc-200 font-semibold capitalize">{activeCategory}</span>
              </div>
            </div>

            <div className="relative w-72 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors" size={14} />
              <input
                type="text"
                placeholder="Search builds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md bg-zinc-900/50 border border-white/5 py-1.5 pl-9 pr-4 text-xs text-white placeholder:text-zinc-600 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Command Bar */}
          <div className="flex h-11 items-center justify-between border-b border-white/5 bg-zinc-900/20 px-4 shrink-0">
            <div className="flex items-center gap-1">
              <button className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[11px] font-medium text-zinc-300 hover:bg-white/5 transition-colors group">
                <Plus size={14} className="text-blue-400 group-hover:scale-110 transition-transform" /> New
              </button>
              <div className="mx-1 h-4 w-px bg-white/10" />
              <button
                onClick={() => {
                  if (selectedProject) {
                    navigator.clipboard.writeText(`C:/Workspace/${selectedProject.category}/${selectedProject.id}`);
                  }
                }}
                className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors ${selectedProject ? "text-zinc-300 hover:bg-white/5" : "text-zinc-600 cursor-not-allowed"}`}
              >
                <Copy size={14} /> Copy Path
              </button>
              <button className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors ${selectedProject ? "text-zinc-300 hover:bg-white/5" : "text-zinc-600 cursor-not-allowed"}`}>
                <Share2 size={14} /> Share
              </button>
              <div className="mx-1 h-4 w-px bg-white/10" />
              <div className="flex items-center bg-black/20 rounded-md p-0.5 border border-white/5">
                <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded transition-all ${viewMode === "grid" ? "bg-white/10 text-white" : "text-zinc-500"}`}><LayoutGrid size={14} /></button>
                <button onClick={() => setViewMode("list")} className={`p-1.5 rounded transition-all ${viewMode === "list" ? "bg-white/10 text-white" : "text-zinc-500"}`}><List size={14} /></button>
              </div>
              <button className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors ml-1">
                <MoreHorizontal size={14} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                <History size={12} />
                <span>Last Modified: Today</span>
              </div>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <WorkspaceSidebar activeCategory={activeCategory as any} onCategoryChange={changeCategory as any} />

            <div className="flex w-80 flex-col border-r border-white/5 bg-black/10">
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-zinc-950/20">
                <ProjectGrid
                  projects={filteredProjects}
                  selectedProjectId={selectedProject?.id || null}
                  viewMode={viewMode}
                  onSelect={selectProject}
                  onLaunch={handleLaunchProject}
                />
              </div>
            </div>

            <div className="flex-1 bg-zinc-950/50 relative flex flex-col">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1e1e1e,transparent_40%)] pointer-events-none opacity-50" />
              <ProjectDetails project={selectedProject} onLaunch={handleLaunchProject} />
            </div>
          </div>

          {/* Footer Status Bar */}
          <div className="flex h-7 items-center justify-between border-t border-white/5 bg-zinc-900/80 px-4 text-[9px] font-mono text-zinc-500 shrink-0 select-none">
            <div className="flex gap-4">
              <span className="hover:text-zinc-300 transition-colors">{filteredProjects.length} items</span>
              <span className="hover:text-zinc-300 transition-colors">{selectedProject ? '1 item selected' : '0 items selected'}</span>
            </div>
            <div className="flex items-center gap-4">
               <span>Local Storage: 100% Sync</span>
               <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="font-bold tracking-tighter">OS_CONNECTED</span>
               </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
