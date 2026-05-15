import { create } from "zustand";

import type { WindowInstance } from "../types/window";

interface WindowStore {
  windows: WindowInstance[];

  highestZ: number;

  openWindow: (
    window: Omit<
      WindowInstance,
      "zIndex" | "isFocused" | "isOpen" | "isMinimized"
    >
  ) => void;

  closeWindow: (id: string) => void;

  focusWindow: (id: string) => void;

  minimizeWindow: (id: string) => void;

  restoreWindow: (id: string) => void;

  maximizeWindow: (
    id: string,
    viewportWidth: number,
    viewportHeight: number
  ) => void;

  restoreMaximizedWindow: (id: string) => void;

  updateWindowSize: (
    id: string,
    updates: {
      width?: number;
      height?: number;
      x?: number;
      y?: number;
    }
  ) => void;

  updateWindowPosition: (
    id: string,
    x: number,
    y: number
  ) => void;
}

export const useWindowStore = create<WindowStore>((set) => ({
  windows: [],

  highestZ: 1,

  openWindow: (window) =>
    set((state) => {
      const nextZ = state.highestZ + 1;

      return {
        highestZ: nextZ,

        windows: [
          ...state.windows.map((w) => ({
            ...w,
            isFocused: false,
          })),

          {
            ...window,

            zIndex: nextZ,

            isFocused: true,

            isOpen: true,

            isMinimized: false,
          },
        ],
      };
    }),

  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    })),

  focusWindow: (id) =>
    set((state) => {
      const nextZ = state.highestZ + 1;

      return {
        highestZ: nextZ,

        windows: state.windows.map((window) => ({
          ...window,

          isFocused: window.id === id,

          zIndex:
            window.id === id
              ? nextZ
              : window.zIndex,
        })),
      };
    }),

  minimizeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === id
          ? {
              ...window,
              isMinimized: true,
              isFocused: false,
            }
          : window
      ),
    })),

  restoreWindow: (id) =>
    set((state) => {
      const nextZ = state.highestZ + 1;

      return {
        highestZ: nextZ,

        windows: state.windows.map((window) => ({
          ...window,

          isMinimized:
            window.id === id
              ? false
              : window.isMinimized,

          isFocused: window.id === id,

          zIndex:
            window.id === id
              ? nextZ
              : window.zIndex,
        })),
      };
    }),

  updateWindowPosition: (id, x, y) =>
    set((state) => ({
      windows: state.windows.map((window) =>
        window.id === id
          ? {
              ...window,
              position: { x, y },
            }
          : window
      ),
    })),

  updateWindowSize: (id, updates) =>
  set((state) => ({
    windows: state.windows.map((window) =>
      window.id === id
        ? {
            ...window,
            size: {
              width: updates.width ?? window.size.width,
              height: updates.height ?? window.size.height,
            },
            position: {
              x: updates.x ?? window.position.x,
              y: updates.y ?? window.position.y,
            },
          }
        : window
    ),
  })),

  maximizeWindow: (id, viewportWidth, viewportHeight) =>
  set((state) => ({
    windows: state.windows.map((window) => {
      if (window.id !== id) return window;

      return {
        ...window,

        isMaximized: true,

        // SAVE SNAPSHOT ONLY ONCE
        restoreBounds: {
          position: { ...window.position },
          size: { ...window.size },
        },

        position: {
          x: 0,
          y: 0,
        },

        size: {
          width: viewportWidth,
          height: viewportHeight - 48,
        },
      };
    }),
  })),

  restoreMaximizedWindow: (id) =>
  set((state) => ({
    windows: state.windows.map((window) => {
      if (window.id !== id) return window;

      if (!window.restoreBounds) return window;

      return {
        ...window,

        isMaximized: false,

        position: window.restoreBounds.position,

        size: window.restoreBounds.size,

        restoreBounds: undefined,
      };
    }),
  })),
  

}));