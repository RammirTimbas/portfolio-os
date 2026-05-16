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
  RefreshCw,
  ChevronLeft,
  Filter
} from "lucide-react";
import { useProjectStore } from "../../stores/projectStore";
import { useWindowStore } from "../../stores/windowStore";
import type { Project, ProjectCategory } from "../../types/project";

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
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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
        isMaximized: false,
        minSize: { width: 400, height: 300 },
        params: { url: project.demo, title: project.title }
      });
    } else if (project.github) {
      window.open(project.github, "_blank");
    }
  }, [openWindow]);

  const categories: { id: ProjectCategory | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "web", label: "Web" },
    { id: "api", label: "APIs" },
    { id: "ui", label: "UI" },
    { id: "freelance", label: "Freelance" },
    { id: "other", label: "Other" },
  ];

  const showMobileDetails = isMobile && selectedProject !== null;

  return (
    <div className="flex h-full w-full bg-zinc-950 text-white overflow-hidden select-none">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <WorkspaceSidebar
          activeCategory={activeCategory}
          onCategoryChange={changeCategory}
        />
      )}

      {/* Main Container */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile/Desktop Header */}
        <div className="flex h-14 items-center justify-between border-b border-white/5 bg-black/40 px-4 shrink-0 backdrop-blur-md">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {showMobileDetails ? (
              <button
                onClick={() => selectProject(null)}
                className="flex items-center gap-2 text-blue-400 font-bold text-sm"
              >
                <ChevronLeft size={20} />
                <span>Back</span>
              </button>
            ) : (
              <div className={`relative flex-1 max-w-md`}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input
                  type="text"
                  placeholder="Search artifacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/5 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-zinc-600"
                />
              </div>
            )}
          </div>

          {!isMobile ? (
            <div className="flex items-center gap-1">
              <button onClick={() => fetchProjects()} className="p-2 text-zinc-500 hover:text-white rounded-md"><RefreshCw size={16} /></button>
              <div className="h-4 w-px bg-white/10 mx-1" />
              <button onClick={() => setViewMode("grid")} className={`p-2 rounded-md ${viewMode === "grid" ? "text-blue-400" : "text-zinc-500"}`}><LayoutGrid size={16} /></button>
              <button onClick={() => setViewMode("list")} className={`p-2 rounded-md ${viewMode === "list" ? "text-blue-400" : "text-zinc-500"}`}><List size={16} /></button>
              <div className="h-4 w-px bg-white/10 mx-1" />
              <button onClick={() => setShowTerminal(!showTerminal)} className={`p-2 rounded-md ${showTerminal ? "text-emerald-400" : "text-zinc-500"}`}><TerminalIcon size={16} /></button>
            </div>
          ) : !showMobileDetails && (
             <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={`ml-2 p-2 rounded-xl border transition-colors ${showMobileFilters ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/5 text-zinc-400'}`}
             >
               <Filter size={18} />
             </button>
          )}
        </div>

        {/* Mobile Category Strip */}
        {isMobile && !showMobileDetails && showMobileFilters && (
          <div className="flex items-center gap-2 p-3 overflow-x-auto no-scrollbar border-b border-white/5 bg-black/20 animate-in slide-in-from-top duration-200">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => changeCategory(cat.id as any)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all border ${
                  activeCategory === cat.id
                    ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20"
                    : "bg-white/5 border-white/5 text-zinc-500"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Content Area */}
        <div className="flex flex-1 min-h-0 overflow-hidden relative">
          {/* Artifact Browser */}
          <div className={`${isMobile && showMobileDetails ? 'hidden' : 'flex'} flex-1 md:w-[380px] md:flex-none border-r border-white/5 flex flex-col bg-black/10`}>
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-20 md:pb-0">
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

          {/* Details Section */}
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

        {/* Status Bar */}
        <div className="h-8 border-t border-white/5 bg-black/40 px-4 flex items-center justify-between text-[10px] text-zinc-500 font-medium shrink-0">
          <div className="flex items-center gap-4">
            <span className="font-bold">{filteredProjects.length} ARTIFACTS FOUND</span>
            {!isMobile && (
              <div className="flex items-center gap-1.5">
                <div className={`h-1.5 w-1.5 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'}`} />
                <span className="uppercase tracking-widest">{isLoading ? 'Syncing' : 'Connected'}</span>
              </div>
            )}
          </div>
          {isMobile && !showMobileDetails && (
            <div className="uppercase tracking-widest text-[9px] opacity-40">Scroll to explore</div>
          )}
          {!isMobile && (
            <div className="flex items-center gap-3">
               <span className="uppercase tracking-tighter opacity-50">Localhost:3000</span>
               <span className="uppercase tracking-tighter opacity-50">v{selectedProject?.metadata?.version || '2.4.0'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
