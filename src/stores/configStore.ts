import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConfigState {
  wallpaper: string;
  setWallpaper: (wallpaper: string) => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      wallpaper: 'default',
      setWallpaper: (wallpaper) => set({ wallpaper }),
    }),
    {
      name: 'portfolio-config',
    }
  )
);
