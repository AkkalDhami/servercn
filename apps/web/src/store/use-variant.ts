import { create } from "zustand";
import { persist } from "zustand/middleware";

interface VariantState {
  variant: string | null;
  setVariant: (variant: string) => void;
}

export const useVariant = create<VariantState>()(
  persist(
    set => ({
      variant: null,
      setVariant: (variant: string) => {
        set({ variant });
      }
    }),
    {
      name: "servercn-registry-variant"
    }
  )
);