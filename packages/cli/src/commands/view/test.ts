// import fs from "fs";
// import path from "path";
// import kleur from "kleur";
// const registry: { name: string }[] = [];

// type ViewOptions = {
//   code?: boolean;
//   files?: boolean;
//   deps?: boolean;
// };

// export async function viewComponent(name: string, options: ViewOptions = {}) {
//   const component = registry.find(c => c.name === name);

//   if (!component) {
//     console.log(kleur.red(`❌ Component '${name}' not found.`));
//     process.exit(1);
//   }

//   renderHeader(component);

//   renderMeta(component);

//   if (options.files || !options.code) {
//     renderFiles(component);
//   }

//   if (options.deps || component.dependencies?.length) {
//     renderDependencies(component);
//   }

//   if (options.code) {
//     renderCode(component);
//   }

//   if (component.example) {
//     renderExample(component);
//   }

//   renderInstall(component);
// }

// function renderHeader(component) {
//   console.log(kleur.gray("─".repeat(40)));
//   console.log(
//     `${kleur.cyan("📦")} ${kleur.bold(component.name)} ${kleur.gray(
//       `(${component.framework.join(", ")})`
//     )}`
//   );
//   console.log(kleur.gray("─".repeat(40)));
// }
