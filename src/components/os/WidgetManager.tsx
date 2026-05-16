import { useDesktopStore } from "../../stores/desktopStore";
import { motion, AnimatePresence } from "framer-motion";
import { Clock as ClockIcon, StickyNote as StickyNoteIcon, Calendar as CalendarIcon, X, CloudSun, Zap, Cpu, GripVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function WidgetManager() {
  const { widgets, updateWidgetPosition, updateWidgetContent, removeWidget } = useDesktopStore();

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <AnimatePresence>
        {widgets.map((widget) => (
          <WidgetRenderer
            key={widget.id}
            widget={widget}
            onPositionChange={(pos) => updateWidgetPosition(widget.id, pos)}
            onContentChange={(content) => updateWidgetContent(widget.id, content)}
            onRemove={() => removeWidget(widget.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function WidgetRenderer({ widget, onPositionChange, onContentChange, onRemove }: any) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragHandleClassName="drag-handle"
      onDragEnd={(_, info) => {
        onPositionChange({
          x: widget.position.x + info.offset.x,
          y: widget.position.y + info.offset.y,
        });
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: widget.position.x,
        y: widget.position.y
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute pointer-events-auto group"
    >
      <div className="relative">
        <div className="absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-50">
          <button
            onClick={onRemove}
            className="p-1.5 bg-red-500/80 hover:bg-red-500 backdrop-blur-md rounded-full text-white shadow-lg transition-colors"
          >
            <X size={10} />
          </button>
        </div>

        <div className="drag-handle absolute -left-3 top-1/2 -translate-y-1/2 p-1.5 bg-white/10 backdrop-blur-md rounded-full text-white/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing hover:text-white/80">
          <GripVertical size={12} />
        </div>

        {widget.type === 'clock' && <ClockWidget />}
        {widget.type === 'sticky-note' && (
          <StickyNoteWidget content={widget.content} onContentChange={onContentChange} />
        )}
        {widget.type === 'calendar' && <CalendarWidget />}
        {widget.type === 'weather' && <WeatherWidget />}
        {widget.type === 'performance' && <PerformanceWidget />}
      </div>
    </motion.div>
  );
}

function ClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const greeting = hours < 12 ? "Good Morning" : hours < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 min-w-[280px] shadow-2xl flex flex-col items-center text-center relative overflow-hidden group/clock">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-50" />

      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400/80 mb-2 relative z-10">
        {greeting}
      </p>

      <div className="text-6xl font-light text-white tracking-tighter mb-1 relative z-10 tabular-nums">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
      </div>

      <div className="text-sm font-medium text-white/50 relative z-10">
        <span className="text-white/80">{time.toLocaleDateString([], { weekday: 'long' })}</span>, {time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
      </div>

      <div className="mt-6 flex gap-4 relative z-10">
        <div className="flex flex-col items-center">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Seconds</div>
          <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-blue-500"
              animate={{ width: `${(time.getSeconds() / 60) * 100}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StickyNoteWidget({ content, onContentChange }: { content: string, onContentChange: (val: string) => void }) {
  return (
    <div className="bg-[#feff9c] dark:bg-[#fdfd86] border border-black/5 rounded-sm p-6 w-[260px] shadow-[5px_5px_15px_rgba(0,0,0,0.15)] relative transform rotate-1 hover:rotate-0 transition-transform duration-300">
      <div className="absolute top-0 left-0 w-full h-6 bg-black/5 cursor-move drag-handle" />
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-16 h-4 bg-white/40 backdrop-blur-sm border border-black/5 rounded-sm shadow-sm" />

      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        className="w-full h-40 bg-transparent border-none focus:ring-0 text-zinc-800 font-medium resize-none placeholder-zinc-500/50 text-sm leading-relaxed custom-scrollbar-thin mt-2"
        placeholder="Don't forget to..."
      />

      <div className="absolute bottom-2 right-3 opacity-20 italic text-[10px] text-zinc-900 pointer-events-none font-bold">
        Sticky Note
      </div>
    </div>
  );
}

function CalendarWidget() {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();

  return (
    <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 w-[260px] shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-white font-bold text-lg leading-tight">{now.toLocaleDateString([], { month: 'long' })}</h3>
          <p className="text-white/40 text-xs font-medium">{now.getFullYear()}</p>
        </div>
        <div className="h-10 w-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
          <CalendarIcon size={20} />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-[10px] text-zinc-500 font-bold mb-3 uppercase text-center tracking-widest">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="w-full">{d[0]}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = day === now.getDate();
          return (
            <div
              key={day}
              className={cn(
                "text-xs h-8 flex items-center justify-center rounded-lg transition-all",
                isToday
                  ? "bg-white text-zinc-950 font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-110 z-10"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeatherWidget() {
  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 border border-white/20 rounded-[2rem] p-6 w-[220px] shadow-2xl text-white relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 bg-white/10 rounded-full -mr-4 -mt-4 blur-2xl group-hover:scale-110 transition-transform duration-500" />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <p className="text-4xl font-light tracking-tighter">24°</p>
          <p className="text-xs font-medium opacity-80 mt-1">Cloudy Sky</p>
        </div>
        <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg">
          <CloudSun size={24} />
        </div>
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-60">San Francisco</div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
        </div>
      </div>
    </div>
  );
}

function PerformanceWidget() {
  const [usage, setUsage] = useState({ cpu: 12, ram: 45 });

  useEffect(() => {
    const interval = setInterval(() => {
      setUsage({
        cpu: Math.floor(Math.random() * 20) + 5,
        ram: 40 + Math.floor(Math.random() * 10)
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 w-[220px] shadow-2xl relative overflow-hidden">
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/5 blur-[50px] pointer-events-none" />

      <div className="space-y-6 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">System Status</h3>
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        </div>

        <div>
          <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase mb-2 flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400">
              <Cpu size={12} />
            </div>
            <span>CPU Usage</span>
            <span className="ml-auto tabular-nums">{usage.cpu}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              animate={{ width: `${usage.cpu}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase mb-2 flex items-center gap-2">
            <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400">
              <Zap size={12} />
            </div>
            <span>RAM Usage</span>
            <span className="ml-auto tabular-nums">{usage.ram}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              animate={{ width: `${usage.ram}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
