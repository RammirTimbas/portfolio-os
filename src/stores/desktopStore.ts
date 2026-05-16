import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface WidgetData {
  id: string;
  type: 'sticky-note' | 'clock' | 'calendar' | 'weather' | 'performance';
  position: Position;
  content?: string;
  size?: Size;
}

interface DesktopState {
  iconPositions: Record<string, Position>;
  widgets: WidgetData[];
  setIconPosition: (appId: string, position: Position) => void;
  updateWidgetPosition: (id: string, position: Position) => void;
  updateWidgetSize: (id: string, size: Size) => void;
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
          position: { x: window.innerWidth - 400, y: 40 },
        },
        {
          id: 'default-note',
          type: 'sticky-note',
          position: { x: window.innerWidth - 400, y: 300 },
          content: 'Welcome to my Portfolio OS! 🚀\n\n- Icons are movable\n- Right click for more options\n- Double click to open apps',
          size: { width: 320, height: 280 }
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
      updateWidgetSize: (id, size) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, size } : w
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
