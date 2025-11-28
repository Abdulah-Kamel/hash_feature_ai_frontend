"use client";
import { create } from "zustand";

export const useSidebarVariant = create((set) => ({
  variant: "global",
  setVariant: (v) => set({ variant: v }),
}));
