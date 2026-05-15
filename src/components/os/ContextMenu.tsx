import { useEffect, useRef } from 'react';
import { useContextMenuStore } from '../../stores/contextMenuStore';

export default function ContextMenu() {
  const { isOpen, position, items, closeContextMenu } = useContextMenuStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeContextMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeContextMenu]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-[1000] min-w-[160px] overflow-hidden rounded-lg border border-white/10 bg-zinc-900/90 p-1 shadow-2xl backdrop-blur-xl"
      style={{ top: position.y, left: position.x }}
    >
      {items.map((item, index) => (
        <div key={index}>
          {item.divider ? (
            <div className="my-1 h-[1px] bg-white/10" />
          ) : (
            <button
              onClick={() => {
                item.action();
                closeContextMenu();
              }}
              className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-left text-xs text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              {item.icon && <item.icon size={14} />}
              <span>{item.label}</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
