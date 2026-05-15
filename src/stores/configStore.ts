import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConfigState {
  wallpaper: string;
  taskbarAlignment: 'center' | 'left';
  showSeconds: boolean;
  reduceMotion: boolean;
  transparency: boolean;
  userName: string;
  setWallpaper: (wallpaper: string) => void;
  setTaskbarAlignment: (alignment: 'center' | 'left') => void;
  setShowSeconds: (show: boolean) => void;
  setReduceMotion: (reduce: boolean) => void;
  setTransparency: (enabled: boolean) => void;
  setUserName: (name: string) => void;
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

      setWallpaper: (wallpaper) => set({ wallpaper }),
      setTaskbarAlignment: (alignment) => set({ taskbarAlignment: alignment }),
      setShowSeconds: (show) => set({ showSeconds: show }),
      setReduceMotion: (reduce) => set({ reduceMotion: reduce }),
      setTransparency: (enabled) => set({ transparency: enabled }),
      setUserName: (name) => set({ userName: name }),
    }),
    {
      name: 'portfolio-config-v2',
    }
  )
);
