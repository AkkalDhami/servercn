import { colors } from "./cli-colors";

const icons = {
  error: "✖",
  warn: "⚠",
  info: "ℹ",
  success: "✔",
};

export const logger = {
  error(...args: unknown[]) {
    console.log(colors.error(`${args.join(" ")}`));
  },

  warn(...args: unknown[]) {
    console.log(colors.warn(`${args.join(" ")}`));
  },

  info(...args: unknown[]) {
    console.log(colors.info(`${args.join(" ")}`));
  },

  success(...args: unknown[]) {
    console.log(colors.success(`${args.join(" ")}`));
  },

  log(...args: unknown[]) {
    console.log(args.join(" "));
  },

  created(...args: unknown[]) {
    console.log(colors.created(`✔ Created ${args.join(" ")}`));
  },

  break() {
    console.log("");
  },
};
