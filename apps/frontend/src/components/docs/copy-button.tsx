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
        "absolute cursor-pointer top-1/2 right-0 -translate-y-1/2 flex w-9 items-center justify-center rounded-e-md text-muted-secondary outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed",
        "duration-100 ease-in-out",
        className
      )}
      disabled={copied}
      onClick={handleCopy}
      type="button">
      <div
        className={cn(
          "transition-all",
          copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
        )}>
        <CheckIcon
          aria-hidden="true"
          className="stroke-current"
          size={16}
        />
      </div>
      <div
        className={cn(
          "absolute transition-all",
          copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}>
        <CopyIcon aria-hidden="true" size={16} />
      </div>
    </button>
  );
}
