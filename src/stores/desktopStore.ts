import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Position {
  x: number;
  y: number;
}

interface WidgetData {
  id: string;
  type: 'sticky-note' | 'clock' | 'calendar' | 'weather' | 'performance';
  position: Position;
  content?: string;
  size?: { width: number; height: number };
}

interface DesktopState {
  iconPositions: Record<string, Position>;
  widgets: WidgetData[];
  setIconPosition: (appId: string, position: Position) => void;
  updateWidgetPosition: (id: string, position: Position) => void;
  updateWidgetContent: (id: string, content: string) => void;
  addWidget: (widget: Omit<WidgetData, 'id'>) => void;
  removeWidget: (id: string) => void;
}

export const useDesktopStore = create<DesktopState>()(
  persist(
    (set) => ({
      iconPositions: {},
      widgets: [
        {
          id: 'default-clock',
          type: 'clock',
          position: { x: window.innerWidth - 300, y: 40 },
        },
        {
          id: 'default-note',
          type: 'sticky-note',
          position: { x: window.innerWidth - 300, y: 200 },
          content: 'Welcome to my Portfolio OS! 🚀\n\n- Icons are movable\n- Right click for more options\n- Double click to open apps',
        }
      ],
      setIconPosition: (appId, position) =>
        set((state) => ({
          iconPositions: {
            ...state.iconPositions,
            [appId]: position,
          },
        })),
      updateWidgetPosition: (id, position) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, position } : w
          ),
        })),
      updateWidgetContent: (id, content) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, content } : w
          ),
        })),
      addWidget: (widget) =>
        set((state) => ({
          widgets: [...state.widgets, { ...widget, id: crypto.randomUUID() }],
        })),
      removeWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
        })),
    }),
    {
      name: 'portfolio-desktop-v2',
    }
  )
);
