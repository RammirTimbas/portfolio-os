import { useDesktopStore } from "../../stores/desktopStore";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import {  Calendar as CalendarIcon, X, CloudSun, Zap, Cpu, GripVertical, Cloud, CloudRain, Sun, Snowflake, MapPin, Loader2, MoveDiagonal2 } from "lucide-react";
import { useEffect, useState, useMemo, useRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function WidgetManager() {
  const { widgets, updateWidgetPosition, updateWidgetSize, updateWidgetContent, removeWidget } = useDesktopStore();

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <AnimatePresence mode="popLayout">
        {widgets.map((widget) => (
          <WidgetRenderer
            key={widget.id}
            widget={widget}
            onPositionChange={(pos: any) => updateWidgetPosition(widget.id, pos)}
            onSizeChange={(size: any) => updateWidgetSize(widget.id, size)}
            onContentChange={(content: string) => updateWidgetContent(widget.id, content)}
            onRemove={() => removeWidget(widget.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function WidgetRenderer({ widget, onPositionChange, onSizeChange, onContentChange, onRemove }: any) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const width = useMotionValue(widget.size?.width || 320);
  const height = useMotionValue(widget.size?.height || 320);

  useEffect(() => {
    if (!isResizing) {
      width.set(widget.size?.width || 320);
      height.set(widget.size?.height || 320);
    }
  }, [widget.size, isResizing, width, height]);

  return (
    <motion.div
      drag={!isResizing}
      dragMomentum={false}
      onDragStart={() => {
        setIsDragging(true);
        setIsFocused(true);
      }}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        onPositionChange({
          x: widget.position.x + info.offset.x,
          y: widget.position.y + info.offset.y,
        });
      }}
      onPointerDown={() => setIsFocused(true)}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: widget.position.x,
        y: widget.position.y,
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "absolute pointer-events-auto group flex flex-col",
        (isDragging || isResizing || isFocused) ? "z-[100]" : "z-0"
      )}
      style={{ width, height }}
    >
      <div className="relative flex-1 flex flex-col h-full w-full">
        <div className="absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 z-[110]">
          <button
            onClick={onRemove}
            className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-full text-white shadow-xl transition-all transform hover:scale-110 border border-white/20"
          >
            <X size={12} strokeWidth={3} />
          </button>
        </div>

        <div className="drag-handle absolute -left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 backdrop-blur-md rounded-full text-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-grab active:cursor-grabbing hover:text-white/80 border border-white/10 shadow-xl z-[110]">
          <GripVertical size={14} />
        </div>

        <motion.div
          className="absolute -bottom-2 -right-2 p-1.5 bg-white/10 backdrop-blur-md rounded-full text-white/40 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-nwse-resize hover:text-white/80 border border-white/10 shadow-xl z-[110]"
          onPanStart={() => setIsResizing(true)}
          onPan={(_, info) => {
            width.set(Math.max(200, width.get() + info.delta.x));
            height.set(Math.max(150, height.get() + info.delta.y));
          }}
          onPanEnd={() => {
            setIsResizing(false);
            onSizeChange({ width: width.get(), height: height.get() });
          }}
        >
          <MoveDiagonal2 size={14} />
        </motion.div>

        <div className="flex-1 h-full w-full overflow-hidden rounded-[2.5rem]" style={{ containerType: 'size' }}>
          {widget.type === 'clock' && <ClockWidget />}
          {widget.type === 'sticky-note' && (
            <StickyNoteWidget content={widget.content} onContentChange={onContentChange} />
          )}
          {widget.type === 'calendar' && <CalendarWidget />}
          {widget.type === 'weather' && <WeatherWidget />}
          {widget.type === 'performance' && <PerformanceWidget />}
        </div>
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
  const greeting = useMemo(() => {
    if (hours < 12) return "Good Morning";
    if (hours < 18) return "Good Afternoon";
    return "Good Evening";
  }, [hours]);

  return (
    <div className="bg-zinc-950/40 backdrop-blur-[40px] border border-white/10 rounded-[2.5rem] p-8 h-full w-full shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden ring-1 ring-white/10 group/clock">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-70" />

      <p className="text-[min(14px,4cqw)] font-black uppercase tracking-[0.5em] bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2 relative z-10">
        {greeting}
      </p>

      <div className="text-[min(8rem,25cqw)] font-thin text-white tracking-tighter mb-2 relative z-10 tabular-nums drop-shadow-[0_0_40px_rgba(255,255,255,0.15)] leading-none">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
      </div>

      <div className="text-[min(14px,3cqw)] font-medium text-white/40 relative z-10 flex items-center gap-2">
        <span className="text-white font-black uppercase tracking-[0.2em] whitespace-nowrap">{time.toLocaleDateString([], { weekday: 'long' })}</span>
        <div className="h-1 w-1 rounded-full bg-white/20" />
        <span className="uppercase tracking-[0.2em] font-bold whitespace-nowrap">{time.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
      </div>

      <div className="mt-8 w-full max-w-[240px] relative z-10">
        <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
            animate={{ width: `${(time.getSeconds() / 60) * 100}%` }}
            transition={{ ease: "linear", duration: 0.2 }}
          />
        </div>
      </div>
    </div>
  );
}

function StickyNoteWidget({ content, onContentChange }: any) {
  const [localContent, setLocalSize] = useState(content);
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    setLocalSize(content);
  }, [content]);

  const handleChange = (val: string) => {
    setLocalSize(val);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => onContentChange(val), 500);
  };

  return (
    <div className="bg-amber-300/15 backdrop-blur-3xl border border-amber-400/30 rounded-[2.5rem] p-8 h-full w-full shadow-2xl relative group/note ring-1 ring-amber-400/20 overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400/50 to-orange-500/50" />
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-28 h-10 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-xl shadow-xl z-10 flex items-center justify-center drag-handle">
        <div className="w-12 h-1 bg-white/20 rounded-full" />
      </div>

      <textarea
        value={localContent}
        onChange={(e) => handleChange(e.target.value)}
        className="flex-1 w-full bg-transparent border-none focus:ring-0 text-amber-50 font-medium resize-none placeholder-amber-200/20 text-lg leading-relaxed mt-6 custom-scrollbar-thin scroll-smooth"
        placeholder="Drop a thought..."
      />

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-amber-400/10 shrink-0">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/50 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/20" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400/60">Digital Note</span>
      </div>
    </div>
  );
}

function CalendarWidget() {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();

  return (
    <div className="bg-zinc-950/70 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 h-full w-full shadow-2xl ring-1 ring-white/10 relative overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px]" />

      <div className="flex justify-between items-center mb-6 relative z-10 shrink-0">
        <div>
          <h3 className="text-white font-black text-2xl leading-tight tracking-tight">{now.toLocaleDateString([], { month: 'long' })}</h3>
          <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.4em] mt-1">{now.getFullYear()}</p>
        </div>
        <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 border border-white/10 shadow-xl backdrop-blur-md">
          <CalendarIcon size={24} strokeWidth={2.5} />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-[10px] text-zinc-600 font-black mb-4 uppercase text-center tracking-widest relative z-10 shrink-0">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <div key={d} className="w-full">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center relative z-10 flex-1 content-start overflow-y-auto custom-scrollbar-thin pr-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = day === now.getDate();
          return (
            <div
              key={day}
              className={cn(
                "text-[13px] h-9 flex items-center justify-center rounded-xl transition-all duration-300",
                isToday
                  ? "bg-white text-zinc-950 font-black shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-110 z-10"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
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
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await res.json();
        setWeather(data.current_weather);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
      () => fetchWeather(37.7749, -122.4194)
    );
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code <= 1) return <Sun className="text-amber-400" size={40} />;
    if (code <= 3) return <CloudSun className="text-amber-200" size={40} />;
    if (code <= 48) return <Cloud className="text-zinc-300" size={40} />;
    if (code <= 67) return <CloudRain className="text-blue-300" size={40} />;
    if (code <= 77) return <Snowflake className="text-white" size={40} />;
    return <CloudSun className="text-zinc-300" size={40} />;
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 border border-white/20 rounded-[3rem] p-8 h-full w-full shadow-2xl text-white relative overflow-hidden group flex flex-col justify-center">
      <div className="absolute top-0 right-0 p-16 bg-white/20 rounded-full -mr-10 -mt-10 blur-[80px]" />

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-white/60" size={32} />
          <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-60">Synchronizing</p>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col justify-center">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[min(4rem,18cqw)] font-light tracking-tighter drop-shadow-2xl">
                {Math.round(weather?.temperature || 0)}°
              </p>
              <p className="text-[13px] font-black opacity-90 mt-1 uppercase tracking-widest text-blue-200">Live Local</p>
            </div>
            <div className="p-4 bg-white/15 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20">
              {getWeatherIcon(weather?.weathercode)}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 opacity-80">
              <MapPin size={12} className="text-blue-300" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Geolocation Active</span>
            </div>
            <div className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
          </div>
        </div>
      )}
    </div>
  );
}

