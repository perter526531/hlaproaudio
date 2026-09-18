"use client";

import { create } from "zustand";

export type Route =
  | { name: "home" }
  | { name: "about" }
  | { name: "products"; categoryId?: string }
  | { name: "product"; id: string }
  | { name: "solutions" }
  | { name: "news" }
  | { name: "contact" }
  | { name: "admin" };

type NavState = {
  route: Route;
  adminMode: boolean;
  go: (r: Route) => void;
  setAdminMode: (v: boolean) => void;
  navToken: number;
};

export const useNav = create<NavState>((set) => ({
  route: { name: "home" },
  adminMode: false,
  go: (r) => set({ route: r, navToken: Date.now() }),
  setAdminMode: (v) => set({ adminMode: v }),
  navToken: 0,
}));
