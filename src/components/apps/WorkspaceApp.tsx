import { useState } from "react";
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
  Info,
  Loader2,
  RefreshCw
} from "lucide-react";
import { useProjectStore } from "../../stores/projectStore";

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showTerminal, setShowTerminal] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  return (
    <div className="flex h-full w-full bg-zinc-950 text-white overflow-hidden select-none">
      {/* Sidebar */}
      <WorkspaceSidebar
        activeCategory={activeCategory}
        onCategoryChange={changeCategory}
      />

      {/* Main Content Area */}
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
                Syncing with GitHub...
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
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`p-2 rounded-md transition-colors ${showDetails ? "text-blue-400 bg-blue-500/10" : "text-zinc-500 hover:text-white hover:bg-white/5"}`}
            >
              <Info size={16} />
            </button>
          </div>
        </div>

        {/* Content Split Pane */}
        <div className="flex flex-1 min-h-0 relative">
          <div className="flex flex-1 flex-col min-w-0 border-r border-white/5">
            {/* View Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-zinc-950/20">
              {isLoading && filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-500">
                  <p className="text-xs font-mono uppercase tracking-[0.2em]">Establishing Data Link...</p>
                </div>
              ) : (
                <ProjectGrid
                  projects={filteredProjects}
                  selectedProjectId={selectedProject?.id || null}
                  viewMode={viewMode}
                  onSelect={selectProject}
                  onLaunch={(p) => console.log('Launching', p.title)}
                />
              )}
            </div>

            {/* Bottom Terminal */}
            {showTerminal && (
              <div className="h-64 border-t border-white/5 animate-in slide-in-from-bottom duration-300">
                <WorkspaceTerminal onRun={(p) => console.log('Running', p.title)} />
              </div>
            )}
          </div>

          {/* Details Sidebar - Column 3, now the largest */}
          {showDetails && selectedProject && (
            <div className="flex-[2] bg-black/20 overflow-hidden animate-in slide-in-from-right duration-300">
              <ProjectDetails project={selectedProject} onLaunch={(p) => console.log('Launching', p.title)} />
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="h-6 border-t border-white/5 bg-black/40 px-3 flex items-center justify-between text-[10px] text-zinc-500 font-medium shrink-0">
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-300 transition-colors cursor-default">{filteredProjects.length} items</span>
            <div className="flex items-center gap-1.5">
              <div className={`h-1.5 w-1.5 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'}`} />
              <span className="uppercase tracking-widest">{isLoading ? 'Synchronizing' : 'Linked to GitHub'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <span className="uppercase tracking-tighter opacity-50">UTF-8</span>
             <span className="uppercase tracking-tighter opacity-50">Identity Protocol v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
