import { useEffect, useRef, useState } from 'react';
import { useContextMenuStore } from '../../stores/contextMenuStore';
import { ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContextMenu() {
  const { isOpen, position, items, closeContextMenu } = useContextMenuStore();
  const menuRef = useRef<HTMLDivElement>(null);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);

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
      setHoveredItem(null);
    };
  }, [isOpen, closeContextMenu]);

  if (!isOpen) return null;

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="fixed z-[1000] min-w-[200px] overflow-visible rounded-xl border border-white/10 bg-zinc-900/80 p-1.5 shadow-2xl backdrop-blur-2xl"
      style={{ top: position.y, left: position.x }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="relative"
          onMouseEnter={() => setHoveredItem(index)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {item.divider ? (
            <div className="my-1.5 h-[1px] bg-white/5 mx-2" />
          ) : (
            <>
              <button
                onClick={(e) => {
                  if (item.children) {
                    e.stopPropagation();
                    setHoveredItem(hoveredItem === index ? null : index);
                  } else {
                    item.action?.();
                    closeContextMenu();
                  }
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-all duration-200 ${
                  hoveredItem === index ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon && <item.icon size={16} className={hoveredItem === index ? "text-blue-400" : "text-zinc-500"} />}
                  <span className="font-medium tracking-wide">{item.label ?? ""}</span>
                </div>
                {item.children && <ChevronRight size={14} className={hoveredItem === index ? "text-blue-400 opacity-100" : "opacity-30"} />}
              </button>

              <AnimatePresence>
                {item.children && hoveredItem === index && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="absolute left-[calc(100%+4px)] top-[-6px] min-w-[180px] rounded-xl border border-white/10 bg-zinc-900/90 p-1.5 shadow-2xl backdrop-blur-2xl"
                  >
                    {item.children.map((child: any, cIdx: number) => (
                      <button
                        key={cIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          child.action?.();
                          closeContextMenu();
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs text-zinc-400 hover:bg-white/10 hover:text-white transition-all group/sub"
                      >
                        {child.icon && <child.icon size={16} className="text-zinc-500 group-hover/sub:text-blue-400 transition-colors" />}
                        <span className="font-medium tracking-wide">{child.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      ))}
    </motion.div>
  );
}
