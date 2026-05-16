import { useState, useCallback } from "react";
import { useProjectSelection } from "../../hooks/useProjectSelection";
import ProjectGrid from "./workspace/ProjectGrid";
import ProjectDetails from "./workspace/ProjectDetails";
import WorkspaceSidebar from "./workspace/WorkspaceSidebar";
import WorkspaceTerminal from "./workspace/WorkspaceTerminal";
import {
  Search,
  LayoutGrid,
  List,
  Terminal as TerminalIcon,
  Loader2,
  Code2,
  RefreshCw
} from "lucide-react";
import { useProjectStore } from "../../stores/projectStore";
import { useWindowStore } from "../../stores/windowStore";
import type { Project } from "../../types/project";

export default function WorkspaceApp() {
  const {
    activeCategory,
    changeCategory,
    searchQuery,
    setSearchQuery,
    filteredProjects,
    selectedProject,
    selectProject,
    isLoading
  } = useProjectSelection();

  const { fetchProjects } = useProjectStore();
  const openWindow = useWindowStore((state) => state.openWindow);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showTerminal, setShowTerminal] = useState(false);

  const handleLaunchProject = useCallback((project: Project) => {
    if (project.demo) {
      window.open(project.demo, "_blank");
    } else if (project.github) {
      window.open(project.github, "_blank");
    }
  }, []);

  return (
    <div className="flex h-full w-full bg-zinc-950 text-white overflow-hidden select-none">
      {/* 1. Left Section: Sidebar (240px) */}
      <WorkspaceSidebar
        activeCategory={activeCategory}
        onCategoryChange={changeCategory}
      />

      {/* Main Container */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex h-12 items-center justify-between border-b border-white/5 bg-black/20 px-4 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
              <input
                type="text"
                placeholder="Search artifacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md bg-white/5 border border-white/5 py-1.5 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
              />
            </div>

            {isLoading && (
              <div className="flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest animate-pulse">
                <Loader2 size={12} className="animate-spin" />
                Syncing with Core...
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => fetchProjects()}
              className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-md transition-colors mr-2"
              title="Refresh from GitHub"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            </button>
            <div className="h-4 w-px bg-white/10 mx-1" />
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "text-blue-400 bg-blue-500/10" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "text-blue-400 bg-blue-500/10" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}
            >
              <List size={16} />
            </button>
            <div className="h-4 w-px bg-white/10 mx-1" />
            <button
              onClick={() => setShowTerminal(!showTerminal)}
              className={`p-2 rounded-md transition-colors ${showTerminal ? "text-emerald-400 bg-emerald-500/10" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}
            >
              <TerminalIcon size={16} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* 2. Middle Section: Artifact Browser (360px) */}
          <div className="w-[360px] border-r border-white/5 flex flex-col shrink-0 bg-black/10">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {isLoading && filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-500">
                  <Code2 size={48} className="opacity-10 animate-bounce" />
                  <p className="text-xs font-mono uppercase tracking-[0.2em]">Synchronizing...</p>
                </div>
              ) : (
                <ProjectGrid
                  projects={filteredProjects}
                  selectedProjectId={selectedProject?.id || null}
                  viewMode={viewMode}
                  onSelect={selectProject}
                  onLaunch={handleLaunchProject}
                />
              )}
            </div>
          </div>

          {/* 3. Right Section: Details & Telemetry (Biggest Space - flex-1) */}
          <div className="flex-1 flex flex-col min-w-0 bg-zinc-900/10">
            <div className="flex-1 overflow-hidden">
              {selectedProject && (
                <ProjectDetails
                  project={selectedProject}
                  onLaunch={handleLaunchProject}
                />
              )}
            </div>

            {/* Terminal Drawer */}
            {showTerminal && (
              <div className="h-72 border-t border-white/5 animate-in slide-in-from-bottom duration-300">
                <WorkspaceTerminal onRun={handleLaunchProject} />
              </div>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="h-6 border-t border-white/5 bg-black/40 px-3 flex items-center justify-between text-[10px] text-zinc-500 font-medium shrink-0">
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-300 transition-colors cursor-default">{filteredProjects.length} Artifacts</span>
            <div className="flex items-center gap-1.5">
              <div className={`h-1.5 w-1.5 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'}`} />
              <span className="uppercase tracking-widest">{isLoading ? 'Syncing' : 'Connection Stable'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <span className="uppercase tracking-tighter opacity-50">Localhost:3000</span>
             <span className="uppercase tracking-tighter opacity-50">v{selectedProject?.metadata?.version || '1.0.0'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
