export function groupByCategory(components: any[]) {
  return components.reduce<Record<string, any[]>>((acc, c) => {
    const category = c.category ?? "uncategorized";
    acc[category] ??= [];
    acc[category].push(c);
    return acc;
  }, {});
}
