import { useState, useEffect, useRef } from "react";
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
  Volume1,
  VolumeX,
  PlusCircle,
  PlayCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  url: string;
  duration: number; // in seconds
  lyrics: { time: number; text: string }[];
  color: string;
}

const mockSongs: Song[] = [
  {
    id: "1",
    title: "Binary Dreams",
    artist: "Identity OS",
    album: "System Rhythms",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&h=400&auto=format&fit=crop",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 372,
    color: "#3b82f6",
    lyrics: [
      { time: 0, text: "Welcome to the Identity Terminal" },
      { time: 4, text: "Systems online, core engaged" },
      { time: 8, text: "Processing binary dreams in a digital age" },
      { time: 12, text: "Code flowing through the neural gate" },
      { time: 16, text: "Building a world, creating our fate" },
      { time: 20, text: "Wait for the spark..." },
      { time: 24, text: "Watch the workstation come alive" },
      { time: 28, text: "In the 0s and 1s, we truly thrive" },
      { time: 32, text: "Identity.sys [Version 1.0.42]" },
      { time: 36, text: "Executing heartbeat protocol" },
    ]
  },
  {
    id: "2",
    title: "Synthwave Nights",
    artist: "Vector Soul",
    album: "Neon Horizon",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&h=400&auto=format&fit=crop",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: 425,
    color: "#8b5cf6",
    lyrics: [
      { time: 0, text: "Driving through the neon lights" },
      { time: 5, text: "Endless synthwave nights" },
      { time: 10, text: "Digital sunset on the grid" },
      { time: 15, text: "Memories that we hid" },
      { time: 20, text: "Retro vibes in every line" },
      { time: 25, text: "Caught within a loop of time" },
    ]
  },
  {
    id: "3",
    title: "Electric Pulse",
    artist: "Cyber Echo",
    album: "Neural Link",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&h=400&auto=format&fit=crop",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: 300,
    color: "#10b981",
    lyrics: [
      { time: 0, text: "Feel the electric pulse" },
      { time: 4, text: "Beating in your mind" },
      { time: 8, text: "The rhythm of the future" },
      { time: 12, text: "Is what you're gonna find" },
    ]
  }
];

