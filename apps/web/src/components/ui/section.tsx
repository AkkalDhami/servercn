import { cn } from "@/lib/utils";

export function Section({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section {...props} className={cn("py-8 screen-line-before", className)}>
      {children}
    </section>
  );
}
