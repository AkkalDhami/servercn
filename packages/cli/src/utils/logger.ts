import kleur from "kleur";
export const logger = {
  log(...args: unknown[]) {
    console.log(args.join(" "));
  },
  break() {
    console.log("");
  },
  created: (msg: string) => console.log(kleur.blue("✔ created: " + msg)),
  info: (msg: string) => console.log(kleur.cyan(msg)),
  success: (msg: string) =>
    console.log("\n" + kleur.green("✔ success! " + msg)),
  skip: (msg: string) => console.log(kleur.yellow("↺ skip: " + msg)),
  error: (msg: string) => console.log(kleur.red("✖ " + msg)),
  muted: (msg: string) => console.log(kleur.dim(msg)),
  warn: (msg: string) => console.log(kleur.yellow("⚠ " + msg)),
  overwritten: (msg: string) =>
    console.log(kleur.yellow("↻ overwrite: " + msg)),
  section: (title: string) => {
    console.log("\n" + title);
  }
};
