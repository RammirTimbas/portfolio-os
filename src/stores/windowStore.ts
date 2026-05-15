import { create } from 'zustand';

interface WindowState {
  id: string;
  appId: string;
  title: string;
  isFocused: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minSize: { width: number; height: number };
  prevSize?: { width: number; height: number };
  prevPosition?: { x: number; y: number };
  params?: any; // Added to support passing data to app components
}

interface WindowStore {
  windows: WindowState[];
  maxZIndex: number;
  openWindow: (window: Omit<WindowState, 'isFocused' | 'isMinimized' | 'zIndex'>) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  maximizeWindow: (id: string, width: number, height: number) => void;
  restoreMaximizedWindow: (id: string) => void;
  updateWindowSize: (id: string, updates: { width?: number; height?: number; x?: number; y?: number }) => void;
  minimizeAll: () => void;
}

export const useWindowStore = create<WindowStore>((set) => ({
  windows: [],
  maxZIndex: 10,

  openWindow: (windowData) => set((state) => {
    // If it's a specific project window, we allow multiples.
    // If it's a main app, we focus existing.
    const exists = !windowData.params && state.windows.find(w => w.appId === windowData.appId);

    if (exists) {
      return {
        windows: state.windows.map(w =>
          w.appId === windowData.appId
            ? { ...w, isFocused: true, isMinimized: false, zIndex: state.maxZIndex + 1 }
            : { ...w, isFocused: false }
        ),
        maxZIndex: state.maxZIndex + 1
      };
    }
    return {
      windows: [
        ...state.windows.map(w => ({ ...w, isFocused: false })),
        { ...windowData, isFocused: true, isMinimized: false, zIndex: state.maxZIndex + 1 }
      ],
      maxZIndex: state.maxZIndex + 1
    };
  }),

  closeWindow: (id) => set((state) => ({
    windows: state.windows.filter((w) => w.id !== id),
  })),

  focusWindow: (id) => set((state) => ({
    windows: state.windows.map((w) =>
      w.id === id ? { ...w, isFocused: true, zIndex: state.maxZIndex + 1 } : { ...w, isFocused: false }
    ),
    maxZIndex: state.maxZIndex + 1,
  })),

  minimizeWindow: (id) => set((state) => ({
    windows: state.windows.map((w) =>
      w.id === id ? { ...w, isMinimized: true, isFocused: false } : w
    ),
  })),

  restoreWindow: (id) => set((state) => ({
    windows: state.windows.map((w) =>
      w.id === id ? { ...w, isMinimized: false, isFocused: true, zIndex: state.maxZIndex + 1 } : { ...w, isFocused: false }
    ),
    maxZIndex: state.maxZIndex + 1,
  })),

  maximizeWindow: (id, screenWidth, screenHeight) => set((state) => ({
    windows: state.windows.map((w) =>
      w.id === id
        ? {
            ...w,
            isMaximized: true,
            prevPosition: w.position,
            prevSize: w.size,
            position: { x: 0, y: 0 },
            size: { width: screenWidth, height: screenHeight - 64 },
          }
        : w
    ),
  })),

  restoreMaximizedWindow: (id) => set((state) => ({
    windows: state.windows.map((w) =>
      w.id === id
        ? {
            ...w,
            isMaximized: false,
            position: w.prevPosition || w.position,
            size: w.prevSize || w.size,
          }
        : w
    ),
  })),

  updateWindowSize: (id, updates) => set((state) => ({
    windows: state.windows.map((w) => {
      if (w.id !== id) return w;
      return {
        ...w,
        position: {
          x: updates.x !== undefined ? updates.x : w.position.x,
          y: updates.y !== undefined ? updates.y : w.position.y,
        },
        size: {
          width: updates.width !== undefined ? updates.width : w.size.width,
          height: updates.height !== undefined ? updates.height : w.size.height,
        },
      };
    }),
  })),

  minimizeAll: () => set((state) => ({
    windows: state.windows.map((w) => ({ ...w, isMinimized: true, isFocused: false }))
  })),
}));
