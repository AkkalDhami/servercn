export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "test", "chore", "ci", "perf", "build", "release", "workflow", "security"]
    ],

    "subject-case": [2, "always", ["lower-case"]]
  }
};
