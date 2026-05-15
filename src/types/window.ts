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

  previousPosition?: WindowPosition;

  previousSize?: WindowSize;
}