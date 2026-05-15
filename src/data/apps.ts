import { User } from "lucide-react";

import AboutApp from "../components/apps/AboutApp";

import type { AppDefinition } from "../types/app";

export const apps: AppDefinition[] = [
  {
    id: "about",

    title: "About",

    icon: User,

    component: AboutApp,

    defaultSize: {
      width: 700,
      height: 500,
    },
  },
];