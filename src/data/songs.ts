export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  url: string;
  duration: number;
  color: string;
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
  }
];
