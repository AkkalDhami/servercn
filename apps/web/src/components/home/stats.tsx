import { Section } from "@/components/ui/section";
import { calculateFrameworkStats } from "./supported-frameworks";

interface Stat {
  title: string;
  value: number;
  suffix: string;
}


const STATISTICS: Stat[] = [
  {
    title: "Components",
    value: calculateFrameworkStats(["express", "nextjs"]).components,
    suffix: "+"
  },
  {
    title: "Foundations",
    value: calculateFrameworkStats(["express", "nextjs"]).foundations,
    suffix: "+"
  },
  {
    title: "Schemas",
    value: calculateFrameworkStats(["express", "nextjs"]).schemas,
    suffix: "+"
  },
  {
    title: "Blueprints",
    value: calculateFrameworkStats(["express", "nextjs"]).blueprints,
    suffix: "+"
  },
  {
    title: "Providers",
    value: calculateFrameworkStats(["express", "nextjs"]).providers,
    suffix: "+"
  }
];

export default function Stats() {
  return (
    <Section id="stats">
      <div className="flex flex-wrap items-start justify-around gap-8">
        {STATISTICS.map((stat, index) => (
          <div key={index} className="pl-5">
            <div className="flex items-start gap-1">
              <h3 className="text-6xl font-bold">{stat.value}</h3>
              <p className="text-muted-primary text-4xl font-semibold">
                {stat.suffix}
              </p>
            </div>
            <p className="text-muted-foreground text-base font-medium uppercase">
              {stat.title}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
