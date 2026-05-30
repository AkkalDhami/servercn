export function toPascalCase(str: string) {
  return str.replace(/(^\w|-\w)/g, m => m.replace("-", "").toUpperCase());
}

export function toKebabCase(str: string) {
  return str
    .replace(/\s+/g, "-")
    .replace(/[A-Z]/g, m => "-" + m.toLowerCase())
    .replace(/^-/, "")
    .toLowerCase();
}

export function toCamelCase(str: string) {
  return str
    .split("-")
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}