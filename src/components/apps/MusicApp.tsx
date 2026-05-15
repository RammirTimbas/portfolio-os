import { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Music,
  Mic2,
  Heart,
  Repeat,
  Shuffle,
  Maximize2,
  Minimize2,
  Volume1,
  VolumeX,
  PlusCircle,
  ChevronUp,
  Search,
  LayoutGrid,
  Library as LibraryIcon,
  Disc,
  ListMusic
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
  duration: number; // in seconds
  lyrics: { time: number; text: string }[];
  color: string;
}

const mockSongs: Song[] = [
  {
    id: "1",
    title: "Starboy",
    artist: "The Weeknd",
    album: "Starboy",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&h=400&auto=format&fit=crop",
    youtubeId: "34Na4j8AVgA",
    duration: 230,
    color: "#ef4444",
    lyrics: [
      { time: 0, text: "I'm tryna put you in the worst mood, ah" },
      { time: 4, text: "P1 cleaner than your church shoes, ah" },
      { time: 8, text: "Milli point two on the dashboard, ah" },
      { time: 12, text: "Wait, let me see if I can find more, ah" },
      { time: 16, text: "Look what you've done..." },
      { time: 20, text: "I'm a motherf***ing starboy" },
    ]
  },
  {
    id: "2",
    title: "Blinding Lights",
    artist: "The Weeknd",
    album: "After Hours",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&h=400&auto=format&fit=crop",
    youtubeId: "4NRXx6U8ABQ",
    duration: 200,
    color: "#f59e0b",
    lyrics: [
      { time: 0, text: "I've been tryna call" },
      { time: 5, text: "I've been on my own for long enough" },
      { time: 10, text: "Maybe you can show me how to love, maybe" },
      { time: 15, text: "I'm going through withdrawals" },
    ]
  },
  {
    id: "3",
    title: "Save Your Tears",
    artist: "The Weeknd",
    album: "After Hours",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&h=400&auto=format&fit=crop",
    youtubeId: "XXYlFuWEuKI",
    duration: 215,
    color: "#3b82f6",
    lyrics: [
      { time: 0, text: "I saw you dancing in a crowded room" },
      { time: 4, text: "You look so happy when I'm not with you" },
      { time: 8, text: "But then you saw me, caught you by surprise" },
    ]
  },
  {
    id: "4",
    title: "After Hours",
    artist: "The Weeknd",
    album: "After Hours",
    cover: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=400&h=400&auto=format&fit=crop",
    youtubeId: "f1r0XZLN090",
    duration: 362,
    color: "#8b5cf6",
    lyrics: [
      { time: 0, text: "Thought I almost died in my dream again" },
      { time: 6, text: "Fighting for my life, I couldn't breathe again" },
    ]
  }
];

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export default function MusicApp({ windowId }: { windowId?: string }) {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [prevVolume, setPrevVolume] = useState(0.7);
  const [showLyrics, setShowLyrics] = useState(false);
  const [likedSongs, setLikedSongs] = useState<string[]>(["1", "3"]);
  const [currentView, setCurrentView] = useState<'home' | 'browse' | 'liked'>('home');
  const [playerReady, setPlayerReady] = useState(false);

  const { maximizeWindow, restoreMaximizedWindow, windows } = useWindowStore();
  const currentWindow = windows.find(w => w.id === windowId);

  const playerRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const timeUpdateInterval = useRef<number>(0);

  const currentSong = mockSongs[currentSongIndex];

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

  const currentLyricIndex = currentSong.lyrics.reduce((acc, lyric, index) => {
    if (currentTime >= lyric.time) return index;
    return acc;
  }, 0);

  return (
    <div className="flex h-full w-full flex-col bg-[#050505] text-zinc-100 overflow-hidden font-sans select-none border border-white/5 rounded-2xl shadow-inner">
      {/* Hidden YouTube Container */}
      <div id="youtube-player-host" className="fixed -top-[1000px] -left-[1000px] opacity-0 pointer-events-none"></div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Modern Design */}
        <aside className="w-64 bg-black/40 backdrop-blur-3xl border-r border-white/5 p-6 flex flex-col gap-10 shrink-0">
          <div className="flex items-center gap-3 px-2">
             <div className="w-11 h-11 bg-gradient-to-br from-zinc-200 to-zinc-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Music size={24} className="text-black" />
             </div>
             <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">Identity</span>
                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Music OS</span>
             </div>
          </div>

          <nav className="space-y-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] px-4 mb-3">Discovery</p>
              <SidebarItem icon={<LayoutGrid size={18} />} label="Home" active={currentView === 'home'} onClick={() => setCurrentView('home')} />
              <SidebarItem icon={<Search size={18} />} label="Browse" active={currentView === 'browse'} onClick={() => setCurrentView('browse')} />
              <SidebarItem icon={<Disc size={18} />} label="New Releases" onClick={() => {}} />
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] px-4 mb-3">Library</p>
              <SidebarItem icon={<Heart size={18} fill={currentView === 'liked' ? "currentColor" : "none"} />} label="Liked Songs" active={currentView === 'liked'} onClick={() => setCurrentView('liked')} />
              <SidebarItem icon={<LibraryIcon size={18} />} label="Your Collection" onClick={() => {}} />
              <SidebarItem icon={<ListMusic size={18} />} label="Playlists" onClick={() => {}} />
            </div>
          </nav>

          <div className="mt-auto px-2">
             <motion.div
               whileHover={{ scale: 1.05 }}
               className="rounded-2xl overflow-hidden aspect-square relative group cursor-pointer shadow-2xl border border-white/10"
               onClick={() => setShowLyrics(!showLyrics)}
             >
                <img src={currentSong.cover} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                   <Mic2 size={32} className="text-white drop-shadow-2xl" />
                </div>
             </motion.div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-zinc-950">
          {/* Dynamic Ambient Background */}
          <div className="absolute inset-0 transition-colors duration-2000 opacity-20 pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 50%, ${currentSong.color} 0%, transparent 80%)` }} />

          <div className="flex-1 flex overflow-hidden relative z-10">
             <AnimatePresence mode="wait">
               {showLyrics ? (
                 <motion.div key="lyrics" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} className="flex-1 flex flex-col p-20 max-w-5xl mx-auto w-full">
                    <div className="flex items-center gap-10 mb-20">
                       <img src={currentSong.cover} className="w-32 h-32 rounded-3xl shadow-2xl border border-white/10" alt="" />
                       <div>
                          <h3 className="text-6xl font-black tracking-tighter mb-2">{currentSong.title}</h3>
                          <p className="text-3xl text-zinc-400 font-bold">{currentSong.artist}</p>
                       </div>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-12 pb-40">
                       {currentSong.lyrics.map((line, i) => (
                         <p key={i} className={`text-6xl font-black tracking-tighter transition-all duration-1000 ${i === currentLyricIndex ? 'text-white' : 'text-white/5 hover:text-white/20'}`}>
                           {line.text}
                         </p>
                       ))}
                    </div>
                 </motion.div>
               ) : (
                 <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col p-12 items-center justify-center text-center">
                    {currentView === 'home' ? (
                      <div className="max-w-3xl w-full flex flex-col items-center">
                        <div className="relative mb-20">
                           <motion.div
                             animate={isPlaying ? { boxShadow: [`0 20px 50px rgba(0,0,0,0.5)`, `0 20px 120px ${currentSong.color}44`, `0 20px 50px rgba(0,0,0,0.5)`] } : {}}
                             transition={{ duration: 3, repeat: Infinity }}
                             className="w-[420px] h-[420px] rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl"
                           >
                              <img src={currentSong.cover} className="w-full h-full object-cover" alt="" />
                           </motion.div>

                           {/* Visualizer Positioned Perfectly */}
                           <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-[360px] h-24 pointer-events-none">
                              <canvas ref={canvasRef} width={360} height={100} className="w-full h-full" />
                           </div>
                        </div>

                        <h1 className="text-8xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 drop-shadow-2xl">{currentSong.title}</h1>
                        <p className="text-3xl text-zinc-400 font-bold mb-14">{currentSong.artist} • {currentSong.album}</p>

                        <div className="flex items-center justify-center gap-8">
                           <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={togglePlay}
                            className="px-14 py-6 bg-white text-black rounded-full font-black text-2xl flex items-center gap-4 shadow-[0_15px_40px_rgba(255,255,255,0.2)]"
                           >
                              {isPlaying ? <Pause fill="black" size={28} /> : <Play fill="black" size={28} className="ml-1" />}
                              {isPlaying ? "PAUSE" : "PLAY NOW"}
                           </motion.button>
                           <button className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/10 transition-all text-white"><PlusCircle size={32} /></button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full max-w-6xl h-full flex flex-col text-left">
                        <div className="flex items-end gap-10 mb-16">
                           <div className="w-56 h-56 rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden shrink-0">
                              <img src={currentView === 'liked' ? (likedSongs.length > 0 ? mockSongs.find(s => s.id === likedSongs[0])?.cover : mockSongs[0].cover) : mockSongs[0].cover} className="w-full h-full object-cover" alt="" />
                           </div>
                           <div className="pb-4">
                              <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Playlist</p>
                              <h2 className="text-8xl font-black tracking-tighter mb-6">{currentView === 'liked' ? 'Liked Songs' : 'Discovery'}</h2>
                              <p className="text-zinc-400 font-bold text-lg">{filteredSongs.length} tracks • Total time {Math.floor(filteredSongs.reduce((acc, s) => acc + s.duration, 0) / 60)} min</p>
                           </div>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar pr-6">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="text-zinc-600 text-[11px] uppercase tracking-[0.25em] border-b border-white/5">
                                <th className="py-5 px-6 w-16 text-left font-medium">#</th>
                                <th className="py-5 px-6 text-left font-medium">Title</th>
                                <th className="py-5 px-6 text-left font-medium">Album</th>
                                <th className="py-5 px-6 w-28 text-right font-medium">Time</th>
                                <th className="py-5 px-6 w-16"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/0">
                              {filteredSongs.map((song, idx) => (
                                <tr
                                  key={song.id}
                                  onClick={() => { setCurrentSongIndex(mockSongs.findIndex(s => s.id === song.id)); setIsPlaying(true); }}
                                  className={`group cursor-pointer hover:bg-white/5 transition-all duration-300 ${currentSong.id === song.id ? 'bg-white/10 shadow-inner' : ''}`}
                                >
                                  <td className="py-6 px-6 text-zinc-600 font-mono text-xs">
                                    {currentSong.id === song.id && isPlaying ? (
                                      <div className="flex items-end gap-1 h-4">
                                        <div className="w-1.5 bg-white animate-[bounce_1s_infinite_0.1s] rounded-full" />
                                        <div className="w-1.5 bg-white animate-[bounce_1s_infinite_0.3s] rounded-full" />
                                        <div className="w-1.5 bg-white animate-[bounce_1s_infinite_0.5s] rounded-full" />
                                      </div>
                                    ) : idx + 1}
                                  </td>
                                  <td className="py-6 px-6 flex items-center gap-5">
                                    <img src={song.cover} className="w-14 h-14 rounded-2xl shadow-xl border border-white/5" alt="" />
                                    <div>
                                      <p className={`font-bold text-base ${currentSong.id === song.id ? 'text-blue-400' : 'text-white'}`}>{song.title}</p>
                                      <p className="text-xs text-zinc-500 font-bold mt-1 uppercase tracking-wider">{song.artist}</p>
                                    </div>
                                  </td>
                                  <td className="py-6 px-6 text-sm text-zinc-400 font-bold tracking-tight">{song.album}</td>
                                  <td className="py-6 px-6 text-right font-mono text-xs text-zinc-500 font-bold">{formatTime(song.duration)}</td>
                                  <td className="py-6 px-6">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); toggleLike(song.id); }}
                                      className={`transition-all duration-300 ${likedSongs.includes(song.id) ? 'text-blue-500 scale-110' : 'text-zinc-700 opacity-0 group-hover:opacity-100 hover:text-white'}`}
                                    >
                                      <Heart size={20} fill={likedSongs.includes(song.id) ? "currentColor" : "none"} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Modern Bottom Player Bar */}
      <footer className="h-32 bg-black border-t border-white/5 px-12 flex items-center justify-between gap-12 shrink-0 relative z-30 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        {/* Track Info */}
        <div className="flex items-center gap-6 w-1/4 min-w-[340px]">
          <div className="relative group cursor-pointer overflow-hidden rounded-[1.25rem] shadow-2xl border border-white/10" onClick={() => setShowLyrics(!showLyrics)}>
            <img src={currentSong.cover} className="w-16 h-16 object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ChevronUp size={24} className={`transition-transform duration-500 ${showLyrics ? 'rotate-180' : ''}`} />
            </div>
          </div>
          <div className="overflow-hidden">
            <h4 className="font-black text-sm truncate hover:underline cursor-pointer tracking-tight mb-1" onClick={() => setCurrentView('home')}>{currentSong.title}</h4>
            <p className="text-[11px] text-zinc-500 truncate hover:text-white transition-colors cursor-pointer font-black uppercase tracking-widest">{currentSong.artist}</p>
          </div>
          <button onClick={() => toggleLike(currentSong.id)} className="ml-4 shrink-0 transition-transform active:scale-75">
            <Heart size={20} className={`transition-all duration-300 ${likedSongs.includes(currentSong.id) ? 'text-blue-500 scale-110' : 'text-zinc-700 hover:text-white'}`} fill={likedSongs.includes(currentSong.id) ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center gap-4 flex-1 max-w-2xl">
          <div className="flex items-center gap-10">
            <Shuffle size={18} className="text-zinc-600 hover:text-white cursor-pointer transition-colors" />
            <SkipBack onClick={prevSong} size={30} className="text-zinc-400 hover:text-white cursor-pointer transition-all transform active:scale-90" fill="currentColor" />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all"
            >
              {isPlaying ? <Pause size={30} fill="black" /> : <Play size={30} fill="black" className="ml-1" />}
            </motion.button>
            <SkipForward onClick={nextSong} size={30} className="text-zinc-400 hover:text-white cursor-pointer transition-all transform active:scale-90" fill="currentColor" />
            <Repeat size={18} className="text-zinc-600 hover:text-white cursor-pointer transition-colors" />
          </div>

          <div className="w-full flex items-center gap-4">
            <span className="text-[10px] text-zinc-500 font-mono w-12 text-right font-bold">{formatTime(currentTime)}</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full relative group cursor-pointer overflow-hidden">
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
            <span className="text-[10px] text-zinc-500 font-mono w-12 font-bold">{formatTime(duration || currentSong.duration)}</span>
          </div>
        </div>

        {/* Improved Side Controls */}
        <div className="flex items-center justify-end gap-6 w-1/4 min-w-[340px]">
          <button onClick={() => setShowLyrics(!showLyrics)} className={`p-3 rounded-2xl transition-all ${showLyrics ? 'bg-blue-500/10 text-blue-500' : 'text-zinc-500 hover:bg-white/5 hover:text-white'}`}>
            <Mic2 size={18} />
          </button>

          <div className="flex items-center gap-3 bg-white/5 p-2 px-5 rounded-2xl border border-white/5 w-48 group hover:bg-white/10 transition-all">
            <button onClick={toggleMute} className="shrink-0 transition-colors">
              {volume === 0 ? <VolumeX size={18} className="text-red-500" /> :
               volume < 0.5 ? <Volume1 size={18} className="text-zinc-400" /> :
               <Volume2 size={18} className="text-zinc-100" />}
            </button>
            <div className="flex-1 h-1 bg-white/10 rounded-full relative overflow-hidden group cursor-pointer">
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
            className="p-3 text-zinc-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
          >
            {currentWindow?.isMaximized ? <Minimize2 size={20} className="text-blue-500" /> : <Maximize2 size={20} />}
          </button>
        </div>
      </footer>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-4 px-5 py-4 text-sm font-black rounded-2xl transition-all duration-500 ${active ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-2xl shadow-blue-500/30' : 'text-zinc-500 hover:text-zinc-100 hover:bg-white/5'}`}>
      <span className={`transition-transform duration-500 ${active ? 'scale-110 rotate-3' : 'group-hover:scale-110'}`}>{icon}</span>
      <span className="tracking-tight">{label}</span>
    </button>
  );
}
