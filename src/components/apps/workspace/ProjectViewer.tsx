import type { Project } from "../../../types/project";
import { ExternalLink, Code2, Globe, Shield } from "lucide-react";

interface Props {
  params?: { project: Project };
}

export default function ProjectViewer({ params }: Props) {
  const project = params?.project;

  if (!project) return null;

  return (
    <div className="flex h-full w-full flex-col bg-zinc-950 text-white selection:bg-blue-500/30">
      {/* Header Status Bar */}
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

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Hero Section */}
          <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 aspect-[16/9] shadow-2xl">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-zinc-900/40">
                <Code2 size={48} className="text-zinc-800" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent opacity-60" />
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 space-y-6">
              <section className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Overview</h3>
                <p className="text-lg text-zinc-300 leading-relaxed font-medium">
                  {project.longDescription || project.description}
                </p>
              </section>

              <div className="flex flex-wrap gap-3 pt-4">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                  >
                    Launch Live Demo <ExternalLink size={16} />
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition-all active:scale-95"
                  >
                    {/* <Github size={16} /> Source Code */}
                  </a>
                )}
              </div>
            </div>

            <aside className="space-y-8">
              <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map(tech => (
                    <span key={tech} className="flex items-center gap-2 rounded-lg bg-zinc-900 border border-white/5 px-3 py-2 text-xs font-medium text-zinc-300">
                      <div className="h-1 w-1 rounded-full bg-blue-500" />
                      {tech}
                    </span>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl bg-zinc-900/50 border border-white/5 p-4 shadow-inner">
                <div className="flex items-center gap-2 mb-3 text-zinc-400">
                  <Shield size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Environment</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-zinc-600">Runtime</span>
                    <span className="text-zinc-400">Node.js 20.x</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-zinc-600">Security</span>
                    <span className="text-emerald-500">Encrypted</span>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
