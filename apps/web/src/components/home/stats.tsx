import { Section } from "@/components/ui/section";

interface Stat {
  title: string;
  value: number;
  suffix: string;
}

const STATISTICS: Stat[] = [
  {
    title: "Components",
    value: 25,
    suffix: "+"
  },
  {
    title: "Foundations",
    value: 4,
    suffix: "+"
  },
  {
    title: "Schemas",
    value: 3,
    suffix: "+"
  },
  {
    title: "Blueprints",
    value: 2,
    suffix: "+"
  }
];

export default function Stats() {
  return (
    <Section id="stats">
      <div className="flex items-start flex-wrap justify-around gap-8">
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
