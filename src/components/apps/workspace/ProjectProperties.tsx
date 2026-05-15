import { FolderKanban } from "lucide-react";

interface Props {
  params?: { project: any };
}

export default function ProjectProperties({ params }: Props) {
  if (!params?.project) return null;
  const { project } = params;

  return (
    <div className="p-6 bg-zinc-950 h-full text-zinc-300 font-mono text-[11px] space-y-4 select-none">
      <div className="flex items-center gap-4 pb-4 border-b border-white/5">
        <div className="h-12 w-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-inner">
          <FolderKanban className="text-blue-400" size={24} />
        </div>
        <div>
          <h1 className="text-sm font-bold text-white">{project.id}.obj</h1>
          <p className="text-zinc-500 uppercase tracking-tighter">System Artifact</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-y-3">
        <span className="text-zinc-600">Type:</span>
        <span className="col-span-2 text-zinc-400 capitalize">{project.category} Module</span>

        <span className="text-zinc-600">Location:</span>
        <span className="col-span-2 text-zinc-500 truncate text-[10px]">C:/Workspace/{project.category}/{project.id}</span>

        <span className="text-zinc-600">Status:</span>
        <span className="col-span-2 text-emerald-500 font-bold">{project.status.toUpperCase()}</span>

        <span className="text-zinc-600">Size:</span>
        <span className="col-span-2 text-zinc-400">{(project.stack.length * 1.2).toFixed(1)} MB</span>

        <span className="text-zinc-600">Created:</span>
        <span className="col-span-2 text-zinc-400">Oct 12, 2022</span>

        <span className="text-zinc-600">Accessed:</span>
        <span className="col-span-2 text-zinc-400">Today, {new Date().toLocaleTimeString()}</span>
      </div>

      <div className="pt-4 border-t border-white/5 space-y-3">
        <h3 className="text-white font-bold uppercase tracking-widest text-[9px] text-zinc-500">Security & Permissions</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-default">
            <input type="checkbox" checked readOnly className="accent-blue-500 rounded bg-zinc-800 border-white/10" />
            <span>Read-only</span>
          </label>
          <label className="flex items-center gap-2 cursor-default">
            <input type="checkbox" checked readOnly className="accent-blue-500 rounded bg-zinc-800 border-white/10" />
            <span>Encrypted (AES-256)</span>
          </label>
        </div>
      </div>

      <div className="pt-4 mt-auto flex justify-end gap-2">
        <button className="px-4 py-1.5 rounded bg-zinc-800 text-white text-[10px] font-bold hover:bg-zinc-700 transition-colors">OK</button>
        <button className="px-4 py-1.5 rounded border border-white/5 text-zinc-400 text-[10px] font-bold hover:text-white transition-colors">Apply</button>
      </div>
    </div>
  );
}
