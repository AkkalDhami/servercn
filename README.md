# ServerCN

> **Backend component registry for Node.js & Typescript**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)

**ServerCN** is a backend component registry for Node.js & TypeScript. It provides a robust collection of pre-configured components, boilerplates, and utilities for **Node.js** and **TypeScript**, enabling developers to scaffold production-ready code in seconds.

---

![ServerCN Components](./apps/web/public/assets/hero.png)

## 🚀 Key Features

- **⚡ Instant Scaffolding**: Quickly generate backend components like Authentication, Logging, and Database setups.
- **🛡️ Type-Safety First**: Built entirely with TypeScript for robust and reliable code.
- **🔐 Secure by Design**: Includes best-practice implementations for security (Argon2, JWT, Zod).
- **🧩 Modular Architecture**: Add only what you need to your existing project.
- **📝 Comprehensive Logging**: Integrated with Pino and Winston for effective monitoring and debugging.

## 📦 Components

ServerCN allows you to quickly add the following components to your project:

- **Authentication System** (JWT, Refresh Tokens, Password Hashing)
- **Database Connection** (Mongoose/MongoDB)
- **Input Validation** (Zod)
- **Error Handling** (Global Error Handler, Async Wrapper)
- **Logging** (Winston, Pino)

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
npx servercn-cli add logger-pino
npx servercn-cli add logger-winston
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

[Visit for more](https://servercn.vercel.app/docs/cli)

## 🏗️ Project Structure

The generated code follows a clean, MVC-inspired architecture designed for scalability:

```bash
src/
├── config/         # Environment variables and configuration
├── controllers/    # Request handlers
├── middlewares/    # Express middlewares (Auth, Error handling)
├── models/         # Database models (Mongoose schemas)
├── routes/         # API routes definitions
├── services/       # Business logic layer
├── utils/          # Helper functions and classes
└── app.ts          # App entry point
└── server.ts       # Server entry point
```

## 💻 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Frontend**: Next.js

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## Stargazers over time

[![Stargazers over time](https://starchart.cc/AkkalDhami/servercn.svg?variant=adaptive)](https://starchart.cc/AkkalDhami/servercn)

---

<p align="center">
  Built with 🗡️ by <a target="_blank" href="https://github.com/akkaldhami">Akkal Dhami</a> and the <a target="_blank" href="https://servercn.vercel.app/contributors">ServerCN contributors</a>
</p>
