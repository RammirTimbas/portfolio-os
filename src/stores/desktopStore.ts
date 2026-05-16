import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface IconPosition {
  x: number;
  y: number;
}

interface DesktopState {
  iconPositions: Record<string, IconPosition>;
  setIconPosition: (appId: string, position: IconPosition) => void;
}

export const useDesktopStore = create<DesktopState>()(
  persist(
    (set) => ({
      iconPositions: {},
      setIconPosition: (appId, position) =>
        set((state) => ({
          iconPositions: {
            ...state.iconPositions,
            [appId]: position,
          },
        })),
    }),
    {
      name: 'portfolio-desktop-v1',
    }
  )
);
