import { useDesktopStore } from "../../stores/desktopStore";
import { motion, AnimatePresence } from "framer-motion";
import { Clock as ClockIcon, StickyNote as StickyNoteIcon, Calendar as CalendarIcon, X, CloudSun, Zap, Cpu, GripVertical, Cloud, CloudRain, Sun, Snowflake, MapPin, Loader2, Thermometer } from "lucide-react";
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
      <AnimatePresence mode="popLayout">
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
  const [isDragging, setIsDragging] = useState(false);

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragHandleClassName="drag-handle"
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        onPositionChange({
          x: widget.position.x + info.offset.x,
          y: widget.position.y + info.offset.y,
        });
      }}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: widget.position.x,
        y: widget.position.y
      }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn(
        "absolute pointer-events-auto group",
        isDragging && "z-50"
      )}
    >
      <div className="relative">
        {/* Modern Close Button */}
        <div className="absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 z-50">
          <button
            onClick={onRemove}
            className="p-1.5 bg-red-500 hover:bg-red-600 rounded-full text-white shadow-[0_4px_12px_rgba(239,68,68,0.4)] transition-all transform hover:scale-110 active:scale-95 border border-white/20"
          >
            <X size={12} strokeWidth={3} />
          </button>
        </div>

        {/* Modern Drag Handle */}
        <div className="drag-handle absolute -left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 backdrop-blur-md rounded-full text-white/40 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-grab active:cursor-grabbing hover:text-white/80 border border-white/10 shadow-xl z-50">
          <GripVertical size={14} />
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
    <div className="bg-zinc-950/40 backdrop-blur-[40px] border border-white/10 rounded-[3.5rem] p-12 min-w-[360px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] flex flex-col items-center text-center relative overflow-hidden ring-1 ring-white/10 group/clock">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10 opacity-70" />
      <div className="absolute -top-20 -left-20 w-48 h-48 bg-blue-500/20 rounded-full blur-[100px]" />
      <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-purple-500/20 rounded-full blur-[100px]" />

      <motion.p
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[13px] font-black uppercase tracking-[0.5em] bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-4 relative z-10"
      >
        {greeting}
      </motion.p>

      <div className="text-9xl font-thin text-white tracking-tighter mb-4 relative z-10 tabular-nums drop-shadow-[0_0_40px_rgba(255,255,255,0.15)] leading-none">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
      </div>

      <div className="text-sm font-medium text-white/40 relative z-10 flex items-center gap-4">
        <span className="text-white font-black uppercase tracking-[0.2em]">{time.toLocaleDateString([], { weekday: 'long' })}</span>
        <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
        <span className="uppercase tracking-[0.2em] font-bold">{time.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
      </div>

      <div className="mt-12 w-full px-4 relative z-10">
        <div className="h-[3px] w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.6)]"
            animate={{ width: `${(time.getSeconds() / 60) * 100}%` }}
            transition={{ ease: "linear", duration: 0.2 }}
          />
        </div>
      </div>
    </div>
  );
}

function StickyNoteWidget({ content, onContentChange }: { content: string, onContentChange: (val: string) => void }) {
  return (
    <div className="bg-amber-300/15 backdrop-blur-3xl border border-amber-400/30 rounded-[2.5rem] p-8 w-[320px] shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative transform rotate-1 hover:rotate-0 transition-all duration-700 group/note ring-1 ring-amber-400/20 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400/50 to-orange-500/50" />
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-32 h-12 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-xl shadow-xl z-10 flex items-center justify-center drag-handle">
        <div className="w-16 h-1.5 bg-white/10 rounded-full" />
      </div>

      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        className="w-full h-56 bg-transparent border-none focus:ring-0 text-amber-50 font-medium resize-none placeholder-amber-200/20 text-xl leading-relaxed mt-8 custom-scrollbar-thin scroll-smooth"
        placeholder="A quick thought..."
      />

      <div className="flex justify-between items-center mt-6 pt-6 border-t border-amber-400/10">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/50 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/20" />
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-400/60">Digital Post-It</span>
      </div>
    </div>
  );
}

