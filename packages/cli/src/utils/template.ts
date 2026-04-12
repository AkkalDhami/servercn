import fs from "fs";
import Handlebars from "handlebars";

export function compileTemplate(
  templatePath: string,
  data: Record<string, unknown>
) {
  const source = fs.readFileSync(templatePath, "utf-8");
  const template = Handlebars.compile(source);
  return template(data);
}
