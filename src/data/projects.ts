import type { Project } from "../types/project";

export const projects: Project[] = [
  {
    id: "portfolio-os",
    title: "Portfolio OS",
    description: "Draggable/resizable window system built with React.",
    longDescription: "A high-fidelity desktop environment simulation that treats professional identity and projects as system objects. Features persistent configuration and artifact execution protocols.",
    stack: ["React", "TypeScript", "Tailwind CSS", "Zustand", "Framer Motion"],
    status: "wip",
    category: "web",
    github: "https://github.com/rammirtimbas/portfolio-os",
    image: "/portfolio_ss/home.png", // Changed from /projects/os.png which was missing
    images: [
      "/portfolio_ss/home.png",
      "/portfolio_ss/identity.png",
      "/portfolio_ss/settings.png"
    ],
    metadata: { version: "2.4.0-stable", size: "14.2 MB", lastModified: "2024-05-20" }
  },
];
