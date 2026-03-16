import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Framework = "express" | "nestjs";

interface FrameworkState {
  framework: Framework;
  setFramework: (framework: Framework) => void;
}

export const useFramework = create<FrameworkState>()(
  persist(
    set => ({
      framework: "express",
      setFramework: (framework: Framework) => {
        set({ framework });
      }
    }),
    {
      name: "servercn-framework-preference"
    }
  )
);
