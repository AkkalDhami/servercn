import ejs from "ejs";
import path from "node:path";

export async function renderEmailTemplates(
  templateName: string,
  data: Record<string, unknown>
) {
  const templatePath = path.join(
    process.cwd(),
    "src",
    "shared",
    "email-templates",
    `${templateName}.ejs`
  );
  return ejs.renderFile(templatePath, data);
}
