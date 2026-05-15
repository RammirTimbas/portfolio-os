import { motion } from "framer-motion";
import { Minus, Square, X } from "lucide-react";
import type { ReactNode } from "react";
import { useRef, useCallback, useEffect } from "react";
import ResizeHandle from "./ResizeHandle";

interface Props {
  title: string;
  zIndex: number;
  isFocused: boolean;
  isMaximized: boolean;
  isMinimized?: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  children: ReactNode;
  onMouseDown: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onResize: (updates: { width?: number; height?: number; x?: number; y?: number }) => void;
}

export default function WindowFrame({
  title,
  zIndex,
  isFocused,
  isMaximized,
  isMinimized,
  position,
  size,
  children,
  onMouseDown,
  onClose,
  onMinimize,
  onMaximize,
  onResize,
}: Props) {
  // Track interaction state in refs to avoid closure staleness in global listeners
  const stateRef = useRef({
    position,
    size,
    onResize,
    interaction: {
      action: null as "drag" | "resize" | null,
      startX: 0,
      startY: 0,
      startPos: { x: 0, y: 0 },
      startSize: { width: 0, height: 0 },
      direction: "" as "right" | "bottom" | "corner",
    }
  });

  // Keep refs in sync with latest props
  useEffect(() => {
    stateRef.current.position = position;
    stateRef.current.size = size;
    stateRef.current.onResize = onResize;
  }, [position, size, onResize]);

  const handleGlobalPointerMove = useCallback((e: PointerEvent) => {
    const state = stateRef.current;
    if (!state.interaction.action) return;

    const deltaX = e.clientX - state.interaction.startX;
    const deltaY = e.clientY - state.interaction.startY;

    if (state.interaction.action === "drag") {
      state.onResize({
        x: state.interaction.startPos.x + deltaX,
        y: state.interaction.startPos.y + deltaY,
      });
    } else if (state.interaction.action === "resize") {
      const minWidth = 420;
      const minHeight = 300;
      const updates: { width?: number; height?: number } = {};

      if (state.interaction.direction === "right" || state.interaction.direction === "corner") {
        updates.width = Math.max(minWidth, state.interaction.startSize.width + deltaX);
      }
      if (state.interaction.direction === "bottom" || state.interaction.direction === "corner") {
        updates.height = Math.max(minHeight, state.interaction.startSize.height + deltaY);
      }
      state.onResize(updates);
    }
  }, []);

  const handleGlobalPointerUp = useCallback(() => {
    stateRef.current.interaction.action = null;
    document.body.style.userSelect = "";
    window.removeEventListener("pointermove", handleGlobalPointerMove);
    window.removeEventListener("pointerup", handleGlobalPointerUp);
  }, [handleGlobalPointerMove]);

  const startInteraction = (
    e: React.PointerEvent,
    action: "drag" | "resize",
    direction: "right" | "bottom" | "corner" = "right"
  ) => {
    if (e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    stateRef.current.interaction = {
      action,
      startX: e.clientX,
      startY: e.clientY,
      startPos: { ...position },
      startSize: { ...size },
      direction,
    };

    document.body.style.userSelect = "none";
    if (action === "drag") onMouseDown();

    window.addEventListener("pointermove", handleGlobalPointerMove);
    window.addEventListener("pointerup", handleGlobalPointerUp);
  };

  // Cleanup listeners if the component unmounts
  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handleGlobalPointerMove);
      window.removeEventListener("pointerup", handleGlobalPointerUp);
    };
  }, [handleGlobalPointerMove, handleGlobalPointerUp]);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 0 : position.y,
        width: isMaximized ? "100%" : size.width,
        height: isMaximized ? "100%" : size.height,
        zIndex,
        display: isMinimized ? "none" : "flex",
        flexDirection: "column",
      }}
      onMouseDown={onMouseDown}
      className={`
        overflow-hidden
        backdrop-blur-xl
        bg-zinc-900/80
        transition-[border-radius,border-width] duration-300
        ${isMaximized ? "border-0 rounded-none shadow-none" : "border rounded-2xl shadow-2xl"}
        ${isFocused ? "border-zinc-500" : "border-zinc-800"}
      `}
    >
      {!isMaximized && (
        <>
          <ResizeHandle
            className="bottom-0 left-0 h-1.5 w-full cursor-row-resize"
            onPointerDown={(e) => startInteraction(e, "resize", "bottom")}
          />
          <ResizeHandle
            className="right-0 top-12 h-[calc(100%-48px)] w-1.5 cursor-col-resize"
            onPointerDown={(e) => startInteraction(e, "resize", "right")}
          />
          <ResizeHandle
            className="bottom-0 right-0 h-4 w-4 cursor-nwse-resize z-[110]"
            onPointerDown={(e) => startInteraction(e, "resize", "corner")}
          />
        </>
      )}

      <div
        onPointerDown={(e) => {
          if (isMaximized) return;
          if ((e.target as HTMLElement).closest("button")) return;
          startInteraction(e, "drag");
        }}
        className={`
          flex
          h-12
          shrink-0
          items-center
          justify-between
          border-b
          border-zinc-800
          px-4
          relative
          z-10
          ${isMaximized ? "cursor-default" : "cursor-move"}
        `}
      >
        <span className="text-sm font-medium text-white truncate mr-4 pointer-events-none select-none">
          {title}
        </span>

        <div className="flex items-center gap-2">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <Minus size={16} />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onMaximize(); }}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <Square size={14} />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-500/80 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto relative z-0">
        {children}
      </div>
    </motion.div>
  );
}
