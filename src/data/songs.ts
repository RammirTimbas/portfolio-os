export interface LyricLine {
  time: number;
  text: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  url: string;
  duration: number;
  color: string;
  lyrics: LyricLine[];
}

export const songs: Song[] = [
  {
    id: "binary-dreams",
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
    id: "synthwave-nights",
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
    id: "electric-pulse",
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
