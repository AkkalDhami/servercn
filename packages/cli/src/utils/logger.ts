// import kleur from "kleur";

import { highlighter } from "./highlighter";

// export const logger = {
//   log(...args: unknown[]) {
//     console.log(args.join(" "));
//   },
//   break() {
//     console.log("");
//   },
//   created: (msg: string) => console.log(kleur.blue("✔ created: " + msg)),
//   info: (msg: string) => console.log(kleur.cyan(msg)),
//   success: (msg: string) =>
//     console.log("\n" + kleur.green("✔ success! " + msg)),
//   skip: (msg: string) => console.log(kleur.yellow("↺ skip: " + msg)),
//   error: (msg: string) => console.log(kleur.red(msg)),
//   muted: (msg: string) => console.log(kleur.dim(msg)),
//   warn: (msg: string) => console.log(kleur.yellow("⚠ " + msg)),
//   overwritten: (msg: string) =>
//     console.log(kleur.yellow("↻ overwrite: " + msg)),
//   section: (title: string) => {
//     console.log("\n" + title);
//   }
// };

export const logger = {
  error(...args: unknown[]) {
    console.log(highlighter.error(args.join(" ")));
  },
  warn(...args: unknown[]) {
    console.log(highlighter.warn(args.join(" ")));
  },
  info(...args: unknown[]) {
    console.log(highlighter.info(args.join(" ")));
  },
  success(...args: unknown[]) {
    console.log(highlighter.success(args.join(" ")));
  },
  log(...args: unknown[]) {
    console.log(args.join(" "));
  },
  break() {
    console.log("");
  },
  section: (title: string) => {
    console.log("\n" + title);
  },
  muted: (msg: string) => console.log(highlighter.mute(msg)),
  created: (msg: string) => console.log(highlighter.create("Create: " + msg))
};
