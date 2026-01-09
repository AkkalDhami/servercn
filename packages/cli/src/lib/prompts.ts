import prompts from "prompts";

export async function askFolderName(defaultName: string) {
  const { folder } = await prompts({
    type: "text",
    name: "folder",
    message: "Where should this component be added?",
    initial: ".",
    format: (val) => val.trim() || ".",
  });

  return folder || defaultName;
}
export function getDefaultFolderName(component: {
  category?: string;
  name: string;
}) {
  return component.name;
}
