import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCw, ExternalLink, Shield, Lock, Globe } from "lucide-react";

interface Props {
  params?: { url: string; title: string };
  isMobile?: boolean;
}

export default function BrowserApp({ params, isMobile }: Props) {
  const [url, setUrl] = useState(params?.url || "https://google.com");
  const [inputValue, setInputValue] = useState(params?.url || "https://google.com");
  const [isLoading, setIsLoading] = useState(true);

  const handleRefresh = () => {
    setIsLoading(true);
    const iframe = document.getElementById("browser-iframe") as HTMLIFrameElement;
    if (iframe) iframe.src = url;
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#1a1a1a] text-zinc-300 select-none overflow-hidden">
      {/* Browser Toolbar */}
      <div className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 bg-[#2d2d2d] border-b border-white/5 shrink-0`}>
        <div className="flex items-center gap-0.5 md:gap-1">
          {!isMobile && (
            <>
              <button className="p-1.5 hover:bg-white/5 rounded-md text-zinc-500 hover:text-white transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button className="p-1.5 hover:bg-white/5 rounded-md text-zinc-500 hover:text-white transition-colors">
                <ChevronRight size={16} />
              </button>
            </>
          )}
          <button
            onClick={handleRefresh}
            className="p-1.5 hover:bg-white/5 rounded-md text-zinc-500 hover:text-white transition-colors"
          >
            <RotateCw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="flex-1 flex items-center gap-2 bg-black/40 border border-white/5 rounded-lg px-2 md:px-3 py-1.5 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all">
          <Lock size={12} className="text-emerald-500 shrink-0" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setUrl(inputValue)}
            className="bg-transparent border-none outline-none text-[10px] md:text-xs w-full text-zinc-400 font-mono truncate"
            spellCheck={false}
          />
        </div>

        <div className="flex items-center gap-1">
           <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 hover:bg-white/5 rounded-md text-zinc-500 hover:text-white transition-colors"
            title="Open in real browser"
           >
            <ExternalLink size={14} />
           </a>
        </div>
      </div>

      {/* Security Banner */}
      <div className="flex items-center gap-2 px-4 py-1 bg-blue-500/10 border-b border-blue-500/20 text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold text-blue-400 truncate">
        <Shield size={10} className="shrink-0" />
        {isMobile ? "Secure Sandbox" : "Secure Sandbox Environment Active"}
      </div>

      {/* Iframe Viewport */}
      <div className="flex-1 relative bg-white">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a1a1a] z-10 gap-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 animate-pulse">
              <Globe size={24} />
            </div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest animate-pulse">Establishing Connection...</p>
          </div>
        )}
        <iframe
          id="browser-iframe"
          src={url}
          className="w-full h-full border-none"
          onLoad={() => setIsLoading(false)}
          title={params?.title || "Browser"}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>

      {/* Status Bar */}
      {!isMobile && (
        <div className="px-4 py-1 bg-[#2d2d2d] border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span>CONNECTED TO {new URL(url).hostname.toUpperCase()}</span>
          </div>
          <span className="opacity-50">PORT: 443</span>
        </div>
      )}
    </div>
  );
}
