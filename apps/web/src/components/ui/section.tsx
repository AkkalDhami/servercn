import { cn } from "@/lib/utils";

export function Section({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section {...props} className={cn("screen-line-before py-8", className)}>
      {children}
    </section>
  );
}
