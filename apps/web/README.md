# ServerCN

> **Backend component registry for Node.js & Typescript**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)

**ServerCN** is a backend component registry for Node.js & TypeScript. It provides a robust collection of pre-configured components, boilerplates, and utilities for **Node.js** and **TypeScript**, enabling developers to scaffold production-ready code in seconds.

> Shadcn ecosystem for nodejs backend

---

![ServerCN Components](./apps/web/public/assets/hero.png)

[Visit website: https://servercn.vercel.app](https://servercn.vercel.app/docs/cli)

[Join discord: https://discord.gg/2fXqnTXF8d](https://discord.gg/2fXqnTXF8d)

## 🛠️ Usage

### 1. Initialize a Project

Start a new project with a recommended, production-ready structure.

```bash
npx servercn-cli init
```

### 2. Add Components

Add specific modules to your existing project. This allows for incremental adoption.

```bash
npx servercn-cli add [component-name]
```

Examples:

```bash
npx servercn-cli add logger
```

```bash
npx servercn-cli add oauth
```

## Components

- ### API Error Handler

```bash
npx servercn-cli add error-handler
```

- ### API Response Formatter

```bash
npx servercn-cli add response-formatter
```

- ### Async Handler

```bash
npx servercn-cli add async-handler
```

- ### File Upload provider

```bash
npx servercn-cli add file-upload
```

- ### JWT Utils

```bash
npx servercn-cli add jwt-utils
```

- ### Logger

```bash
npx servercn-cli add logger
```

- ### Rate Limiter

```bash
npx servercn-cli add rate-limiter
```

- ### OAuth Provider

```bash
npx servercn-cli add oauth
```

- ### Health Check

```bash
npx servercn-cli add health-check
```

### And more

### 3. CLI Commands

[Visit for more](https://servercn.vercel.app/docs/cli)

- List all available registry item.

  ```bash
  npx servercn-cli ls --all
  ```

- List all available registry item in JSON structure.

  ```bash
  npx servercn-cli ls --all --json
  ```

- List all available registry commands.

  ```bash
  npx servercn-cli list
  ```

- List all available registry commands in JSON structure.

  ```bash
  npx servercn-cli ls --json
  ```

- List available components.

  ```bash
  npx servercn-cli ls cp
  ```

- List available all foundation.

  ```bash
  npx servercn-cli ls fd
  ```

- List available schema.

  ```bash
  npx servercn-cli ls sc
  ```

- List available blueprint.

  ```bash
  npx servercn-cli ls bp
  ```

- List available tooling.

  ```bash
  npx servercn-cli ls tl
  ```

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

[Contributing guides](https://servercn.vercel.app/contributing)

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## Stargazers over time

[![Stargazers over time](https://starchart.cc/AkkalDhami/servercn.svg?variant=adaptive)](https://starchart.cc/AkkalDhami/servercn)

---

<p align="center">
  Built with 🗡️ by <a target="_blank" href="https://github.com/akkaldhami">Akkal Dhami</a> and the <a target="_blank" href="https://servercn.vercel.app/contributors">ServerCN contributors</a>
</p>
