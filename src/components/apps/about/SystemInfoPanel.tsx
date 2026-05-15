import { profileData } from "../../../data/profile";
import { Terminal, Cpu, HardDrive, Clock } from "lucide-react";

export default function SystemInfoPanel() {
  const { systemInfo } = profileData;

  const infoItems = [
    { icon: Cpu, label: "Kernel", value: systemInfo.kernel },
    { icon: HardDrive, label: "UI Layer", value: systemInfo.uiLayer },
    { icon: Terminal, label: "Runtime", value: systemInfo.runtime },
    { icon: Clock, label: "Uptime", value: systemInfo.uptime },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {infoItems.map((item, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-zinc-400">
              <item.icon size={16} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">{item.label}</p>
              <p className="text-xs text-zinc-300 font-mono">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Tech Stack</h3>
        <div className="flex flex-wrap gap-2">
          {systemInfo.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-white/5 bg-zinc-900/50 px-2 py-1 text-[10px] font-mono text-zinc-400"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
