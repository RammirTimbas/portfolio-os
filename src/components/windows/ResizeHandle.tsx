interface Props {
  className: string;

  onPointerDown: (
    event: React.PointerEvent
  ) => void;

  onPointerMove: (
    event: React.PointerEvent
  ) => void;

  onPointerUp: (
    event: React.PointerEvent
  ) => void;
}

export default function ResizeHandle({
  className,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: Props) {
  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={`
        absolute
        z-50
        pointer-events-auto
        bg-transparent
        select-none
        ${className}
      `}
    />
  );
}