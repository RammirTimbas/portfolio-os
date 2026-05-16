import { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Music,
  Heart,
  Repeat,
  Shuffle,
  Maximize2,
  Minimize2,
  Volume1,
  VolumeX,
  PlusCircle,
  Search,
  LayoutGrid,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowStore } from "../../stores/windowStore";

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  youtubeId: string;
  duration: number;
  color: string;
}

const mockSongs: Song[] = [
  {
    id: "1",
    title: "Die For You",
    artist: "Starset",
    album: "Vessels 2.0",
    cover: "https://yt3.googleusercontent.com/w9NEUqVhC6KoCdTxXqTe1g5tOW3r7MtDAlCaA_gd1V6ipFgBWjx6i5Fgg-83J0CyLB8HH0EoK-ajyk8a",
    youtubeId: "FyrnipqQAmg",
    duration: 292,
    color: "#ec4899",
  },
  {
    id: "2",
    title: "Ricochet",
    artist: "Starset",
    album: "Vessels 2.0",
    cover: "https://yt3.googleusercontent.com/eKdkM8SO3aX-u9lKKim-1sg4Lq_pks-KWJCKhiJnxJEs1TWKiZPnokrFPJ0RHV90ot8anBMKwQCSyU7I",
    youtubeId: "SaC0YVaIMno",
    duration: 292,
    color: "#1111c6",
  },
  {
    id: "3",
    title: "Sway",
    artist: "Starset",
    album: "SILOS",
    cover: "https://yt3.googleusercontent.com/m6wGYsVx2ZG6huIlVwAu0SrOLYpQwftm_sdsXXwL1sEO0aw-JEy2rKnCgXW2aN9vBTwNumaxLF8fz1rUcw",
    youtubeId: "9d72bxZqqJ0",
    duration: 292,
    color: "#cf0e0e",
  }
];

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

interface Props {
  windowId?: string;
  isMobile?: boolean;
}

