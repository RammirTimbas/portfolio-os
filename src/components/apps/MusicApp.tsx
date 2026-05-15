import { useState, useEffect, useRef, useMemo } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Music,
  ListMusic,
  Mic2,
  Heart,
  Repeat,
  Shuffle,
  Maximize2,
  Minimize2,
  Volume1,
  VolumeX,
  PlusCircle,
  PlayCircle,
  ChevronUp,
  Search,
  LayoutGrid,
  Library as LibraryIcon
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
    youtubeId: "fHI8X4OXW68",
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
  const [volume, setVolume] = useState(0.7);
  const [prevVolume, setPrevVolume] = useState(0.7);
  const [showLyrics, setShowLyrics] = useState(false);
  const [likedSongs, setLikedSongs] = useState<string[]>(["1"]);
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
      playerRef.current = new window.YT.Player('youtube-player-container', {
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
      }
    }, 500);
  };

  const stopTimeUpdate = () => {
    if (timeUpdateInterval.current) clearInterval(timeUpdateInterval.current);
  };

  // Simulated Visualizer - Integrated and Beautiful
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const barCount = 48;
    const bars: number[] = new Array(barCount).fill(0);
    const targetBars: number[] = new Array(barCount).fill(0);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = canvas.width / barCount;

      for (let i = 0; i < barCount; i++) {
        if (isPlaying) {
          if (Math.random() > 0.8) {
            targetBars[i] = Math.random() * canvas.height * 0.6 + canvas.height * 0.1;
          }
          bars[i] += (targetBars[i] - bars[i]) * 0.12;
        } else {
          bars[i] *= 0.9;
        }

        const h = bars[i];
        const x = i * barWidth;
        const y = (canvas.height - h) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + h);
        gradient.addColorStop(0, `${currentSong.color}aa`);
        gradient.addColorStop(0.5, currentSong.color);
        gradient.addColorStop(1, `${currentSong.color}aa`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x + 1, y, barWidth - 2, h, 4);
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
    setIsPlaying(true);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + mockSongs.length) % mockSongs.length);
    setCurrentTime(0);
    setIsPlaying(true);
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
    <div className="flex h-full w-full flex-col bg-[#050505] text-zinc-100 overflow-hidden font-sans select-none border border-white/5 rounded-lg">
      {/* Hidden YouTube Container */}
      <div id="youtube-player-container" className="fixed -top-full -left-full opacity-0 pointer-events-none"></div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Refined and Beautiful */}
        <aside className="w-64 bg-black/40 backdrop-blur-2xl border-r border-white/5 p-6 flex flex-col gap-8 shrink-0">
          <div className="flex items-center gap-3 px-2">
             <div className="w-10 h-10 bg-gradient-to-br from-white to-zinc-400 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <Music size={22} className="text-black" />
             </div>
             <span className="font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">Identity</span>
          </div>

          <nav className="space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] px-3 mb-2">Discovery</p>
              <SidebarItem icon={<LayoutGrid size={18} />} label="Home" active={currentView === 'home'} onClick={() => setCurrentView('home')} />
              <SidebarItem icon={<Search size={18} />} label="Browse" active={currentView === 'browse'} onClick={() => setCurrentView('browse')} />
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] px-3 mb-2">Library</p>
              <SidebarItem icon={<Heart size={18} fill={currentView === 'liked' ? "currentColor" : "none"} />} label="Liked Songs" active={currentView === 'liked'} onClick={() => setCurrentView('liked')} />
              <SidebarItem icon={<LibraryIcon size={18} />} label="Your Library" onClick={() => {}} />
            </div>
          </nav>

          <div className="mt-auto px-2">
             <motion.div
               whileHover={{ scale: 1.05 }}
               className="rounded-2xl overflow-hidden aspect-square relative group cursor-pointer shadow-2xl border border-white/10"
               onClick={() => setShowLyrics(!showLyrics)}
             >
                <img src={currentSong.cover} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                   <Mic2 size={32} className="text-white drop-shadow-2xl" />
                </div>
             </motion.div>
          </div>
        </aside>

        {/* Main Content Area - Aligned and Beautiful */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-zinc-900/20 to-black">
          {/* Dynamic Background Glow */}
          <div className="absolute inset-0 transition-colors duration-1000 opacity-20 pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 50%, ${currentSong.color} 0%, transparent 70%)` }} />

          <div className="flex-1 flex overflow-hidden relative z-10">
             <AnimatePresence mode="wait">
               {showLyrics ? (
                 <motion.div key="lyrics" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="flex-1 flex flex-col p-20">
                    <div className="flex items-center gap-8 mb-16">
                       <img src={currentSong.cover} className="w-28 h-28 rounded-2xl shadow-2xl border border-white/10" alt="" />
                       <div>
                          <h3 className="text-5xl font-black tracking-tighter">{currentSong.title}</h3>
                          <p className="text-2xl text-zinc-400 font-bold">{currentSong.artist}</p>
                       </div>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-10 pb-40">
                       {currentSong.lyrics.map((line, i) => (
                         <p key={i} className={`text-6xl font-black tracking-tighter transition-all duration-700 ${i === currentLyricIndex ? 'text-white' : 'text-white/10'}`}>
                           {line.text}
                         </p>
                       ))}
                    </div>
                 </motion.div>
               ) : (
                 <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col p-12 items-center justify-center text-center">
                    {currentView === 'home' ? (
                      <div className="max-w-2xl w-full flex flex-col items-center">
                        <div className="relative mb-16">
                           <motion.div
                             animate={isPlaying ? { boxShadow: [`0 20px 50px rgba(0,0,0,0.5)`, `0 20px 100px ${currentSong.color}44`, `0 20px 50px rgba(0,0,0,0.5)`] } : {}}
                             transition={{ duration: 3, repeat: Infinity }}
                             className="w-[380px] h-[380px] rounded-[3.5rem] overflow-hidden border border-white/10 shadow-2xl"
                           >
                              <img src={currentSong.cover} className="w-full h-full object-cover" alt="" />
                           </motion.div>

                           {/* Visualizer Positioned Perfectly */}
                           <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-80 h-20 pointer-events-none">
                              <canvas ref={canvasRef} width={320} height={80} className="w-full h-full" />
                           </div>
                        </div>

                        <h1 className="text-7xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">{currentSong.title}</h1>
                        <p className="text-2xl text-zinc-400 font-bold mb-12">{currentSong.artist} • {currentSong.album}</p>

                        <div className="flex items-center justify-center gap-6">
                           <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={togglePlay}
                            className="px-12 py-5 bg-white text-black rounded-full font-black text-xl flex items-center gap-3 shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
                           >
                              {isPlaying ? <Pause fill="black" size={24} /> : <Play fill="black" size={24} className="ml-1" />}
                              {isPlaying ? "PAUSE" : "PLAY NOW"}
                           </motion.button>
                           <button className="p-5 bg-white/5 backdrop-blur-lg border border-white/10 rounded-full hover:bg-white/10 transition-all text-white"><PlusCircle size={28} /></button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full max-w-5xl h-full flex flex-col text-left">
                        <div className="flex items-end gap-8 mb-12">
                           <div className="w-48 h-48 rounded-3xl shadow-2xl border border-white/10 overflow-hidden shrink-0">
                              <img src={currentView === 'liked' ? (likedSongs.length > 0 ? mockSongs.find(s => s.id === likedSongs[0])?.cover : mockSongs[0].cover) : mockSongs[0].cover} className="w-full h-full object-cover" alt="" />
                           </div>
                           <div className="pb-2">
                              <p className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-3">Playlist</p>
                              <h2 className="text-7xl font-black tracking-tighter mb-4">{currentView === 'liked' ? 'Liked Songs' : 'Discovery'}</h2>
                              <p className="text-zinc-400 font-bold">{filteredSongs.length} songs • Total time {Math.floor(filteredSongs.reduce((acc, s) => acc + s.duration, 0) / 60)} min</p>
                           </div>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar pr-4">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] border-b border-white/5">
                                <th className="py-4 px-4 w-12 font-medium">#</th>
                                <th className="py-4 px-4 font-medium">Title</th>
                                <th className="py-4 px-4 font-medium">Album</th>
                                <th className="py-4 px-4 w-24 text-right font-medium">Time</th>
                                <th className="py-4 px-4 w-12"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/0">
                              {filteredSongs.map((song, idx) => (
                                <tr
                                  key={song.id}
                                  onClick={() => { setCurrentSongIndex(mockSongs.findIndex(s => s.id === song.id)); setIsPlaying(true); }}
                                  className={`group cursor-pointer hover:bg-white/5 transition-all ${currentSong.id === song.id ? 'bg-white/10' : ''}`}
                                >
                                  <td className="py-5 px-4 text-zinc-600 font-mono text-xs">
                                    {currentSong.id === song.id && isPlaying ? (
                                      <div className="flex items-end gap-0.5 h-3">
                                        <div className="w-1 bg-white animate-[bounce_1s_infinite_0.1s]" />
                                        <div className="w-1 bg-white animate-[bounce_1s_infinite_0.3s]" />
                                        <div className="w-1 bg-white animate-[bounce_1s_infinite_0.5s]" />
                                      </div>
                                    ) : idx + 1}
                                  </td>
                                  <td className="py-5 px-4 flex items-center gap-4">
                                    <img src={song.cover} className="w-12 h-12 rounded-xl shadow-lg border border-white/5" alt="" />
                                    <div>
                                      <p className={`font-bold text-sm ${currentSong.id === song.id ? 'text-blue-400' : 'text-white'}`}>{song.title}</p>
                                      <p className="text-xs text-zinc-500 font-medium">{song.artist}</p>
                                    </div>
                                  </td>
                                  <td className="py-5 px-4 text-sm text-zinc-400 font-medium">{song.album}</td>
                                  <td className="py-5 px-4 text-right font-mono text-xs text-zinc-500">{formatTime(song.duration)}</td>
                                  <td className="py-5 px-4">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); toggleLike(song.id); }}
                                      className={`transition-all ${likedSongs.includes(song.id) ? 'text-blue-500' : 'text-zinc-700 opacity-0 group-hover:opacity-100 hover:text-white'}`}
                                    >
                                      <Heart size={18} fill={likedSongs.includes(song.id) ? "currentColor" : "none"} />
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

      {/* Bottom Player Bar - Super Aligned and Beautiful */}
      <footer className="h-32 bg-black border-t border-white/5 px-10 flex items-center justify-between gap-12 shrink-0 relative z-30">
        {/* Track Info */}
        <div className="flex items-center gap-5 w-1/4 min-w-[320px]">
          <div className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-2xl border border-white/10" onClick={() => setShowLyrics(!showLyrics)}>
            <img src={currentSong.cover} className="w-16 h-16 object-cover transition-transform group-hover:scale-110" alt="" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ChevronUp size={24} className={`transition-transform duration-500 ${showLyrics ? 'rotate-180' : ''}`} />
            </div>
          </div>
          <div className="overflow-hidden">
            <h4 className="font-black text-sm truncate hover:underline cursor-pointer tracking-tight" onClick={() => setCurrentView('home')}>{currentSong.title}</h4>
            <p className="text-[11px] text-zinc-500 truncate hover:text-white transition-colors cursor-pointer font-bold">{currentSong.artist}</p>
          </div>
          <button onClick={() => toggleLike(currentSong.id)} className="ml-3 shrink-0">
            <Heart size={20} className={`transition-all duration-300 ${likedSongs.includes(currentSong.id) ? 'text-blue-500 scale-110' : 'text-zinc-600 hover:text-white'}`} fill={likedSongs.includes(currentSong.id) ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center gap-4 flex-1 max-w-2xl">
          <div className="flex items-center gap-10">
            <Shuffle size={18} className="text-zinc-600 hover:text-white cursor-pointer transition-colors" />
            <SkipBack onClick={prevSong} size={28} className="text-zinc-400 hover:text-white cursor-pointer transition-all transform active:scale-90" fill="currentColor" />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            >
              {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="ml-1" />}
            </motion.button>
            <SkipForward onClick={nextSong} size={28} className="text-zinc-400 hover:text-white cursor-pointer transition-all transform active:scale-90" fill="currentColor" />
            <Repeat size={18} className="text-zinc-600 hover:text-white cursor-pointer transition-colors" />
          </div>

          <div className="w-full flex items-center gap-4">
            <span className="text-[10px] text-zinc-500 font-mono w-10 text-right">{formatTime(currentTime)}</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full relative group cursor-pointer overflow-hidden">
               <input
                  type="range"
                  min="0"
                  max={currentSong.duration}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
               />
               <div className="absolute h-full bg-gradient-to-r from-blue-600 to-blue-400 group-hover:from-blue-500 group-hover:to-blue-300 transition-colors" style={{ width: `${(currentTime / currentSong.duration) * 100}%` }} />
            </div>
            <span className="text-[10px] text-zinc-500 font-mono w-10">{formatTime(currentSong.duration)}</span>
          </div>
        </div>

        {/* Side Controls - Corrected Maximize/Restore */}
        <div className="flex items-center justify-end gap-6 w-1/4 min-w-[320px]">
          <button onClick={() => setShowLyrics(!showLyrics)} className={`p-2.5 rounded-xl transition-all ${showLyrics ? 'bg-blue-500/10 text-blue-500' : 'text-zinc-500 hover:bg-white/5'}`}>
            <Mic2 size={18} />
          </button>

          <div className="flex items-center gap-3 bg-white/5 p-2 px-4 rounded-2xl border border-white/5 w-44">
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
            className="p-2.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            {currentWindow?.isMaximized ? <Minimize2 size={18} className="text-blue-500" /> : <Maximize2 size={18} />}
          </button>
        </div>
      </footer>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-4 px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 ${active ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-xl shadow-blue-500/20' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'}`}>
      <span className={active ? 'scale-110' : ''}>{icon}</span>
      {label}
    </button>
  );
}
