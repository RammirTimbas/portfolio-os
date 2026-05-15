import WindowFrame from "../windows/WindowFrame";

import { apps } from "../../data/apps";

import { useWindowStore } from "../../stores/windowStore";

export default function WindowManager() {
  const {
    windows,
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreMaximizedWindow,
  } = useWindowStore();

  return (
    <>
      {windows
        .filter(
          (windowInstance) =>
            !windowInstance.isMinimized
        )
        .map((windowInstance) => {
          const app = apps.find(
            (a) => a.id === windowInstance.appId
          );

          if (!app) return null;

          const Component = app.component;

          return (
            <WindowFrame
              key={windowInstance.id}
              title={windowInstance.title}
              zIndex={windowInstance.zIndex}
              isFocused={
                windowInstance.isFocused
              }
              isMaximized={
                windowInstance.isMaximized
              }
              position={
                windowInstance.position
              }
              size={windowInstance.size}
              onMouseDown={() =>
                focusWindow(windowInstance.id)
              }
              onClose={() =>
                closeWindow(windowInstance.id)
              }
              onMinimize={() =>
                minimizeWindow(windowInstance.id)
              }
              onMaximize={() => {
                if (
                  windowInstance.isMaximized
                ) {
                  restoreMaximizedWindow(
                    windowInstance.id
                  );
                } else {
                  maximizeWindow(
                    windowInstance.id,
                    window.innerWidth,
                    window.innerHeight
                  );
                }
              }}
            >
              <Component />
            </WindowFrame>
          );
        })}
    </>
  );
}