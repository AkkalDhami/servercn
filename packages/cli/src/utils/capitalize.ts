export function capitalize(name: string = "") {
  return (
    name?.split("")[0]?.toUpperCase() +
    name.split("")?.slice(1)?.join("")?.toLowerCase()
  );
}
