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
  RefreshCw,
  ChevronLeft
} from "lucide-react";
import { useProjectStore } from "../../stores/projectStore";
import { useWindowStore } from "../../stores/windowStore";
import type { Project } from "../../types/project";

interface Props {
  isMobile?: boolean;
}

export default function WorkspaceApp({ isMobile }: Props) {
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
      openWindow({
        id: crypto.randomUUID(),
        appId: "browser",
        title: `Browser - ${project.title}`,
        position: {
          x: window.innerWidth / 2 - 512 + (Math.random() * 20),
          y: window.innerHeight / 2 - 384 + (Math.random() * 20),
        },
        size: { width: 1024, height: 768 },
        params: { url: project.demo, title: project.title }
      });
    } else if (project.github) {
      window.open(project.github, "_blank");
    }
  }, [openWindow]);

  // Mobile navigation state: If a project is selected, show details. Otherwise, show grid.
  const showMobileDetails = isMobile && selectedProject !== null;

  return (
    <div className="flex h-full w-full bg-zinc-950 text-white overflow-hidden select-none">
      {/* Sidebar: Hidden on mobile */}
      {!isMobile && (
        <WorkspaceSidebar
          activeCategory={activeCategory}
          onCategoryChange={changeCategory}
        />
      )}

      {/* Main Container */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex h-12 items-center justify-between border-b border-white/5 bg-black/20 px-4 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            {showMobileDetails && (
              <button
                onClick={() => selectProject(null)}
                className="p-2 -ml-2 text-blue-400 hover:bg-white/5 rounded-full"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            <div className={`relative ${isMobile ? 'flex-1' : 'w-64'}`}>
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
              <input
                type="text"
                placeholder="Search artifacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-md bg-white/5 border border-white/5 py-1.5 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
              />
            </div>
          </div>

          {!isMobile && (
            <div className="flex items-center gap-1">
              <button onClick={() => fetchProjects()} className="p-2 text-zinc-500 hover:text-white rounded-md"><RefreshCw size={16} /></button>
              <div className="h-4 w-px bg-white/10 mx-1" />
              <button onClick={() => setViewMode("grid")} className={`p-2 rounded-md ${viewMode === "grid" ? "text-blue-400" : "text-zinc-500"}`}><LayoutGrid size={16} /></button>
              <button onClick={() => setViewMode("list")} className={`p-2 rounded-md ${viewMode === "list" ? "text-blue-400" : "text-zinc-500"}`}><List size={16} /></button>
              <div className="h-4 w-px bg-white/10 mx-1" />
              <button onClick={() => setShowTerminal(!showTerminal)} className={`p-2 rounded-md ${showTerminal ? "text-emerald-400" : "text-zinc-500"}`}><TerminalIcon size={16} /></button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex flex-1 min-h-0 overflow-hidden relative">
          {/* Artifact Browser: Hide on mobile if details are shown */}
          <div className={`${isMobile && showMobileDetails ? 'hidden' : 'flex'} flex-1 md:w-[360px] md:flex-none border-r border-white/5 flex flex-col bg-black/10`}>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {isLoading && filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-500">
                  <Loader2 size={32} className="animate-spin" />
                  <p className="text-[10px] font-mono uppercase tracking-widest">Synchronizing...</p>
                </div>
              ) : (
                <ProjectGrid
                  projects={filteredProjects}
                  selectedProjectId={selectedProject?.id || null}
                  viewMode={isMobile ? "grid" : viewMode}
                  onSelect={selectProject}
                  onLaunch={handleLaunchProject}
                />
              )}
            </div>
          </div>

          {/* Details Section: Take full screen on mobile when selected */}
          <div className={`${isMobile && !showMobileDetails ? 'hidden' : 'flex'} flex-1 flex-col min-w-0 bg-zinc-900/10`}>
            <div className="flex-1 overflow-hidden">
              {selectedProject && (
                <ProjectDetails
                  project={selectedProject}
                  onLaunch={handleLaunchProject}
                />
              )}
            </div>

            {!isMobile && showTerminal && (
              <div className="h-72 border-t border-white/5 animate-in slide-in-from-bottom duration-300">
                <WorkspaceTerminal onRun={handleLaunchProject} />
              </div>
            )}
          </div>
        </div>

        {/* Status Bar: Simplified for mobile */}
        <div className="h-6 border-t border-white/5 bg-black/40 px-3 flex items-center justify-between text-[10px] text-zinc-500 font-medium shrink-0">
          <div className="flex items-center gap-4">
            <span>{filteredProjects.length} Artifacts</span>
            {!isMobile && (
              <div className="flex items-center gap-1.5">
                <div className={`h-1.5 w-1.5 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="uppercase tracking-widest">Connection Stable</span>
              </div>
            )}
          </div>
          {!isMobile && (
            <div className="flex items-center gap-3">
               <span className="uppercase tracking-tighter opacity-50">Localhost:3000</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
