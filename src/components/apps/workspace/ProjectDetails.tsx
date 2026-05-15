import { useState } from "react";
import type { Project } from "../../../types/project";
import { Play, Terminal, Shield, Package, History, Info, CheckCircle2, Code2 } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  project: Project | null;
  onLaunch: (project: Project) => void;
}

export default function ProjectDetails({ project, onLaunch }: Props) {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleRun = () => {
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
      onLaunch(project!);
    }, 1200);
  };

  if (!project) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center text-zinc-500">
        <div className="mb-4 rounded-full bg-zinc-900/50 p-8 ring-1 ring-white/5 shadow-2xl">
          <Package size={48} className="opacity-10" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600">Workspace Explorer</p>
          <p className="text-[10px] font-mono text-zinc-700">Select an artifact to mount from the directory</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden bg-zinc-900/10">
      {isLaunching ? (
        <div className="flex h-full flex-col items-center justify-center bg-black p-8 font-mono text-blue-500">
          <Terminal size={32} className="mb-4 animate-pulse" />
          <div className="space-y-1 text-center">
            <p className="text-[10px] uppercase tracking-widest">Initializing Execution Protocol...</p>
            <p className="text-[10px]">MOUNTING {project.id.toUpperCase()}.OBJ...</p>
            <p className="text-[10px]">ALLOCATING VIRTUAL MEMORY...</p>
            <p className="text-[10px] text-emerald-500">✓ ENVIRONMENT READY</p>
          </div>
        </div>
      ) : (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex h-full flex-col p-8 overflow-y-auto custom-scrollbar"
        >
          <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
             <div className="h-32 w-32 shrink-0 rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden group">
                <Package size={48} className="text-blue-500 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>

             <div className="flex-1 space-y-4">
                <div className="space-y-1">
                   <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-black text-white tracking-tight">{project.title}</h1>
                      <div className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[9px] font-bold text-blue-400 border border-blue-500/20 uppercase tracking-widest">
                        <CheckCircle2 size={10} />
                        Verified Build
                      </div>
                   </div>
                   <p className="text-blue-500/80 font-mono text-xs font-bold uppercase tracking-tighter">RT.SYS.{project.category}.{project.id}</p>
                </div>

                <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-tighter">
                   <div className="flex flex-col">
                      <span className="text-zinc-500">Version</span>
                      <span className="text-zinc-300">{project.metadata?.version || "1.0.0"}</span>
                   </div>
                   <div className="h-6 w-px bg-white/5" />
                   <div className="flex flex-col">
                      <span className="text-zinc-500">Security</span>
                      <span className="text-emerald-500">Encrypted</span>
                   </div>
                   <div className="h-6 w-px bg-white/5" />
                   <div className="flex flex-col">
                      <span className="text-zinc-500">Status</span>
                      <span className={project.status === 'completed' ? 'text-blue-400' : 'text-amber-500'}>
                         {project.status === 'completed' ? 'Stable' : 'Dev-Build'}
                      </span>
                   </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleRun}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-10 py-3 text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40 active:scale-95"
                  >
                    <Play size={14} className="fill-current" />
                    Launch Artifact
                  </button>
                  {project.github && (
                    <a href={project.github} target="_blank" className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-6 py-3 text-xs font-bold text-white hover:bg-white/10 transition-all">
                      {/* <Github size={14} /> Repository */}
                    </a>
                  )}
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
               <section className="space-y-4">
                 <div className="flex items-center gap-2 text-white">
                    <Info size={16} className="text-blue-400" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">System Documentation</h3>
                 </div>
                 <p className="text-zinc-300 leading-relaxed text-sm font-medium bg-white/5 p-6 rounded-2xl border border-white/5">
                   {project.longDescription || project.description}
                 </p>
               </section>

               <section className="space-y-4">
                  <div className="flex items-center gap-2 text-white">
                    <Shield size={16} className="text-blue-400" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Visual Telemetry</h3>
                  </div>
                  <div className="aspect-video rounded-3xl border border-white/10 bg-black/40 overflow-hidden relative group shadow-2xl">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-zinc-900/50">
                        <Code2 size={48} className="text-zinc-800" />
                      </div>
                    )}
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/5 rounded-3xl" />
                  </div>
               </section>
            </div>

            <aside className="space-y-8">
              <div className="rounded-2xl border border-white/5 bg-black/20 p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Core Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map(tech => (
                      <div key={tech} className="flex items-center gap-2 rounded-lg bg-zinc-900 border border-white/5 px-3 py-2 text-[10px] font-mono text-zinc-300">
                        <div className="h-1 w-1 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
                        {tech}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Environment Metadata</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                       <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase"><Package size={12} /> Image Size</div>
                       <span className="text-[10px] font-mono text-blue-400">{project.metadata?.size || "4.2 MB"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase"><History size={12} /> Last Commit</div>
                       <span className="text-[10px] font-mono text-zinc-300">{project.metadata?.lastModified || "2024.01.01"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </motion.div>
      )}
    </div>
  );
}
