import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Framework = "express" | "nestjs" | null;

interface FrameworkState {
  framework: Framework;
  setFramework: (framework: Framework) => void;
}

export const useFramework = create<FrameworkState>()(
  persist(
    set => ({
      framework: "express", // Default framework
      setFramework: (framework: Framework) => {
        set({ framework });
      }
    }),
    {
      name: "servercn-framework-preference"
    }
  )
);
