import type { LucideIcon } from "lucide-react";

export interface AppDefinition {
  id: string;

  title: string;

  icon: LucideIcon;

  defaultSize: {
    width: number;
    height: number;
  };

  component: React.ComponentType;
}