import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { Activity, Cpu, Database, Zap } from "lucide-react";

export default function VisualTelemetry() {
  const [points, setPoints] = useState<number[]>(Array(40).fill(0));
  const [stats, setStats] = useState({
    cpu: 0,
    mem: 0,
    net: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(prev => {
        const next = [...prev.slice(1), Math.random() * 100];
        return next;
      });
      setStats({
        cpu: Math.floor(Math.random() * 30) + 10,
        mem: Math.floor(Math.random() * 20) + 40,
        net: Math.floor(Math.random() * 100),
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const maxValue = Math.max(...points, 1);

  return (
    <div className="relative w-full h-full bg-black/40 backdrop-blur-sm overflow-hidden flex flex-col font-mono">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />

      {/* Header Overlay */}
      <div className="absolute top-4 left-6 right-6 flex justify-between items-start z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-400">
            <Activity size={14} className="animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Live Data Stream</span>
          </div>
          <div className="text-[8px] text-zinc-500">NODE_ID: 0x7F4B92 - STATUS: ACTIVE</div>
        </div>
        <div className="flex gap-4">
           {[stats.cpu, stats.mem, stats.net].map((val, i) => (
             <div key={i} className="text-right">
                <div className="text-[8px] text-zinc-600 uppercase font-bold">{['CPU', 'MEM', 'NET'][i]}</div>
                <div className="text-xs text-blue-400/80 font-bold">{val}%</div>
             </div>
           ))}
        </div>
      </div>

      {/* Main Visualization */}
      <div className="flex-1 flex items-end justify-center px-4 pb-12 gap-[2px]">
        {points.map((p, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{
              height: `${(p / maxValue) * 60}%`,
              opacity: (i / points.length) * 0.8 + 0.2
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full bg-gradient-to-t from-blue-600/50 to-blue-400 rounded-t-sm"
          />
        ))}
      </div>

      {/* Scanning Line */}
      <motion.div
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[1px] bg-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-0"
      />

      {/* Bottom HUD */}
      <div className="h-16 border-t border-white/5 bg-black/40 px-6 flex items-center justify-between z-10">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Cpu size={12} className="text-zinc-500" />
            <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
               <motion.div animate={{ width: `${stats.cpu}%` }} className="h-full bg-blue-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Database size={12} className="text-zinc-500" />
            <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
               <motion.div animate={{ width: `${stats.mem}%` }} className="h-full bg-emerald-500" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-blue-500/50">
           <Zap size={12} />
           <span className="text-[9px] font-bold uppercase tracking-tighter">Optimized Runtime</span>
        </div>
      </div>
    </div>
  );
}
