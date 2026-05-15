import type { ProjectCategory } from "../../../types/project";
import {
  Star,
  Globe,
  Cpu,
  Palette,
  Briefcase,
  Layers,
  HardDrive,
  ChevronDown,
  Clock
} from "lucide-react";

interface Props {
  activeCategory: ProjectCategory | "recent";
  onCategoryChange: (category: ProjectCategory | "recent") => void;
}

export default function WorkspaceSidebar({ activeCategory, onCategoryChange }: Props) {
  const sections = [
    {
      title: "Quick Access",
      items: [
        { id: "all", label: "All Projects", icon: Star },
        { id: "recent", label: "Recent Builds", icon: Clock },
      ]
    },
    {
      title: "Workspaces",
      items: [
        { id: "web", label: "Web Apps", icon: Globe },
        { id: "api", label: "APIs & Services", icon: Cpu },
        { id: "ui", label: "UI Experiments", icon: Palette },
        { id: "freelance", label: "Freelance Work", icon: Briefcase },
        { id: "other", label: "Other Artifacts", icon: Layers },
      ]
    }
  ];

  return (
    <div className="w-60 border-r border-white/5 bg-zinc-900/30 p-2 space-y-4 shrink-0 overflow-y-auto custom-scrollbar">
      {sections.map((section, idx) => (
        <div key={idx} className="space-y-1">
          <div className="flex items-center gap-1 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            <ChevronDown size={10} />
            {section.title}
          </div>

          {section.items.map((item) => (
            <button
              key={item.id}
              onClick={() => onCategoryChange(item.id as any)}
              className={`
                flex w-full items-center gap-3 rounded-md px-3 py-2 text-[11px] transition-all
                ${activeCategory === item.id
                  ? "bg-white/10 text-white shadow-sm ring-1 ring-white/5"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"}
              `}
            >
              <item.icon size={14} className={activeCategory === item.id ? "text-blue-400" : "text-zinc-500"} />
              <span className="truncate font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      ))}

      <div className="pt-4 mt-auto">
        <div className="mx-2 rounded-xl bg-blue-600/5 border border-blue-500/10 p-3">
          <div className="flex items-center gap-2 mb-2">
            <HardDrive size={12} className="text-blue-400" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">System Storage</span>
          </div>
          <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full w-[78%] bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          </div>
          <p className="mt-1.5 text-[9px] text-zinc-600 font-mono">24.8 GB used of 32 GB</p>
        </div>
      </div>
    </div>
  );
}
