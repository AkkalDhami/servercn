export const prettierConfig = {
  singleQuote: false,
  semi: true,
  tabWidth: 2,
  trailingComma: "none",
  bracketSameLine: false,
  arrowParens: "avoid",
  endOfLine: "lf",
};

export const prettierIgnore = `# dependencies
node_modules

# build outputs
dist
build
coverage

# lock files
package-lock.json
pnpm-lock.yaml
yarn.lock

# environment
.env

# generated files
*.min.js
*.bundle.js

# logs
*.log

# git
.git
.gitignore
`;
