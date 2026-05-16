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
          id: 'welcome-note',
          type: 'sticky-note',
          // Positioned in the upper right corner
          position: {
            x: typeof window !== 'undefined' ? window.innerWidth - 360 : 800,
            y: 40
          },
          content: 'Welcome to Portfolio OS! \n\nFeel free to explore this OS-themed portfolio showcasing my projects and skills.',
          size: { width: 320, height: 320 }
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
      name: 'portfolio-desktop-v12',
    }
  )
);