export default function MusicApp() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [showLyrics, setShowLyrics] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const currentSong = mockSongs[currentSongIndex];

  // Initialize Audio Context for Visualizer
  const initVisualizer = () => {
    if (!audioRef.current || audioContextRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const analyzer = ctx.createAnalyser();
      const source = ctx.createMediaElementSource(audioRef.current);

      source.connect(analyzer);
      analyzer.connect(ctx.destination);
      analyzer.fftSize = 256;

      audioContextRef.current = ctx;
      analyzerRef.current = analyzer;
      sourceRef.current = source;
    } catch (e) {
      console.error("Visualizer initialization failed", e);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analyzerRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyzerRef.current?.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        ctx.fillStyle = `${currentSong.color}${Math.floor(dataArray[i]/2).toString(16).padStart(2, '0')}`;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();
    return () => cancelAnimationFrame(animationRef.current);
  }, [currentSong.color]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        if (audioContextRef.current?.state === 'suspended') {
          audioContextRef.current.resume();
        }
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  const togglePlay = () => {
    if (!audioContextRef.current) initVisualizer();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

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

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const currentLyricIndex = currentSong.lyrics.reduce((acc, lyric, index) => {
    if (currentTime >= lyric.time) return index;
    return acc;
  }, 0);

  // Sync lyrics scroll
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (showLyrics && lyricsContainerRef.current) {
      const activeElement = lyricsContainerRef.current.children[currentLyricIndex] as HTMLElement;
      if (activeElement) {
        lyricsContainerRef.current.scrollTo({
          top: activeElement.offsetTop - lyricsContainerRef.current.clientHeight / 2 + activeElement.clientHeight / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [currentLyricIndex, showLyrics]);

  return (
    <div className="flex h-full w-full flex-col bg-zinc-950 text-white overflow-hidden font-sans select-none">
      <audio
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextSong}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-60 bg-black p-6 flex flex-col gap-8 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <Music size={18} className="text-black" />
             </div>
             <span className="font-bold text-lg tracking-tight">Identity Music</span>
          </div>

          <nav className="space-y-4">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2">Menu</p>
              <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-bold text-white bg-zinc-900 rounded-md transition-all">
                <PlayCircle size={18} /> Home
              </button>
              <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-bold text-zinc-400 hover:text-white transition-all">
                <ListMusic size={18} /> Browse
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2">Your Library</p>
              <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-bold text-zinc-400 hover:text-white transition-all">
                <PlusCircle size={18} /> Create Playlist
              </button>
              <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-bold text-zinc-400 hover:text-white transition-all">
                <Heart size={18} /> Liked Songs
              </button>
            </div>
          </nav>

          <div className="mt-auto">
             <div className="rounded-xl overflow-hidden aspect-square relative group">
                <img src={currentSong.cover} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <Maximize2 size={24} />
                </div>
             </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-zinc-900/50 to-zinc-950">
          {/* Dynamic Background Glow */}
          <div
            className="absolute -top-40 -left-40 w-96 h-96 blur-[120px] rounded-full opacity-20 transition-colors duration-1000"
            style={{ backgroundColor: currentSong.color }}
          />

          <div className="flex-1 flex overflow-hidden">
             <AnimatePresence mode="wait">
               {showLyrics ? (
                 <motion.div
                   key="lyrics-view"
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 1.05 }}
                   className="flex-1 flex"
                 >
                    <div className="flex-1 flex flex-col p-12">
                       <div className="flex items-center gap-6 mb-12">
                          <img src={currentSong.cover} className="w-20 h-20 rounded-lg shadow-2xl" alt="" />
                          <div>
                             <h3 className="text-2xl font-black">{currentSong.title}</h3>
                             <p className="text-zinc-400 font-bold">{currentSong.artist}</p>
                          </div>
                       </div>

                       <div
                         ref={lyricsContainerRef}
                         className="flex-1 overflow-y-auto no-scrollbar space-y-6 pb-40"
                       >
                          {currentSong.lyrics.map((line, i) => (
                            <p
                              key={i}
                              className={`text-4xl font-black tracking-tight transition-all duration-500 cursor-pointer hover:text-white ${i === currentLyricIndex ? 'text-white opacity-100 scale-100' : 'text-white opacity-20 scale-95 blur-[1px]'}`}
                              onClick={() => {
                                if (audioRef.current) audioRef.current.currentTime = line.time;
                              }}
                            >
                              {line.text}
                            </p>
                          ))}
                       </div>
                    </div>
                 </motion.div>
               ) : (
                 <motion.div
                   key="main-view"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="flex-1 flex flex-col p-12 items-center justify-center text-center"
                 >
                    <div className="relative mb-12">
                       <motion.div
                         animate={isPlaying ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                         transition={{ duration: 2, repeat: Infinity }}
                         className="w-80 h-80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative"
                       >
                          <img src={currentSong.cover} className="w-full h-full object-cover" alt="" />
                       </motion.div>

                       {/* Canvas Visualizer Overlay */}
                       <canvas
                         ref={canvasRef}
                         width={320}
                         height={100}
                         className="absolute -bottom-6 left-0 right-0 h-20 w-80 opacity-60 pointer-events-none"
                       />
                    </div>

                    <h1 className="text-5xl font-black mb-4 tracking-tighter">{currentSong.title}</h1>
                    <p className="text-xl text-zinc-400 font-bold mb-8">{currentSong.artist} • {currentSong.album}</p>

                    <div className="flex items-center gap-4">
                       <button className="px-8 py-3 bg-white text-black rounded-full font-black text-sm hover:scale-105 transition-transform flex items-center gap-2">
                          <Play fill="black" size={16} /> LISTEN NOW
                       </button>
                       <button className="p-3 bg-zinc-900 border border-white/5 rounded-full hover:bg-zinc-800 transition-colors">
                          <PlusCircle size={20} />
                       </button>
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Spotify Bottom Bar */}
      <div className="h-24 bg-black border-t border-zinc-900 px-6 flex items-center justify-between gap-8 shrink-0 relative z-20">
        {/* Track Info */}
        <div className="flex items-center gap-4 w-1/4 min-w-[200px]">
          <div className="relative group">
            <img src={currentSong.cover} className="w-14 h-14 rounded shadow-lg" alt="" />
            <button
              onClick={() => setShowLyrics(!showLyrics)}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded"
            >
              <ChevronUp size={20} />
            </button>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate hover:underline cursor-pointer">{currentSong.title}</p>
            <p className="text-[11px] text-zinc-400 truncate hover:text-white hover:underline cursor-pointer">{currentSong.artist}</p>
          </div>
          <Heart size={16} className="text-zinc-500 hover:text-blue-500 cursor-pointer ml-2 transition-colors shrink-0" />
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
          <div className="flex items-center gap-6">
            <Shuffle size={16} className="text-zinc-500 hover:text-blue-500 transition-colors cursor-pointer" />
            <SkipBack onClick={prevSong} size={24} className="text-zinc-400 hover:text-white transition-colors cursor-pointer" />
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-all shadow-lg active:scale-95"
            >
              {isPlaying ? <Pause size={20} fill="black" /> : <Play size={20} fill="black" className="ml-1" />}
            </button>
            <SkipForward onClick={nextSong} size={24} className="text-zinc-400 hover:text-white transition-colors cursor-pointer" />
            <Repeat size={16} className="text-zinc-500 hover:text-blue-500 transition-colors cursor-pointer" />
          </div>

          <div className="w-full flex items-center gap-3">
            <span className="text-[10px] text-zinc-500 font-mono w-10 text-right">{formatTime(currentTime)}</span>
            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full relative group cursor-pointer">
               <input
                  type="range"
                  min="0"
                  max={currentSong.duration}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
               />
               <div
                  className="absolute h-full bg-white group-hover:bg-blue-500 rounded-full"
                  style={{ width: `${(currentTime / currentSong.duration) * 100}%` }}
               />
               <div
                  className="absolute h-3 w-3 bg-white rounded-full -top-[3px] shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `${(currentTime / currentSong.duration) * 100}%`, transform: 'translateX(-50%)' }}
               />
            </div>
            <span className="text-[10px] text-zinc-500 font-mono w-10">{formatTime(currentSong.duration)}</span>
          </div>
        </div>

        {/* Side Controls */}
        <div className="flex items-center justify-end gap-4 w-1/4 min-w-[200px]">
          <button
            onClick={() => setShowLyrics(!showLyrics)}
            className={`p-1 transition-colors ${showLyrics ? 'text-blue-500' : 'text-zinc-500 hover:text-white'}`}
          >
            <Mic2 size={16} />
          </button>

          <div className="flex items-center gap-2 group w-32">
            {volume === 0 ? <VolumeX size={16} className="text-zinc-500" /> :
             volume < 0.5 ? <Volume1 size={16} className="text-zinc-500" /> :
             <Volume2 size={16} className="text-zinc-500" />}

            <div className="flex-1 h-1 bg-zinc-800 rounded-full relative group cursor-pointer">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className="absolute h-full bg-white group-hover:bg-blue-500 rounded-full"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>

          <Maximize2 size={16} className="text-zinc-500 hover:text-white transition-colors cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

// Add these styles to index.css or a global stylesheet if needed
// .no-scrollbar::-webkit-scrollbar { display: none; }
