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
    image: "/projects/os.png",
    metadata: { version: "2.4.0-stable", size: "14.2 MB", lastModified: "2024-05-20" }
  },
  {
    id: "nexus-api",
    title: "Nexus Core API",
    description: "High-performance distributed backend system.",
    longDescription: "A modular microservices architecture handling millions of requests per day with automated scaling and service discovery.",
    stack: ["Node.js", "Go", "Redis", "Docker", "Kubernetes"],
    status: "completed",
    category: "api",
    github: "https://github.com/rammirtimbas/nexus-api",
    metadata: { version: "3.2.1-prod", size: "124 KB", lastModified: "2024-01-10" }
  },
  {
    id: "client-dashboard",
    title: "Enterprise ERP",
    description: "Full-scale resource management system for manufacturing.",
    longDescription: "A massive freelance project involving supply chain tracking, automated invoicing, and real-time inventory management across multiple warehouses.",
    stack: ["Next.js", "PostgreSQL", "Prisma", "AWS", "Stripe"],
    status: "completed",
    category: "freelance",
    metadata: { version: "4.0.2", size: "82.4 MB", lastModified: "2024-04-12" }
  },
  {
    id: "motion-ui",
    title: "Fluid Component Lab",
    description: "UI experiment focused on physics-based animations.",
    longDescription: "An exploration into declarative physics-based interactions using Framer Motion and custom CSS shaders.",
    stack: ["React", "Framer Motion", "GLSL"],
    status: "completed",
    category: "ui",
    github: "https://github.com/rammirtimbas/motion-ui",
    metadata: { version: "0.5.0-beta", size: "4.1 MB", lastModified: "2023-12-05" }
  }
];
