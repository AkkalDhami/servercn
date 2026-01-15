export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "test", "chore", "ci", "perf", "build", "release", "workflow", "security"]
    ],

    "body-max-length": [0, "always", 500],
    "header-max-length": [0, "always", 200]
  }
};
