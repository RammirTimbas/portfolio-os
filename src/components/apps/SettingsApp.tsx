import { useState } from "react";
import { useConfigStore } from "../../stores/configStore";
import {
  Shield,
  Info,
  Palette,
  Laptop,
  Search,
  Monitor,
  User,
  Zap,
  Clock,
  Layout,
  StickyNote,
  ChevronLeft
} from "lucide-react";

interface Props {
  isMobile?: boolean;
}

export default function SettingsApp({ isMobile }: Props) {
  const {
    wallpaper, setWallpaper,
    taskbarAlignment, setTaskbarAlignment,
    showSeconds, setShowSeconds,
    reduceMotion, setReduceMotion,
    transparency, setTransparency,
    userName, setUserName,
    defaultNoteContent, setDefaultNoteContent
  } = useConfigStore();

  const [activeTab, setActiveTab] = useState("personalization");
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [showSidebar, setShowSidebar] = useState(true);

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

  const handleNameSave = () => {
    if (tempName.trim()) {
      setUserName(tempName);
      setEditingName(false);
    }
  };

  const selectTab = (id: string) => {
    setActiveTab(id);
    if (isMobile) setShowSidebar(false);
  };

  return (
    <div className="flex h-full w-full bg-zinc-950 text-white overflow-hidden">
      {/* Settings Sidebar */}
      <div className={`${isMobile && !showSidebar ? 'hidden' : 'flex'} w-full md:w-64 border-r border-white/5 bg-black/20 p-4 flex-col space-y-2 shrink-0 overflow-y-auto`}>
        <div className="flex items-center gap-3 px-3 py-4 mb-2">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold shadow-lg shadow-blue-500/20 uppercase">
            {userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate">{userName}</p>
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
            onClick={() => selectTab(item.id)}
            className={`
              flex w-full items-center gap-3 rounded-md px-3 py-2 text-[11px] transition-all
              ${activeTab === item.id && (!isMobile || !showSidebar)
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
      <div className={`${isMobile && showSidebar ? 'hidden' : 'flex'} flex-1 flex-col overflow-y-auto bg-zinc-900/20`}>
        {isMobile && (
          <div className="flex items-center gap-2 p-4 border-b border-white/5 bg-black/20 shrink-0">
             <button onClick={() => setShowSidebar(true)} className="p-2 -ml-2 text-blue-400">
               <ChevronLeft size={20} />
             </button>
             <h2 className="text-sm font-bold uppercase tracking-widest opacity-60">
               {sidebarItems.find(i => i.id === activeTab)?.label}
             </h2>
          </div>
        )}

        <div className="p-6 md:p-8 max-w-3xl mx-auto w-full space-y-8">
          {!isMobile && (
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-1">
                {sidebarItems.find(i => i.id === activeTab)?.label}
              </h1>
              <p className="text-xs text-zinc-500">Configure your system environment and preferences.</p>
            </div>
          )}

          {activeTab === "system" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <section className="space-y-3">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">Display & Performance</h3>

                 <div className="space-y-1">
                   <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <Monitor size={16} className="text-blue-400" />
                        <div>
                          <p className="text-xs font-bold">Transparency effects</p>
                          <p className="text-[10px] text-zinc-500">Make windows and surfaces appear translucent</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setTransparency(!transparency)}
                        className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${transparency ? 'bg-blue-600' : 'bg-zinc-700'}`}
                      >
                        <div className={`absolute top-1 h-3 w-3 bg-white rounded-full transition-all ${transparency ? 'left-6' : 'left-1'}`} />
                      </button>
                   </div>

                   <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <Zap size={16} className="text-amber-400" />
                        <div>
                          <p className="text-xs font-bold">Reduce motion</p>
                          <p className="text-[10px] text-zinc-500">Minimize animations and transition effects</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setReduceMotion(!reduceMotion)}
                        className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${reduceMotion ? 'bg-blue-600' : 'bg-zinc-700'}`}
                      >
                        <div className={`absolute top-1 h-3 w-3 bg-white rounded-full transition-all ${reduceMotion ? 'left-6' : 'left-1'}`} />
                      </button>
                   </div>
                 </div>
               </section>

               <section className="space-y-3">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">User Profile</h3>
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <User size={16} className="text-purple-400" />
                        <div>
                          <p className="text-xs font-bold">Account Name</p>
                          {editingName ? (
                            <input
                              type="text"
                              value={tempName}
                              onChange={(e) => setTempName(e.target.value)}
                              className="bg-black/40 border border-blue-500/50 rounded px-2 py-0.5 text-[10px] mt-1 outline-none w-32 md:w-auto"
                              autoFocus
                              onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                            />
                          ) : (
                            <p className="text-[10px] text-zinc-500 truncate max-w-[120px] md:max-w-none">Currently: {userName}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => editingName ? handleNameSave() : setEditingName(true)}
                        className="text-[10px] font-bold text-blue-400 hover:text-blue-300 transition-colors shrink-0"
                      >
                        {editingName ? 'Save' : 'Rename'}
                      </button>
                    </div>
                 </div>
               </section>
            </div>
          )}

          {activeTab === "personalization" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">Desktop Wallpaper</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wallpapers.map((wp) => (
                    <button
                      key={wp.id}
                      onClick={() => setWallpaper(wp.id)}
                      className={`
                        group relative aspect-video rounded-xl border-2 transition-all overflow-hidden
                        ${wallpaper === wp.id ? "border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "border-white/5 hover:border-white/20"}
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

              <section className="space-y-3">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">Widget Settings</h3>
                 <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <StickyNote size={16} className="text-amber-400" />
                        <div>
                          <p className="text-xs font-bold">Default Sticky Note Content</p>
                          <p className="text-[10px] text-zinc-500">Text used for new sticky note widgets</p>
                        </div>
                      </div>
                      <textarea
                        value={defaultNoteContent}
                        onChange={(e) => setDefaultNoteContent(e.target.value)}
                        className="w-full h-24 bg-black/40 border border-white/10 rounded-lg p-3 text-[10px] outline-none focus:border-blue-500/50 transition-colors resize-none"
                      />
                    </div>
                 </div>
              </section>

              <section className="space-y-3">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-1">Taskbar Customization</h3>
                 <div className="space-y-1">
                   <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <Layout size={16} className="text-zinc-400" />
                        <div>
                          <p className="text-xs font-bold">Taskbar alignment</p>
                          <p className="text-[10px] text-zinc-500">Choose where to place app icons</p>
                        </div>
                      </div>
                      <select
                        value={taskbarAlignment}
                        onChange={(e) => setTaskbarAlignment(e.target.value as 'center' | 'left')}
                        className="bg-zinc-800 border border-white/10 rounded px-2 py-1 text-[10px] outline-none"
                      >
                        <option value="center">Center</option>
                        <option value="left">Left</option>
                      </select>
                   </div>

                   <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <Clock size={16} className="text-zinc-400" />
                        <div>
                          <p className="text-xs font-bold">Show seconds in system clock</p>
                          <p className="text-[10px] text-zinc-500">Increases power usage slightly</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowSeconds(!showSeconds)}
                        className={`w-10 h-5 rounded-full transition-colors relative shrink-0 ${showSeconds ? 'bg-blue-600' : 'bg-zinc-700'}`}
                      >
                        <div className={`absolute top-1 h-3 w-3 bg-white rounded-full transition-all ${showSeconds ? 'left-6' : 'left-1'}`} />
                      </button>
                   </div>
                 </div>
              </section>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-4">
                 <Shield className="text-blue-400 shrink-0" size={24} />
                 <div>
                   <h4 className="text-xs font-bold text-blue-400">System Identity Shield</h4>
                   <p className="text-[10px] text-blue-200/60 mt-1 leading-relaxed">
                     Your system is currently protected by IdentityOS Kernel security layers. No threats detected in the last session.
                   </p>
                 </div>
               </div>

               <div className="p-4 rounded-xl bg-white/5 border border-white/5 opacity-50">
                 <p className="text-[10px] font-bold text-zinc-400">Firewall & Network Protection</p>
                 <p className="text-[9px] text-zinc-600 mt-1 italic">Managed by organizational policy</p>
               </div>
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex flex-col items-center py-6">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-2xl mb-4 group rotate-3 hover:rotate-0 transition-transform">
                   <Monitor size={40} className="text-white group-hover:scale-110 transition-transform" />
                </div>
                <h2 className="text-lg font-bold">IdentityOS</h2>
                <p className="text-[10px] text-zinc-500">Version 1.0.42 (Stable Release)</p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between p-3 rounded-lg bg-white/5 text-[10px]">
                  <span className="text-zinc-500">Device Name</span>
                  <span className="font-mono text-zinc-300 uppercase">IDENTITY-WORKSPACE</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-white/5 text-[10px]">
                  <span className="text-zinc-500">Processor</span>
                  <span className="font-mono text-zinc-300">React Runtime @ 18.3.0</span>
                </div>
                <div className="flex justify-between p-3 rounded-lg bg-white/5 text-[10px]">
                  <span className="text-zinc-500">System Type</span>
                  <span className="font-mono text-zinc-300">64-bit Portfolio OS</span>
                </div>
              </div>

              <p className="text-[9px] text-center text-zinc-600 px-10 leading-relaxed pb-8">
                © 2024 Identity Systems. All rights reserved. This software is protected by international copyright laws and developer passion.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