export default function MusicApp({ windowId, isMobile: isMobileProp }: Props) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [prevVolume, setPrevVolume] = useState(0.7);
  const [likedSongs, setLikedSongs] = useState<string[]>(["1", "3", "5"]);
  const [currentView, setCurrentView] = useState<'home' | 'browse' | 'liked'>('home');
  const [playerReady, setPlayerReady] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const { maximizeWindow, restoreMaximizedWindow, windows } = useWindowStore();
  const currentWindow = windows.find(w => w.id === windowId);

  const playerRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeUpdateInterval = useRef<number>(0);

  const currentSong = mockSongs[currentSongIndex];

  // Logic for container-based responsiveness
  const appWidth = currentWindow?.size.width || 800;
  const appHeight = currentWindow?.size.height || 600;
  const isCompact = appWidth < 800 || !!isMobileProp;
  const isMobile = appWidth < 500 || !!isMobileProp;
  const isShort = appHeight < 500;

  // Load YouTube API
  useEffect(() => {
    const initPlayer = () => {
      if (playerRef.current) return;
      playerRef.current = new window.YT.Player('youtube-player-host', {
        height: '0',
        width: '0',
        videoId: currentSong.youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onReady: (event: any) => {
            setPlayerReady(true);
            event.target.setVolume(volume * 100);
            setDuration(event.target.getDuration());
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              startTimeUpdate();
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
              stopTimeUpdate();
            } else if (event.data === window.YT.PlayerState.ENDED) {
              nextSong();
            }
          },
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    return () => {
      stopTimeUpdate();
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (playerReady && playerRef.current) {
      playerRef.current.loadVideoById(currentSong.youtubeId);
      if (isPlaying) playerRef.current.playVideo();
    }
  }, [currentSongIndex]);

  useEffect(() => {
    if (playerReady && playerRef.current) {
      if (isPlaying) playerRef.current.playVideo();
      else playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (playerReady && playerRef.current) {
      playerRef.current.setVolume(volume * 100);
    }
  }, [volume]);

  const startTimeUpdate = () => {
    if (timeUpdateInterval.current) clearInterval(timeUpdateInterval.current);
    timeUpdateInterval.current = window.setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
        const d = playerRef.current.getDuration();
        if (d && d !== duration) setDuration(d);
      }
    }, 500);
  };

  const stopTimeUpdate = () => {
    if (timeUpdateInterval.current) clearInterval(timeUpdateInterval.current);
  };

  // High-Quality Simulated Visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const barCount = 50;
    const bars: number[] = new Array(barCount).fill(0);
    const targetBars: number[] = new Array(barCount).fill(0);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / barCount;

      for (let i = 0; i < barCount; i++) {
        if (isPlaying) {
          if (Math.random() > 0.8) {
            targetBars[i] = Math.random() * canvas.height * 0.7 + canvas.height * 0.15;
          }
          bars[i] += (targetBars[i] - bars[i]) * 0.15;
        } else {
          bars[i] *= 0.92;
        }

        const h = bars[i];
        const x = i * barWidth;
        const y = (canvas.height - h) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + h);
        gradient.addColorStop(0, `${currentSong.color}66`);
        gradient.addColorStop(0.5, currentSong.color);
        gradient.addColorStop(1, `${currentSong.color}66`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x + 1.5, y, barWidth - 3, h, 3);
        ctx.fill();
      }
    };

    draw();
    return () => cancelAnimationFrame(animationRef.current);
  }, [currentSong.color, isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % mockSongs.length);
    setCurrentTime(0);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + mockSongs.length) % mockSongs.length);
    setCurrentTime(0);
  };

  const toggleLike = (id: string) => {
    setLikedSongs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume || 0.7);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (playerRef.current && playerRef.current.seekTo) {
      playerRef.current.seekTo(time, true);
    }
  };

  const filteredSongs = useMemo(() => {
    if (currentView === 'liked') return mockSongs.filter(s => likedSongs.includes(s.id));
    return mockSongs;
  }, [currentView, likedSongs]);

  const handleSidebarSelect = (view: 'home' | 'browse' | 'liked') => {
    setCurrentView(view);
    if (isMobileProp) setShowSidebar(false);
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#050505] text-zinc-100 overflow-hidden font-sans select-none border border-white/5 rounded-2xl shadow-inner">
      <div id="youtube-player-host" className="fixed -top-[1000px] -left-[1000px] opacity-0 pointer-events-none"></div>

      {isMobileProp && !showSidebar && (
        <div className="flex h-12 items-center px-4 bg-black/20 border-b border-white/5">
           <button onClick={() => setShowSidebar(true)} className="text-blue-400 flex items-center gap-1 font-bold text-xs uppercase">
             <ChevronLeft size={18} /> Library
           </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar */}
        <aside className={`${isMobileProp ? (showSidebar ? 'w-full' : 'hidden') : (isCompact ? 'w-20' : 'w-64')} bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col shrink-0 transition-all duration-300`}>
          <div className="p-4 md:p-6 flex flex-col gap-8 md:gap-10 overflow-y-auto no-scrollbar flex-1">
            <div className="flex items-center gap-3 px-1 md:px-2 shrink-0">
               <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-zinc-200 to-zinc-500 rounded-2xl flex items-center justify-center shadow-xl shrink-0">
                  <Music size={24} className="text-black" />
               </div>
               {(!isCompact || !!isMobileProp) && (
                 <div className="flex flex-col">
                    <span className="font-black text-lg tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">Identity</span>
                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Music OS</span>
                 </div>
               )}
            </div>

            <nav className="space-y-6 md:space-y-8 shrink-0">
              <div className="space-y-1">
                {(!isCompact || !!isMobileProp) && <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] px-4 mb-3">Discovery</p>}
                <SidebarItem icon={<LayoutGrid size={18} />} label="Home" active={currentView === 'home'} onClick={() => handleSidebarSelect('home')} isCompact={!!isCompact && !isMobileProp} />
                <SidebarItem icon={<Search size={18} />} label="Browse" active={currentView === 'browse'} onClick={() => handleSidebarSelect('browse')} isCompact={!!isCompact && !isMobileProp} />
              </div>

              <div className="space-y-1">
                {(!isCompact || !!isMobileProp) && <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] px-4 mb-3">Library</p>}
                <SidebarItem icon={<Heart size={18} fill={currentView === 'liked' ? "currentColor" : "none"} />} label="Liked" active={currentView === 'liked'} onClick={() => handleSidebarSelect('liked')} isCompact={!!isCompact && !isMobileProp} />
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={`${isMobileProp && showSidebar ? 'hidden' : 'flex'} flex-1 flex flex-col relative overflow-hidden bg-zinc-950`}>
          <div className="absolute inset-0 transition-colors duration-2000 opacity-20 pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 50%, ${currentSong.color} 0%, transparent 80%)` }} />

          <div className="flex-1 overflow-y-auto relative z-10 scroll-smooth flex flex-col no-scrollbar">
             <AnimatePresence mode="wait">
               <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center w-full min-h-full">
                    {currentView === 'home' ? (
                      <div className="max-w-3xl w-full flex flex-col items-center justify-center flex-1 p-6 md:p-12">
                        <div className={`relative ${isShort ? 'mb-4' : 'mb-8 md:mb-16'} shrink w-full max-w-[200px] sm:max-w-[300px] md:max-w-[400px] aspect-square flex items-center justify-center`}>
                           <motion.div
                             animate={isPlaying ? { boxShadow: [`0 20px 50px rgba(0,0,0,0.5)`, `0 20px 120px ${currentSong.color}44`, `0 20px 50px rgba(0,0,0,0.5)`] } : {}}
                             transition={{ duration: 3, repeat: Infinity }}
                             className="w-full h-full rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl"
                           >
                              <img src={currentSong.cover} className="w-full h-full object-cover" alt="" />
                           </motion.div>

                           <div className="absolute -bottom-10 md:-bottom-12 left-1/2 -translate-x-1/2 w-[80%] h-16 md:h-20 pointer-events-none">
                              <canvas ref={canvasRef} width={360} height={100} className="w-full h-full" />
                           </div>
                        </div>

                        <div className="text-center shrink-0">
                          <h1 className={`${isCompact ? 'text-2xl md:text-3xl' : 'text-7xl lg:text-8xl'} font-black mb-3 md:mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 drop-shadow-2xl leading-tight px-4`}>{currentSong.title}</h1>
                          <p className={`${isCompact ? 'text-sm md:text-base' : 'text-2xl lg:text-3xl'} text-zinc-400 font-bold mb-6 md:mb-12 px-4`}>{currentSong.artist} • {currentSong.album}</p>

                          <div className="flex items-center justify-center gap-4 md:gap-8">
                             <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={togglePlay}
                              className={`px-6 py-2.5 ${isCompact ? 'md:px-10' : 'md:px-12 md:py-5'} bg-white text-black rounded-full font-black text-sm md:text-xl flex items-center gap-2 md:gap-4 shadow-2xl transition-all`}
                             >
                               {isPlaying ? <Pause fill="black" size={isMobile ? 18 : 28} /> : <Play fill="black" size={isMobile ? 18 : 28} className="ml-1" />}
                                {!isMobile && (isPlaying ? "PAUSE" : "PLAY NOW")}
                             </motion.button>
                             <button className="p-3.5 md:p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/10 transition-all text-white"><PlusCircle size={isMobile ? 20 : 32} /></button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full max-w-6xl flex flex-col text-left p-6 md:p-12">
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 md:gap-10 mb-8 md:mb-16 shrink-0 text-center sm:text-left">
                           <div className="w-32 h-32 md:w-56 md:h-56 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden shrink-0">
                              <img src={currentView === 'liked' ? (likedSongs.length > 0 ? mockSongs.find(s => s.id === likedSongs[0])?.cover : mockSongs[0].cover) : mockSongs[0].cover} className="w-full h-full object-cover" alt="" />
                           </div>
                           <div className="pb-2 md:pb-4">
                              <p className="text-[10px] md:text-xs font-black text-zinc-500 uppercase tracking-widest mb-2 md:mb-4">Playlist</p>
                              <h2 className={`${isCompact ? 'text-3xl' : 'text-7xl lg:text-8xl'} font-black tracking-tighter mb-4 md:mb-6 leading-none capitalize`}>{currentView}</h2>
                              <p className="text-zinc-400 font-bold text-sm md:text-lg">{filteredSongs.length} tracks</p>
                           </div>
                        </div>

                        <div className="w-full overflow-x-hidden">
                          <table className="w-full border-collapse">
                            <thead className="sticky top-0 bg-zinc-950 z-20">
                              <tr className="text-zinc-600 text-[10px] md:text-[11px] uppercase tracking-[0.25em] border-b border-white/5">
                                <th className="py-4 md:py-5 px-2 md:px-6 w-8 md:w-16 text-left font-medium">#</th>
                                <th className="py-4 md:py-5 px-4 md:px-6 text-left font-medium">Title</th>
                                {!isMobile && <th className="py-4 md:py-5 px-4 md:px-6 text-left font-medium hidden sm:table-cell">Album</th>}
                                <th className="py-4 md:py-5 px-4 md:px-6 w-16 md:w-28 text-right font-medium">Time</th>
                                <th className="py-4 md:py-5 px-4 md:px-6 w-12 md:w-16"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/0">
                              {filteredSongs.map((song, idx) => (
                                <tr
                                  key={song.id}
                                  onClick={() => { setCurrentSongIndex(mockSongs.findIndex(s => s.id === song.id)); setIsPlaying(true); }}
                                  className={`group cursor-pointer hover:bg-white/5 transition-all duration-300 ${currentSong.id === song.id ? 'bg-white/10 shadow-inner' : ''}`}
                                >
                                  <td className="py-4 md:py-6 px-2 md:px-6 text-zinc-600 font-mono text-[10px] md:text-xs">
                                    {currentSong.id === song.id && isPlaying ? (
                                      <div className="flex items-end gap-0.5 h-3 md:h-4">
                                        <div className="w-1 bg-white animate-[bounce_1s_infinite_0.1s] rounded-full" />
                                        <div className="w-1 bg-white animate-[bounce_1s_infinite_0.3s] rounded-full" />
                                        <div className="w-1 bg-white animate-[bounce_1s_infinite_0.5s] rounded-full" />
                                      </div>
                                    ) : idx + 1}
                                  </td>
                                  <td className="py-4 md:py-6 px-4 md:px-6 flex items-center gap-3 md:gap-5 min-w-0">
                                    <img src={song.cover} className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl shadow-xl border border-white/5 shrink-0" alt="" />
                                    <div className="min-w-0 flex-1">
                                      <p className={`font-bold text-xs md:text-base truncate ${currentSong.id === song.id ? 'text-blue-400' : 'text-white'}`}>{song.title}</p>
                                      <p className="text-[9px] md:text-xs text-zinc-500 font-bold mt-1 uppercase tracking-wider truncate">{song.artist}</p>
                                    </div>
                                  </td>
                                  {!isMobile && <td className="py-4 md:py-6 px-4 md:px-6 text-xs md:text-sm text-zinc-400 font-bold tracking-tight hidden sm:table-cell truncate">{song.album}</td>}
                                  <td className="py-4 md:py-6 px-4 md:px-6 text-right font-mono text-[10px] md:text-xs text-zinc-500 font-bold shrink-0">{formatTime(song.duration)}</td>
                                  <td className="py-4 md:py-6 px-4 md:px-6 shrink-0 text-right">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); toggleLike(song.id); }}
                                      className={`transition-all duration-300 ${likedSongs.includes(song.id) ? 'text-blue-500 scale-110' : 'text-zinc-700 opacity-0 group-hover:opacity-100 hover:text-white'}`}
                                    >
                                      <Heart size={18} fill={likedSongs.includes(song.id) ? "currentColor" : "none"} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                              <tr className="h-24"><td colSpan={isMobile ? 4 : 5}></td></tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
               </motion.div>
             </AnimatePresence>
          </div>
        </main>
      </div>

      <footer className={`${isMobileProp ? 'h-20' : 'h-32'} bg-black border-t border-white/5 px-4 md:px-6 lg:px-12 flex items-center justify-between gap-4 shrink-0 relative z-30 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] transition-all`}>
        <div className={`flex items-center gap-3 md:gap-4 ${isCompact ? 'w-10 md:w-16' : 'flex-1 min-w-0'} overflow-hidden`}>
          <div className="relative group overflow-hidden rounded-lg md:rounded-2xl shadow-2xl border border-white/10 shrink-0">
            <img src={currentSong.cover} className={`${isMobileProp ? 'w-10 h-10' : 'w-12 h-12 md:w-16 md:h-16'} object-cover transition-transform duration-700 group-hover:scale-110`} alt="" />
          </div>
          {!isCompact && (
            <div className="overflow-hidden flex flex-col justify-center min-w-0">
              <h4 className="font-black text-xs md:text-sm truncate hover:underline cursor-pointer tracking-tight" onClick={() => setCurrentView('home')}>{currentSong.title}</h4>
              <p className="text-[9px] md:text-[11px] text-zinc-500 truncate hover:text-white transition-colors cursor-pointer font-black uppercase tracking-widest">{currentSong.artist}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-1 md:gap-3 flex-[2] max-w-2xl min-w-0">
          <div className="flex items-center gap-4 md:gap-8">
            {!isCompact && <Shuffle size={18} className="text-zinc-600 hover:text-white cursor-pointer transition-colors" />}
            <SkipBack onClick={prevSong} size={isMobileProp ? 20 : 30} className="text-zinc-400 hover:text-white cursor-pointer transition-all transform active:scale-90 shrink-0" fill="currentColor" />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className={`${isMobileProp ? 'w-8 h-8' : 'w-12 h-12 md:w-14 md:h-14'} rounded-full bg-white text-black flex items-center justify-center shadow-2xl transition-all shrink-0`}
            >
              {isPlaying ? <Pause size={isMobileProp ? 20 : 30} fill="black" /> : <Play size={isMobileProp ? 20 : 30} fill="black" className="ml-1" />}
            </motion.button>
            <SkipForward onClick={nextSong} size={isMobileProp ? 20 : 30} className="text-zinc-400 hover:text-white cursor-pointer transition-all transform active:scale-90 shrink-0" fill="currentColor" />
            {!isCompact && <Repeat size={18} className="text-zinc-600 hover:text-white cursor-pointer transition-colors" />}
          </div>

          <div className="w-full flex items-center gap-2 md:gap-4">
            <span className="text-[8px] md:text-[10px] text-zinc-500 font-mono w-8 md:w-10 text-right font-bold shrink-0">{formatTime(currentTime)}</span>
            <div className="flex-1 h-1 bg-white/10 rounded-full relative group cursor-pointer overflow-hidden">
               <input
                  type="range"
                  min="0"
                  max={duration || currentSong.duration}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
               />
               <div className="absolute h-full bg-gradient-to-r from-blue-600 to-blue-400 group-hover:from-blue-500 group-hover:to-blue-300 transition-colors" style={{ width: `${(currentTime / (duration || currentSong.duration)) * 100}%` }} />
            </div>
            <span className="text-[8px] md:text-[10px] text-zinc-500 font-mono w-8 md:w-10 font-bold shrink-0">{formatTime(duration || currentSong.duration)}</span>
          </div>
        </div>

        {!isCompact ? (
          <div className={`flex items-center justify-end gap-3 md:gap-4 flex-1 min-w-0`}>
            <div className={`flex items-center gap-2 bg-white/5 p-2 px-3 md:px-4 rounded-xl md:rounded-2xl border border-white/5 w-32 md:w-44 group hover:bg-white/10 transition-all shrink-0`}>
              <button onClick={toggleMute} className="shrink-0 transition-colors">
                {volume === 0 ? <VolumeX size={18} className="text-red-500" /> :
                 volume < 0.5 ? <Volume1 size={18} className="text-zinc-400" /> :
                 <Volume2 size={18} className="text-zinc-100" />}
              </button>
              <div className="flex-1 h-1 bg-white/10 rounded-full relative overflow-hidden group cursor-pointer hidden sm:block">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="absolute h-full bg-white group-hover:bg-blue-400 transition-colors" style={{ width: `${volume * 100}%` }} />
              </div>
            </div>

            <button
              onClick={() => {
                if (currentWindow?.isMaximized) restoreMaximizedWindow(windowId!);
                else maximizeWindow(windowId!, window.innerWidth, window.innerHeight);
              }}
              className="p-2 md:p-3 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all shrink-0"
            >
              {currentWindow?.isMaximized ? <Minimize2 size={20} className="text-blue-500" /> : <Maximize2 size={20} />}
            </button>
          </div>
        ) : (
          <div className="w-10 md:w-16 shrink-0" />
        )}
      </footer>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick, isCompact }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void, isCompact: boolean }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center ${isCompact ? 'justify-center' : 'justify-start'} gap-4 px-2 md:px-5 py-3 md:py-4 text-sm font-black rounded-xl md:rounded-2xl transition-all duration-500 ${active ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-2xl shadow-blue-500/30' : 'text-zinc-500 hover:text-zinc-100 hover:bg-white/5'}`}>
      <span className={`shrink-0 transition-transform duration-500 ${active ? 'scale-110 rotate-3' : 'group-hover:scale-110'}`}>{icon}</span>
      {!isCompact && <span className="tracking-tight truncate">{label}</span>}
    </button>
  );
}