function PerformanceWidget() {
  const [usage, setUsage] = useState({ cpu: 12, ram: 45 });

  useEffect(() => {
    const interval = setInterval(() => {
      setUsage({
        cpu: Math.floor(Math.random() * 10) + 5,
        ram: 44 + Math.floor(Math.random() * 6)
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-zinc-950/80 backdrop-blur-[40px] border border-white/10 rounded-[3rem] p-8 h-full w-full shadow-[0_40px_80px_rgba(0,0,0,0.5)] relative overflow-hidden ring-1 ring-white/10 flex flex-col justify-center">
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-500/10 blur-[100px] pointer-events-none" />

      <div className="space-y-8 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em]">Core Telemetry</h3>
          <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.7)] animate-pulse" />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-[11px] font-black text-zinc-500 uppercase flex items-center gap-4">
            <div className="p-2.5 bg-blue-500/10 rounded-[1.25rem] text-blue-400 border border-blue-500/10">
              <Cpu size={16} strokeWidth={2.5} />
            </div>
            <span className="tracking-[0.2em]">Processor</span>
            <span className="ml-auto tabular-nums text-white/90 font-black">{usage.cpu}%</span>
          </div>
          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-[3px] border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-indigo-400 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              animate={{ width: `${usage.cpu}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between text-[11px] font-black text-zinc-500 uppercase flex items-center gap-4">
            <div className="p-2.5 bg-purple-500/10 rounded-[1.25rem] text-purple-400 border border-purple-500/10">
              <Zap size={16} strokeWidth={2.5} />
            </div>
            <span className="tracking-[0.2em]">Memory</span>
            <span className="ml-auto tabular-nums text-white/90 font-black">{usage.ram}%</span>
          </div>
          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-[3px] border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 via-purple-400 to-pink-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.5)]"
              animate={{ width: `${usage.ram}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
