import { highlighter } from "./highlighter";

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
