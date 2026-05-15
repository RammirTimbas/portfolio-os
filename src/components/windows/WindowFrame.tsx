import { motion } from "framer-motion";

import {
  Minus,
  Square,
  X,
} from "lucide-react";

import type { ReactNode } from "react";
import { useRef, useCallback, useState } from "react";

import ResizeHandle from "./ResizeHandle";

interface Props {
  title: string;

  zIndex: number;

  isFocused: boolean;

  isMaximized: boolean;

  position: {
    x: number;
    y: number;
  };

  size: {
    width: number;
    height: number;
  };

  children: ReactNode;

  onMouseDown: () => void;

  onClose: () => void;

  onMinimize: () => void;

  onMaximize: () => void;

  onResize: (
    updates: {
      width?: number;
      height?: number;
      x?: number;
      y?: number;
    }
  ) => void;
}

export default function WindowFrame({
  title,
  zIndex,
  isFocused,
  isMaximized,
  position,
  size,
  children,
  onMouseDown,
  onClose,
  onMinimize,
  onMaximize,
  onResize,
}: Props) {
  const [activeAction, setActiveAction] = useState<"drag" | "resize" | null>(null);

  const interactionData = useRef({
    startX: 0,
    startY: 0,
    startPos: { x: 0, y: 0 },
    startSize: { width: 0, height: 0 },
    direction: "" as "right" | "bottom" | "corner",
  });

  const onPointerMove = useCallback((moveEvent: React.PointerEvent) => {
    if (!activeAction) return;

    const deltaX = moveEvent.clientX - interactionData.current.startX;
    const deltaY = moveEvent.clientY - interactionData.current.startY;

    if (activeAction === "drag") {
      onResize({
        x: interactionData.current.startPos.x + deltaX,
        y: interactionData.current.startPos.y + deltaY,
      });
      return;
    }

    if (activeAction === "resize") {
      const minWidth = 420;
      const minHeight = 300;
      const updates: { width?: number; height?: number } = {};

      if (
        interactionData.current.direction === "right" ||
        interactionData.current.direction === "corner"
      ) {
        updates.width = Math.max(
          minWidth,
          interactionData.current.startSize.width + deltaX
        );
      }

      if (
        interactionData.current.direction === "bottom" ||
        interactionData.current.direction === "corner"
      ) {
        updates.height = Math.max(
          minHeight,
          interactionData.current.startSize.height + deltaY
        );
      }

      onResize(updates);
    }
  }, [activeAction, onResize]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    setActiveAction(null);
    document.body.style.userSelect = "";
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  function startInteraction(
    event: React.PointerEvent | React.MouseEvent,
    action: "drag" | "resize",
    direction: "right" | "bottom" | "corner" = "right"
  ) {
    // Only handle primary pointer (usually left click)
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();

    interactionData.current = {
      startX: event.clientX,
      startY: event.clientY,
      startPos: { ...position },
      startSize: { ...size },
      direction,
    };

    setActiveAction(action);
    document.body.style.userSelect = "none";
    if (action === "drag") onMouseDown();

    if ("setPointerCapture" in event.currentTarget) {
      (event.currentTarget as HTMLElement).setPointerCapture((event as React.PointerEvent).pointerId);
    }
  }

  return (
    <motion.div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
      }}
      onMouseDown={onMouseDown}
      className={`
        absolute
        overflow-hidden
        backdrop-blur-xl
        bg-zinc-900/80

        ${
          isMaximized
            ? "border-0 rounded-none"
            : `
              border
              rounded-2xl
              shadow-2xl
              ${
                isFocused
                  ? "border-zinc-500"
                  : "border-zinc-800"
              }
            `
        }
      `}
    >
      {!isMaximized && (
      <>
        <ResizeHandle
          className="
            bottom-[-2px]
            left-0
            h-3
            w-full
            cursor-row-resize
          "
          onPointerDown={(event) =>
            startInteraction(event, "resize", "bottom")
          }
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        />

        <ResizeHandle
          className="
            right-[-2px]
            top-0
            h-full
            w-3
            cursor-col-resize
          "
          onPointerDown={(event) =>
            startInteraction(event, "resize", "right")
          }
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        />

        <ResizeHandle
          className="
            bottom-[-2px]
            right-[-2px]
            h-5
            w-5
            cursor-nwse-resize
          "
          onPointerDown={(event) =>
            startInteraction(event, "resize", "corner")
          }
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        />
        </>
      )}
      <div
          onPointerDown={(e) => {
            if (isMaximized) return;
            // Don't start drag if clicking buttons
            if ((e.target as HTMLElement).closest("button")) return;
            startInteraction(e, "drag");
          }}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="
            flex
            h-12
            cursor-move
            items-center
            justify-between
            border-b
            border-zinc-800
            px-4
          "
        >
        <span className="text-sm font-medium text-white">
          {title}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={onMinimize}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              hover:bg-zinc-800
            "
          >
            <Minus size={16} />
          </button>

          <button
            onClick={onMaximize}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              hover:bg-zinc-800
            "
          >
            <Square size={14} />
          </button>

          <button
            onClick={onClose}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              hover:bg-red-500/80
            "
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="h-[calc(100%-48px)] overflow-auto">
        {children}
      </div>
    </motion.div>
  );
}