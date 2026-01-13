"use client";

import { create } from "zustand";

type ArchStore = {
  arch: string | null;
  setArch: (file: string) => void;
};

export const useArchitecture = create<ArchStore>(set => ({
  arch: null,
  setArch: arch => set({ arch: arch })
}));
