import DesktopShell from "./app/desktop/DesktopShell";
import MobileShell from "./app/mobile/MobileShell";
import { useDeviceType } from "./hooks/useDeviceType";

export default function App() {
  const { isMobile } = useDeviceType();

  return isMobile ? <MobileShell /> : <DesktopShell />;
}