function CalendarWidget() {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();

  return (
    <div className="bg-zinc-950/70 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-9 w-[320px] shadow-2xl ring-1 ring-white/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 blur-[80px]" />

      <div className="flex justify-between items-center mb-10 relative z-10">
        <div>
          <h3 className="text-white font-black text-3xl leading-tight tracking-tight">{now.toLocaleDateString([], { month: 'long' })}</h3>
          <p className="text-white/30 text-xs font-black uppercase tracking-[0.4em] mt-1.5">{now.getFullYear()}</p>
        </div>
        <div className="h-14 w-14 bg-indigo-500/15 rounded-[1.25rem] flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-2xl backdrop-blur-xl">
          <CalendarIcon size={28} strokeWidth={2.5} />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-[11px] text-zinc-600 font-black mb-6 uppercase text-center tracking-[0.2em] relative z-10">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <div key={d} className="w-full">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 text-center relative z-10">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = day === now.getDate();
          return (
            <div
              key={day}
              className={cn(
                "text-[14px] h-11 flex items-center justify-center rounded-2xl transition-all duration-500 cursor-default",
                isToday
                  ? "bg-white text-zinc-950 font-black shadow-[0_0_30px_rgba(255,255,255,0.5)] scale-110 z-10 ring-[6px] ring-white/10"
                  : "text-white/60 hover:bg-white/5 hover:text-white font-bold"
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
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`);
        const data = await res.json();
        setWeather(data.current_weather);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(37.7749, -122.4194)
      );
    } else {
      fetchWeather(37.7749, -122.4194);
    }

    const interval = setInterval(() => {
       if (weather) fetchWeather(37.7749, -122.4194);
    }, 1800000);

    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (code: number) => {
    if (code <= 1) return <Sun className="text-amber-400" size={48} strokeWidth={1.5} />;
    if (code <= 3) return <CloudSun className="text-amber-200" size={48} strokeWidth={1.5} />;
    if (code <= 48) return <Cloud className="text-zinc-300" size={48} strokeWidth={1.5} />;
    if (code <= 67) return <CloudRain className="text-blue-300" size={48} strokeWidth={1.5} />;
    if (code <= 77) return <Snowflake className="text-white" size={48} strokeWidth={1.5} />;
    return <CloudSun className="text-zinc-300" size={48} strokeWidth={1.5} />;
  };

  const getConditionText = (code: number) => {
    if (code <= 1) return "Crystal Clear";
    if (code <= 3) return "Partly Cloudy";
    if (code <= 48) return "Foggy Mist";
    if (code <= 67) return "Light Rain";
    if (code <= 77) return "Snowfall";
    return "Cloudy Sky";
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 border border-white/20 rounded-[3.5rem] p-10 w-[320px] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] text-white relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-20 bg-white/20 rounded-full -mr-12 -mt-12 blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
      <div className="absolute -bottom-10 -left-10 p-20 bg-blue-400/20 rounded-full blur-[80px]" />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-5">
          <Loader2 className="animate-spin text-white/60" size={40} />
          <p className="text-[12px] font-black uppercase tracking-[0.4em] opacity-60">Synchronizing</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <p className="text-sm font-bold opacity-80 px-6">Weather data currently unavailable</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-12 relative z-10">
            <div>
              <p className="text-7xl font-light tracking-tighter drop-shadow-2xl">
                {Math.round(weather?.temperature || 0)}°
              </p>
              <p className="text-[15px] font-black opacity-90 mt-2 uppercase tracking-widest">{getConditionText(weather?.weathercode)}</p>
            </div>
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="p-5 bg-white/15 backdrop-blur-[40px] rounded-[2rem] shadow-2xl border border-white/20"
            >
              {getWeatherIcon(weather?.weathercode)}
            </motion.div>
          </div>

          <div className="flex items-center justify-between relative z-10 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2.5 opacity-80">
              <MapPin size={14} className="text-blue-300" />
              <span className="text-[12px] font-black uppercase tracking-[0.3em]">{weather?.windspeed > 20 ? "Windy" : "Live Local"}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Thermometer size={14} className="opacity-50" />
              <span className="text-[11px] font-bold opacity-60 tabular-nums">W: {weather?.windspeed}km/h</span>
            </div>
          </div>
        </>
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
    <div className="bg-zinc-950/80 backdrop-blur-[40px] border border-white/10 rounded-[3rem] p-10 w-[320px] shadow-[0_40px_80px_rgba(0,0,0,0.5)] relative overflow-hidden ring-1 ring-white/10">
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-500/10 blur-[100px] pointer-events-none" />

      <div className="space-y-10 relative z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-[12px] font-black text-white/25 uppercase tracking-[0.4em]">Core Telemetry</h3>
          <div className="flex gap-2 items-center">
             <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.7)] animate-pulse" />
             <span className="text-[10px] font-black text-green-500/60 uppercase tracking-widest">Active</span>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex justify-between text-[11px] font-black text-zinc-500 uppercase flex items-center gap-5">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/10 shadow-inner">
              <Cpu size={18} strokeWidth={2.5} />
            </div>
            <span className="tracking-[0.2em]">Processor</span>
            <span className="ml-auto tabular-nums text-white/90 font-black">{usage.cpu}%</span>
          </div>
          <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-[4px] border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-indigo-400 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              animate={{ width: `${usage.cpu}%` }}
              transition={{ type: "spring", stiffness: 50 }}
            />
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex justify-between text-[11px] font-black text-zinc-500 uppercase flex items-center gap-5">
            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/10 shadow-inner">
              <Zap size={18} strokeWidth={2.5} />
            </div>
            <span className="tracking-[0.2em]">Memory</span>
            <span className="ml-auto tabular-nums text-white/90 font-black">{usage.ram}%</span>
          </div>
          <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-[4px] border border-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 via-purple-400 to-pink-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.5)]"
              animate={{ width: `${usage.ram}%` }}
              transition={{ type: "spring", stiffness: 50 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
