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

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", handleGlobalPointerMove);
      window.removeEventListener("pointerup", handleGlobalPointerUp);
    };
  }, [handleGlobalPointerMove, handleGlobalPointerUp]);

  // Modern Inset Maximization Constants
  const MARGIN = 12;
  const TASKBAR_RESERVE = 100;

  return (
    <motion.div
      initial={false}
      animate={{
        left: isMaximized ? MARGIN : position.x,
        top: isMaximized ? MARGIN : position.y,
        width: isMaximized ? `calc(100% - ${MARGIN * 2}px)` : size.width,
        height: isMaximized ? `calc(100% - ${TASKBAR_RESERVE}px)` : size.height,
      }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      style={{
        position: "absolute",
        zIndex,
        display: isMinimized ? "none" : "flex",
        flexDirection: "column",
      }}
      onMouseDown={onMouseDown}
      className={`
        overflow-hidden
        backdrop-blur-2xl
        bg-zinc-900/90
        border
        rounded-2xl
        shadow-2xl
        transition-colors duration-300
        ${isFocused ? "border-zinc-500/50 shadow-blue-500/10" : "border-white/5"}
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
        onDoubleClick={onMaximize}
        className={`
          flex
          h-12
          shrink-0
          items-center
          justify-between
          border-b
          border-white/5
          px-4
          relative
          z-10
          ${isMaximized ? "cursor-default" : "cursor-move"}
        `}
      >
        <span className="text-xs font-black text-zinc-400 uppercase tracking-widest truncate mr-4 pointer-events-none select-none">
          {title}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-all active:scale-90"
          >
            <Minus size={14} />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onMaximize(); }}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-all active:scale-90"
          >
            <Square size={12} />
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-red-500/20 hover:text-red-400 text-zinc-400 transition-all active:scale-90"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto relative z-0">
        {children}
      </div>
    </motion.div>
  );
}
