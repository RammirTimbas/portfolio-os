export type ProjectCategory = "all" | "web" | "api" | "ui" | "freelance" | "other";
export type ProjectStatus = "completed" | "wip" | "archived";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  stack: string[];
  status: ProjectStatus;
  github?: string;
  demo?: string;
  image?: string;
  category: ProjectCategory;
  metadata?: {
    version: string;
    size: string;
    lastModified: string;
  };
}

/**
 * Runtime constant to ensure this file is recognized as a valid module
 * in ESM environments after type erasure.
 */
export const PROJECT_MODULE = true;
