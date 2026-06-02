import { PackageManagerType } from "@/components/docs/icons/language-icons";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PackageManagerState {
  pkgManager: PackageManagerType;
  setPkgManager: (pkgManager: PackageManagerType) => void;
}

export const usePackageManager = create<PackageManagerState>()(
  persist(
    set => ({
      pkgManager: "npm",
      setPkgManager: (pkgManager: PackageManagerType) => {
        set({ pkgManager });
      }
    }),
    {
      name: "servercn-package-manager-preference"
    }
  )
);
