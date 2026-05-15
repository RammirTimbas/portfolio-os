import type { Project } from "../../../types/project";
import ProjectCard from "./ProjectCard";
import { LayoutGrid } from "lucide-react";

interface Props {
  projects: Project[];
  selectedProjectId: string | null;
  viewMode: "grid" | "list";
  onSelect: (id: string) => void;
  onLaunch: (project: Project) => void;
}

export default function ProjectGrid({ projects, selectedProjectId, viewMode, onSelect, onLaunch }: Props) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-zinc-700 h-full">
        <LayoutGrid size={32} className="mb-2 opacity-5" />
        <p className="text-[10px] font-mono uppercase tracking-widest">Directory Empty</p>
      </div>
    );
  }

  return (
    <div className={`p-3 space-y-1 ${viewMode === "grid" ? "grid grid-cols-1 gap-2 space-y-0" : ""}`}>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          isSelected={selectedProjectId === project.id}
          viewMode={viewMode}
          onClick={() => onSelect(project.id)}
          onLaunch={onLaunch}
        />
      ))}
    </div>
  );
}
