# Contributing to ServerCN

First off all, thank you for considering contributing to ServerCN! It's people like you that make ServerCN such a great tool for the community.

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (v18 or higher recommended).
- **npm**: We use `npm` as our package manager and for running workspaces.

### Installation

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:

```bash
git clone https://github.com/YOUR_USERNAME/servercn.git
cd servercn
```

3. **Install dependencies**:

```bash
npm install
```

## 🏗️ Project Structure

This project is a monorepo managed with **npm workspaces**.

- `apps/web`: The documentation website (Next.js).
- `packages/cli/src`: The core CLI tool source code.
- `packages/cli/registry`: The registry of components and templates.
- `packages/cli/templates`: Boilerplate code specific to different architectures/stacks.

## 💻 Development Workflow

### 1. Working on the CLI

To test the CLI changes locally, you can link the package or use the build commands.

```bash
# Build the CLI package
npm run build:cli

# Link the CLI globally to test 'servercn' command
npm run link:cli

# Run development server
npm run dev:app
```

Now you can run `servercn` in any terminal to test your changes.

### 2. Working on the Documentation (Apps/Web)

To run the Next.js documentation site:

```bash
# Navigate to web app
cd apps/web

# Run development server
npm run dev
```

### 3. Adding/Modifying Components

Components are located in `packages/registry`.

- **Definition**: Update the JSON definition in `packages/cli/registry/components/`.
- **Code**: Update the actual source code templates in `packages/cli/templates/`.

### 4. Running Scripts from Root

We have configured several helper scripts in the root `package.json`:

- `npm run build`: Build all workspaces.
- `npm run lint`: Lint all files.
- `npm run format:fix`: Format code with Prettier.

## 🚀 Submitting Changes

1. **Create a Branch**:

```bash
git checkout -b feature/my-new-feature
# or
git checkout -b fix/bug-description
```


2. **Make your changes**. Please ensure your code follows the existing style (we use Prettier).

3. **Commit your changes**:
   We prefer clear, descriptive commit messages.

```bash
git commit -m "feat(cli): add support for new component type"
```

4. **Push to your fork**:

```bash
git push origin feature/my-new-feature
```

5. **Open a Pull Request**:
   - Go to the original repository.
   - Click "New Pull Request".
   - Describe your changes clearly.

## 🧩 Adding a New Component

If you are contributing a new component:

1. Create the component definition in `packages/cli/registry/components/<name>.json`.
2. Implement the component logic in `packages/cli/templates/components/<name>/`.
3. Ensure it follows the project's architecture (Express/MVC standards).
4. Add documentation in `apps/web/src/content/docs/components/<name>.mdx` 

## 📄 License

By contributing, you agree that your contributions will be licensed under its MIT License.

---

Thank you for helping us build the best backend component registry! 🚀
