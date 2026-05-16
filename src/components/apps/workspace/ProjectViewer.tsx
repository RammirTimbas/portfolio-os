import type { Project } from "../../../types/project";
import { ExternalLink, Code2, Globe, Shield, Info, Package, Image as ImageIcon, GitBranch } from "lucide-react";
import ProjectSlideshow from "./ProjectSlideshow";
import { useWindowStore } from "../../../stores/windowStore";

interface Props {
  params?: { project: Project };
  isMobile?: boolean;
}

export default function ProjectViewer({ params, isMobile }: Props) {
  const project = params?.project;
  const openWindow = useWindowStore((state) => state.openWindow);

  if (!project) return null;

  const allImages = [
    ...(project.image ? [project.image] : []),
    ...(project.images || [])
  ];

  const handleLaunchDemo = (e: React.MouseEvent) => {
    if (project.demo) {
      e.preventDefault();
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
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-zinc-950 text-white selection:bg-blue-500/30">
      {/* Header Status Bar - Hidden on mobile as MobileShell provides a header */}
      {!isMobile && (
        <div className="flex items-center justify-between border-b border-white/5 bg-zinc-900/50 px-6 py-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400">
              <Globe size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">{project.title}</h2>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">System Artifact: {project.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
             <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold border ${
               project.status === 'completed'
                 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                 : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
             }`}>
               <div className={`h-1 w-1 rounded-full ${project.status === 'completed' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
               {project.status.toUpperCase()}
             </span>
          </div>
        </div>
      )}

      <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-4' : 'p-8'} custom-scrollbar`}>
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-10">
          {/* Main Content Grid: 1fr | 1fr | 2fr */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_2fr] gap-6 md:gap-10 items-start">

            {/* Column 1: Overview & Actions */}
            <div className="space-y-6 md:space-y-8">
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-white">
                  <Info size={16} className="text-blue-400" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Documentation</h3>
                </div>
                <div className="text-zinc-300 leading-relaxed text-sm font-medium bg-white/5 p-4 md:p-6 rounded-2xl border border-white/5 min-h-[120px] md:min-h-[150px]">
                  {project.longDescription || project.description}
                </div>
              </section>

              <div className="flex flex-col gap-3">
                {project.demo && (
                  <button
                    onClick={handleLaunchDemo}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                  >
                    Launch Demo <ExternalLink size={16} />
                  </button>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition-all active:scale-95"
                  >
                    <GitBranch size={16} className="text-zinc-400" /> Source Code
                  </a>
                )}
              </div>
            </div>

            {/* Column 2: Technical Specs */}
            <aside className="space-y-6 md:space-y-8">
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-white">
                  <Package size={16} className="text-blue-400" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Core Stack</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map(tech => (
                    <span key={tech} className="flex items-center gap-2 rounded-lg bg-zinc-900 border border-white/5 px-3 py-2 text-xs font-medium text-zinc-300">
                      <div className="h-1 w-1 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                      {tech}
                    </span>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl bg-zinc-900/50 border border-white/5 p-4 md:p-6 shadow-inner space-y-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Shield size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Environment</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-zinc-500">Language</span>
                    <span className="text-zinc-300">{project.language || "Mixed"}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-zinc-500">Package Size</span>
                    <span className="text-blue-400">{project.metadata?.size || "N/A"}</span>
                  </div>
                  {isMobile && (
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-zinc-500">Status</span>
                      <span className="text-emerald-500">{project.status.toUpperCase()}</span>
                    </div>
                  )}
                </div>
              </section>
            </aside>

            {/* Column 3: Project Gallery (Largest) */}
            <section className="space-y-4 lg:order-last order-first">
              <div className="flex items-center gap-2 text-white">
                <ImageIcon size={16} className="text-blue-400" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Project Gallery</h3>
              </div>
              <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 aspect-[16/10] shadow-2xl">
                {allImages.length > 0 ? (
                  <ProjectSlideshow images={allImages} />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-900/40 gap-4">
                    <Code2 size={48} className="text-zinc-800" />
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600">No visual artifacts found</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
