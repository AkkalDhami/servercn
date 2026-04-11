import { PackageManager } from "@/components/docs/package-manager-tabs";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PackageManagerState {
  pkgManager: PackageManager;
  setPkgManager: (pkgManager: PackageManager) => void;
}

export const usePackageManager = create<PackageManagerState>()(
  persist(
    set => ({
      pkgManager: "npm",
      setPkgManager: (pkgManager: PackageManager) => {
        set({ pkgManager });
      }
    }),
    {
      name: "servercn-package-manager-preference"
    }
  )
);
