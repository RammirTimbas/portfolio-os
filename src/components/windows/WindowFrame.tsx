import { motion } from "framer-motion";
import type { PanInfo } from "framer-motion";

import {
  Minus,
  Square,
  X,
} from "lucide-react";

import type { ReactNode } from "react";

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

  dragConstraints: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };

  children: ReactNode;

  onMouseDown: () => void;

  onClose: () => void;

  onMinimize: () => void;

  onMaximize: () => void;

  onDragEnd: (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
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
  onDragEnd,
  dragConstraints,
}: Props) {
  return (
    <motion.div
      drag={!isMaximized}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={dragConstraints}
      onDragEnd={onDragEnd}
      onMouseDown={onMouseDown}
      initial={false}
      animate={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
      }}
      transition={{
        type: "spring",
        damping: 24,
        stiffness: 260,
      }}
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
      style={{
        zIndex,
      }}
    >
      <div
        className="
          flex
          h-12
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