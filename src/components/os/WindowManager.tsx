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
    updateWindowSize,
  } = useWindowStore();

  return (
    <>
      {windows.map((windowInstance) => {
        const app = apps.find((a) => a.id === windowInstance.appId);
        if (!app) return null;

        const Component = app.component;

        return (
          <WindowFrame
            key={windowInstance.id}
            title={windowInstance.title}
            zIndex={windowInstance.zIndex}
            isFocused={windowInstance.isFocused}
            isMaximized={windowInstance.isMaximized}
            isMinimized={windowInstance.isMinimized}
            position={windowInstance.position}
            size={windowInstance.size}
            onMouseDown={() => focusWindow(windowInstance.id)}
            onClose={() => closeWindow(windowInstance.id)}
            onMinimize={() => minimizeWindow(windowInstance.id)}
            onMaximize={() => {
              if (windowInstance.isMaximized) {
                restoreMaximizedWindow(windowInstance.id);
              } else {
                maximizeWindow(
                  windowInstance.id,
                  window.innerWidth,
                  window.innerHeight
                );
              }
            }}
            onResize={(updates) => {
              updateWindowSize(windowInstance.id, updates);
            }}
          >
            <Component />
          </WindowFrame>
        );
      })}
    </>
  );
}
