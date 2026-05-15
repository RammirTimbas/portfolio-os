import DesktopIcons from "../../components/os/DesktopIcons";
import WindowManager from "../../components/os/WindowManager";

import Taskbar from "../../components/taskbar/Taskbar";

export default function DesktopShell() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#27272a,transparent_60%)]" />

      <DesktopIcons />

      <WindowManager />

      <Taskbar />
    </main>
  );
}