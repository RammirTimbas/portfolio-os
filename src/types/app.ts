import type { LucideIcon } from "lucide-react";

export interface AppProps {
  params?: any;
  windowId?: string;
}

export interface AppDefinition {
  id: string;
  title: string;
  icon: LucideIcon;
  defaultSize: {
    width: number;
    height: number;
  };
  component: React.ComponentType<AppProps>;
  hideFromDesktop?: boolean;
}
