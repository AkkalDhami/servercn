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
