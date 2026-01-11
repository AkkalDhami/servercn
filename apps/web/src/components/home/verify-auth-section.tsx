"use client";
import mvcData from "../../data/verify-auth-mvc.json";
import featureData from "../../data/verify-auth-feature.json";
import BackendStructureViewer from "@/components/file-viewer/backend-structure-viewer";

import ArchitectureTabs from "@/components/docs/architecture-tabs";
import { useSearchParams } from "next/navigation";
export default function VerifyAuthSection() {
  const param = useSearchParams();

  console.log(param);

  const currentArch = param.get("arch") || "mvc";
  return (
    <section id="verify-auth-section" className="py-20">
      <ArchitectureTabs current={currentArch || "mvc"} />
      <BackendStructureViewer
        structure={currentArch === "mvc" ? mvcData : featureData}
        className="mx-auto h-150 w-full max-w-7xl"
      />
    </section>
  );
}
