import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConfigState {
  wallpaper: string;
  taskbarAlignment: 'center' | 'left';
  showSeconds: boolean;
  reduceMotion: boolean;
  transparency: boolean;
  userName: string;
  defaultNoteContent: string;
  setWallpaper: (wallpaper: string) => void;
  setTaskbarAlignment: (alignment: 'center' | 'left') => void;
  setShowSeconds: (show: boolean) => void;
  setReduceMotion: (reduce: boolean) => void;
  setTransparency: (enabled: boolean) => void;
  setUserName: (name: string) => void;
  setDefaultNoteContent: (content: string) => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      wallpaper: 'default',
      taskbarAlignment: 'center',
      showSeconds: false,
      reduceMotion: false,
      transparency: true,
      userName: 'Rammir Timbas',
      defaultNoteContent: 'Welcome to my Portfolio OS! 🚀\n\n- Icons are movable\n- Right click for more options\n- Double click to open apps',

      setWallpaper: (wallpaper) => set({ wallpaper }),
      setTaskbarAlignment: (alignment) => set({ taskbarAlignment: alignment }),
      setShowSeconds: (show) => set({ showSeconds: show }),
      setReduceMotion: (reduce) => set({ reduceMotion: reduce }),
      setTransparency: (enabled) => set({ transparency: enabled }),
      setUserName: (name) => set({ userName: name }),
      setDefaultNoteContent: (content) => set({ defaultNoteContent: content }),
    }),
    {
      name: 'portfolio-config-v2',
    }
  )
);
