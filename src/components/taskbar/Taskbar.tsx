import { apps } from "../../data/apps";

import { useWindowStore } from "../../stores/windowStore";

export default function Taskbar() {
  const {
    windows,
    restoreWindow,
    focusWindow,
  } = useWindowStore();

  return (
    <div
      className="
        absolute
        bottom-0
        left-1/2
        z-[9999]
        flex
        h-14
        -translate-x-1/2
        items-center
        gap-2
        rounded-2xl
        border
        border-zinc-800
        bg-zinc-900/80
        px-4
        backdrop-blur-xl
      "
    >
      {windows.map((window) => {
        const app = apps.find(
          (a) => a.id === window.appId
        );

        if (!app) return null;

        const Icon = app.icon;

        return (
          <button
            key={window.id}
            onClick={() => {
              if (window.isMinimized) {
                restoreWindow(window.id);
              } else {
                focusWindow(window.id);
              }
            }}
            className={`
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              transition
            
              ${
                window.isFocused
                  ? "bg-zinc-700"
                  : "hover:bg-zinc-800"
              }
            `}
          >
            <Icon size={20} />

            <div
              className="
                absolute
                bottom-1
                h-1
                w-4
                rounded-full
                bg-white
              "
            />
          </button>
        );
      })}
    </div>
  );
}