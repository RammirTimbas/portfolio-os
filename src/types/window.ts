export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowInstance {
  id: string;

  appId: string;

  title: string;

  isOpen: boolean;

  isMinimized: boolean;

  isFocused: boolean;

  isMaximized: boolean;

  zIndex: number;

  position: WindowPosition;

  size: WindowSize;

  minSize?: {
    width: number;
    height: number;
  };

  restoreBounds?: {
    position: {
      x: number;
      y: number;
    };
    size: {
      width: number;
      height: number;
    };
  };
}