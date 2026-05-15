interface Props {
  className: string;
  onPointerDown: (event: React.PointerEvent) => void;
}

export default function ResizeHandle({ className, onPointerDown }: Props) {
  return (
    <div
      onPointerDown={onPointerDown}
      className={`absolute z-[100] pointer-events-auto bg-transparent select-none ${className}`}
    />
  );
}
