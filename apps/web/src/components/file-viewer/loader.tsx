"use client";

import { Loader2Icon } from "lucide-react";

export function FileViewerLoader() {
  return (
    <div className="bg-card/40 flex h-full min-h-150 w-full flex-col items-center justify-center gap-6 rounded-lg border">
      <div className="flex items-center justify-center gap-2">
        <Loader2Icon className="text-muted-foreground size-8 animate-spin" />
        <span className="text-muted-foreground font-code text-lg">
          Loading files...
        </span>
      </div>
    </div>
  );
}
