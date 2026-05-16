import { useState, useEffect } from "react";
import type { Project } from "../../../types/project";
import { Play, Terminal, Image as ImageIcon, Package, Info, CheckCircle2, Code2, GitBranch, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import ProjectSlideshow from "./ProjectSlideshow";
import { useProjectStore } from "../../../stores/projectStore";

interface Props {
  project: Project | null;
  onLaunch: (project: Project) => void;
  isMobile?: boolean;
}

export default function ProjectDetails({ project, onLaunch, isMobile }: Props) {
  const [isLaunching, setIsLaunching] = useState(false);
  const fetchProjectImages = useProjectStore(state => state.fetchProjectImages);

  useEffect(() => {
    if (project?.id) {
      fetchProjectImages(project.id);
    }
  }, [project?.id, fetchProjectImages]);

  const handleRunAnimation = (e: React.MouseEvent) => {
    if (project?.demo) {
      e.preventDefault();
      setIsLaunching(true);
      setTimeout(() => {
        setIsLaunching(false);
        onLaunch(project);
      }, 2000);
    }
  };

  if (!project) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center text-zinc-500">
        <div className="mb-4 rounded-full bg-zinc-900/50 p-8 ring-1 ring-white/5 shadow-2xl">
          <Package size={48} className="opacity-10" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600">Workspace Registry</p>
          <p className="text-[10px] font-mono text-zinc-700">Select an artifact to mount from the directory</p>
        </div>
      </div>
    );
  }

  const allImages = [
    ...(project.image ? [project.image] : []),
    ...(project.images || [])
  ].filter((img, index, self) => self.indexOf(img) === index);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-zinc-900/10">
      {isLaunching ? (
        <div className="flex h-full flex-col items-center justify-center bg-black p-8 font-mono text-blue-500">
          <Terminal size={isMobile ? 24 : 32} className="mb-4 animate-pulse" />
          <div className="space-y-1 text-center">
            <p className="text-[9px] md:text-[10px] uppercase tracking-widest">Executing Link Protocol...</p>
            <p className="text-[9px] md:text-[10px]">MOUNTING {project.id.toUpperCase()}.OBJ...</p>
            <p className="text-[9px] md:text-[10px] text-emerald-500">✓ DATA LINK ESTABLISHED</p>
          </div>
        </div>
      ) : (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex h-full flex-col ${isMobile ? 'p-5' : 'p-8'} overflow-y-auto custom-scrollbar`}
        >
          {/* Header Dashboard */}
          <div className={`flex flex-col ${isMobile ? 'gap-6' : 'md:flex-row md:items-end'} justify-between gap-8 mb-8 md:mb-12`}>
             <div className="space-y-4">
                <div className="flex items-center gap-3 md:gap-4">
                   <div className={`${isMobile ? 'h-11 w-11' : 'h-14 w-14'} rounded-xl md:rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner`}>
                     <Package size={isMobile ? 22 : 28} />
                   </div>
                   <div className="min-w-0">
                     <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-black text-white tracking-tight leading-none mb-1.5 md:mb-2 truncate`}>{project.title}</h1>
                     <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[8px] md:text-[9px] font-bold text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
                          <CheckCircle2 size={10} />
                          Verified
                        </div>
                        <p className="text-zinc-500 font-mono text-[9px] font-bold uppercase tracking-tighter truncate">RT.NODE.{project.id.toUpperCase()}</p>
                     </div>
                   </div>
                </div>
             </div>

             <div className={`flex items-center ${isMobile ? 'grid grid-cols-2 gap-2' : 'gap-3'}`}>
               {project.demo ? (
                 <button
                   onClick={handleRunAnimation}
                   className={`flex items-center justify-center gap-2 rounded-xl bg-blue-600 ${isMobile ? 'px-4 py-2.5' : 'px-8 py-3'} text-[11px] md:text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40 active:scale-95`}
                 >
                   <ExternalLink size={14} />
                   Live Demo
                 </button>
               ) : (
                 <button className="flex items-center justify-center gap-2 rounded-xl bg-zinc-800 px-4 py-2.5 text-[11px] font-bold text-zinc-500 cursor-not-allowed border border-white/5 opacity-50" disabled>
                   <Play size={14} className="opacity-20" />
                   Restricted
                 </button>
               )}
               {project.github && (
                 <a
                   href={project.github}
                   target="_blank"
                   rel="noopener noreferrer"
                   className={`flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 ${isMobile ? 'px-4 py-2.5' : 'px-6 py-3'} text-[11px] md:text-xs font-bold text-white hover:bg-white/10 transition-all active:scale-95`}
                 >
                   <GitBranch size={14} className="text-blue-400" />
                   Source
                 </a>
               )}
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 items-start">
            {/* Column 1: Documentation */}
            <section className="space-y-3 md:space-y-4">
              <div className="flex items-center gap-2 text-white">
                <Info size={16} className="text-blue-400" />
                <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Documentation</h3>
              </div>
              <div className="text-zinc-300 leading-relaxed text-xs font-medium bg-white/5 p-5 md:p-6 rounded-2xl border border-white/5">
                {project.longDescription || project.description}
              </div>
            </section>

            {/* Column 2: Tech & Info */}
            <aside className="space-y-6 md:space-y-10">
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-2 text-white">
                  <Code2 size={16} className="text-blue-400" />
                  <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Environment</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.stack.length > 0 ? project.stack.map(tech => (
                    <div key={tech} className="flex items-center gap-2 rounded-lg bg-zinc-900 border border-white/5 px-3 py-2 text-[10px] font-mono text-zinc-300">
                      <div className="h-1 w-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                      {tech}
                    </div>
                  )) : (
                    <span className="text-[10px] text-zinc-600 italic px-1">No stack data detected</span>
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-black/20 border border-white/5 p-5 md:p-6 space-y-4 shadow-inner">
                <h4 className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 border-b border-white/5 pb-2">Artifact Data</h4>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="font-bold text-zinc-500 uppercase">Binary Size</span>
                     <span className="font-mono text-blue-400 font-bold">{project.metadata?.size || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="font-bold text-zinc-500 uppercase">Last Sync</span>
                     <span className="font-mono text-zinc-400">{project.metadata?.lastModified || "N/A"}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                     <span className="font-bold text-zinc-500 uppercase">Status</span>
                     <span className="font-bold text-emerald-400 uppercase tracking-widest">Active</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Row 2: Full Width Gallery */}
            <section className="space-y-3 md:space-y-4 lg:col-span-2 mt-4 md:mt-0">
              <div className="flex items-center gap-2 text-white">
                <ImageIcon size={16} className="text-blue-400" />
                <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Project Gallery</h3>
              </div>
              <div className="relative group border border-white/10 bg-zinc-950 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] aspect-video max-h-[500px] rounded-[2rem] md:rounded-[2.5rem]">
                {allImages.length > 0 ? (
                  <ProjectSlideshow images={allImages} />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-900/40 gap-4 md:gap-6 rounded-[2rem] md:rounded-[2.5rem]">
                    <Code2 size={isMobile ? 48 : 80} className="text-zinc-800" />
                    <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.4em] text-zinc-700 font-bold">No artifacts found</p>
                  </div>
                )}

                <div className="absolute top-6 left-6 flex gap-1.5 opacity-20 pointer-events-none">
                   <div className="h-0.5 w-10 bg-blue-500 rounded-full" />
                   <div className="h-0.5 w-3 bg-blue-400 rounded-full" />
                </div>
                <div className="absolute bottom-6 left-6 text-[8px] font-mono text-white/20 uppercase tracking-widest pointer-events-none">
                   OBJ_ID: {project.id}
                </div>
              </div>
            </section>
          </div>
          {/* Bottom spacer for mobile scroll */}
          {isMobile && <div className="h-20 shrink-0" />}
        </motion.div>
      )}
    </div>
  );
}
