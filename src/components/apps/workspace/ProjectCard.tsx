import type { Project } from "../../../types/project";
import { Folder, ExternalLink, Globe, Cpu, Palette, Layers, Play, Copy, Info } from "lucide-react";
import { useContextMenuStore } from "../../../stores/contextMenuStore";
import { useWindowStore } from "../../../stores/windowStore";

interface Props {
  project: Project;
  isSelected: boolean;
  viewMode: "grid" | "list";
  onClick: () => void;
  onLaunch: (project: Project) => void;
}

export default function ProjectCard({ project, isSelected, viewMode, onClick, onLaunch }: Props) {
  const openContextMenu = useContextMenuStore((state) => state.openContextMenu);
  const openWindow = useWindowStore((state) => state.openWindow);

  const categoryIcons: Record<string, any> = {
    web: Globe,
    api: Cpu,
    ui: Palette,
    freelance: Layers,
    other: Folder,
  };

  const Icon = categoryIcons[project.category as string] || Folder;

  const handleOpenProperties = () => {
    openWindow({
      id: `props-${project.id}`,
      appId: "project-properties",
      title: `${project.title} Properties`,
      position: {
        x: window.innerWidth / 2 - 175,
        y: window.innerHeight / 2 - 200,
      },
      isMaximized: false,
      size: { width: 350, height: 450 },
      minSize: { width: 300, height: 400 },
      params: { project },
    });
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();

    openContextMenu(e.clientX, e.clientY, [
      {
        label: "Execute Module",
        icon: Play,
        action: () => onLaunch(project),
      },
      {
        label: "Copy System Path",
        icon: Copy,
        action: () => navigator.clipboard.writeText(`C:/Workspace/${project.category}/${project.id}`),
      },
      { divider: true },
      {
        label: "Properties",
        icon: Info,
        action: handleOpenProperties,
      },
    ]);
  };

  const baseClass = `
    group flex w-full items-center outline-none transition-all duration-200
    ${isSelected
      ? "bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/30"
      : "hover:bg-white/5 text-zinc-400 hover:text-zinc-200"}
  `;

  if (viewMode === "list") {
    return (
      <button
        onClick={onClick}
        onDoubleClick={() => onLaunch(project)}
        onContextMenu={handleContextMenu}
        className={`${baseClass} gap-4 rounded-md px-3 py-2 text-left`}
      >
        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded ${isSelected ? "text-blue-400" : "text-zinc-500"}`}>
          <Icon size={16} />
        </div>
        <span className="flex-1 text-[11px] font-semibold truncate">{project.title}</span>
        <div className="flex gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
          {project.stack.slice(0, 2).map((tech) => (
            <span key={tech} className="text-[9px] font-mono whitespace-nowrap">#{tech.toLowerCase()}</span>
          ))}
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      onDoubleClick={() => onLaunch(project)}
      onContextMenu={handleContextMenu}
      className={`
        group flex w-full flex-col gap-3 rounded-xl border p-4 text-left transition-all duration-300
        ${isSelected
          ? "border-blue-500/50 bg-blue-500/5 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
          : "border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.05]"}
      `}
    >
      <div className="flex items-start justify-between">
        <div className={`
          flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br transition-transform group-hover:scale-110
          ${isSelected ? "from-blue-500 to-blue-600 shadow-lg" : "from-zinc-800 to-zinc-900"}
        `}>
          <Icon size={20} className={isSelected ? "text-white" : "text-zinc-400"} />
        </div>
        {project.demo && <ExternalLink size={14} className="text-zinc-600 group-hover:text-zinc-400" />}
      </div>
      <div className="space-y-1">
        <h3 className={`text-sm font-bold tracking-tight ${isSelected ? "text-blue-400" : "text-white"}`}>{project.title}</h3>
        <p className="text-[11px] leading-relaxed text-zinc-500 line-clamp-2">{project.description}</p>
      </div>
      <div className="flex flex-wrap gap-1.5 pt-1">
        {project.stack.slice(0, 3).map((tech) => (
          <span key={tech} className="rounded-md bg-black/40 px-1.5 py-0.5 text-[9px] font-mono text-zinc-500 border border-white/5">{tech}</span>
        ))}
      </div>
    </button>
  );
}
