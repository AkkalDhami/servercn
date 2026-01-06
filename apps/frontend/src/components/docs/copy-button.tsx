import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";

export default function CopyButton({
  handleCopy,
  copied,
  className,
}: {
  handleCopy: () => void;
  copied: boolean;
  className?: string;
}) {
  return (
    <button
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className={cn(
        "text-muted-secondary hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute top-1/2 right-0 flex w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed",
        "duration-100 ease-in-out",
        className,
      )}
      disabled={copied}
      onClick={handleCopy}
      type="button"
    >
      <div
        className={cn(
          "transition-all",
          copied ? "scale-100 opacity-100" : "scale-0 opacity-0",
        )}
      >
        <CheckIcon aria-hidden="true" className="stroke-current" size={16} />
      </div>
      <div
        className={cn(
          "absolute transition-all",
          copied ? "scale-0 opacity-0" : "scale-100 opacity-100",
        )}
      >
        <CopyIcon aria-hidden="true" size={16} />
      </div>
    </button>
  );
}
