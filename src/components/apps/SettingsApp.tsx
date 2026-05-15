import { useState } from "react";
import { useConfigStore } from "../../stores/configStore";
import { Shield, Info, Palette, Laptop, Bell, Search, ChevronRight } from "lucide-react";

export default function SettingsApp() {
  const { wallpaper, setWallpaper } = useConfigStore();
  const [activeTab, setActiveTab] = useState("personalization");

  const sidebarItems = [
    { id: "system", label: "System", icon: Laptop },
    { id: "personalization", label: "Personalization", icon: Palette },
    { id: "security", label: "Privacy & Security", icon: Shield },
    { id: "about", label: "About", icon: Info },
  ];

  const wallpapers = [
    { id: "default", label: "Slate Gradient", class: "bg-[radial-gradient(circle_at_top,#27272a,transparent_60%)]" },
    { id: "blue", label: "Deep Ocean", class: "bg-[radial-gradient(circle_at_top,#1e3a8a,transparent_60%)]" },
    { id: "green", label: "Emerald Forest", class: "bg-[radial-gradient(circle_at_top,#064e3b,transparent_60%)]" },
    { id: "purple", label: "Midnight Purple", class: "bg-[radial-gradient(circle_at_top,#4c1d95,transparent_60%)]" },
  ];

  return (
    <div className="flex h-full w-full bg-zinc-950 text-white overflow-hidden">
      {/* Settings Sidebar */}
      <div className="w-64 border-r border-white/5 bg-black/20 p-4 space-y-2">
        <div className="flex items-center gap-3 px-3 py-4 mb-2">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold shadow-lg shadow-blue-500/20">
            RT
          </div>
          <div>
            <p className="text-xs font-bold">Rammir Timbas</p>
            <p className="text-[10px] text-zinc-500">Local Account</p>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={12} />
          <input
            type="text"
            placeholder="Find a setting"
            className="w-full rounded-md bg-white/5 border border-white/5 py-1.5 pl-8 pr-3 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500/30"
          />
        </div>

        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
              flex w-full items-center gap-3 rounded-md px-3 py-2 text-[11px] transition-all
              ${activeTab === item.id
                ? "bg-white/10 text-white shadow-sm ring-1 ring-white/5"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"}
            `}
          >
            <item.icon size={14} className={activeTab === item.id ? "text-blue-400" : "text-zinc-500"} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-zinc-900/20">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              {sidebarItems.find(i => i.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-zinc-500">Configure your system environment and preferences.</p>
          </div>

          {activeTab === "personalization" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Desktop Wallpaper</h3>
                <div className="grid grid-cols-2 gap-4">
                  {wallpapers.map((wp) => (
                    <button
                      key={wp.id}
                      onClick={() => setWallpaper(wp.id)}
                      className={`
                        group relative aspect-video rounded-xl border-2 transition-all overflow-hidden
                        ${wallpaper === wp.id ? "border-blue-500" : "border-white/5 hover:border-white/20"}
                      `}
                    >
                      <div className={`absolute inset-0 bg-zinc-950 ${wp.class}`} />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                      <div className="absolute bottom-2 left-3">
                        <p className="text-[10px] font-bold text-white drop-shadow-md">{wp.label}</p>
                      </div>
                      {wallpaper === wp.id && (
                        <div className="absolute top-2 right-2 h-4 w-4 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                          <div className="h-1.5 w-1.5 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-2">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Taskbar</h3>
                 <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/[0.07] transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Bell size={16} className="text-zinc-400" />
                      <div>
                        <p className="text-xs font-bold">Taskbar behaviors</p>
                        <p className="text-[10px] text-zinc-500">Alignment, badging, automatically hide</p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-zinc-600" />
                 </div>
              </section>
            </div>
          )}

          {activeTab !== "personalization" && (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
              <Laptop size={48} className="mb-4 text-zinc-700" />
              <p className="text-xs font-mono uppercase tracking-widest">Subsystem Restricted</p>
              <p className="text-[10px] mt-1">Personalization is the only module available in this build.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
