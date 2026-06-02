"use client";

import { Loader2Icon } from "lucide-react";

export function FileViewerLoader() {
  return (
    <div className="flex min-h-150 h-full w-full flex-col items-center justify-center gap-6 rounded-lg border bg-card/40">
     <div className="flex items-center justify-center gap-2">
        <Loader2Icon className="animate-spin text-muted-foreground size-8" />
        <span className="text-muted-foreground font-code text-lg">
          Loading files...
        </span>
      </div>
     </div>
  );
}
