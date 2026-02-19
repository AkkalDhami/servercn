# ServerCN

ServerCN is a component registry for building production-ready Node.js backends by composition.

`servercn` helps you scaffold and install **backend components**
(logging, auth, validation, error handling, etc.) into an existing project — similar in spirit to `shadcn/ui`, but for **backend infrastructure**.

Visit [ServerCN](https://servercn.vercel.app) for more information.

[GitHub Link](https://github.com/akkaldhami/servercn)

---

## Features

- 🚀 Zero-config CLI
- 🧱 Install backend components, not boilerplate
- 🧭 MVC and Feature-based architectures
- 🧩 Modular, copy-based components (fully editable)
- 🔒 Production-oriented defaults
- 📦 Works with existing Express projects

---

## Installation

```bash
npx servercn init
```

## Add Components

Add specific modules to your existing project. This allows for incremental adoption.

```bash
npx servercn add [component-name]
```

Add multiple components like this:

```bash
npx servercn add logger-pino jwt-utils
```

## Components

- ### API Error Handler

```bash
npx servercn add error-handler
```

- ### API Response Formatter

```bash
npx servercn add response-formatter
```

- ### Async Handler

```bash
npx servercn add async-handler
```

- ### File Upload Cloudinary

```bash
npx servercn add file-upload
```

- ### JWT Utils

```bash
npx servercn add jwt-utils
```

- ### Logger Pino

```bash
npx servercn add logger-pino
```

- ### Logger Winston

```bash
npx servercn add logger-winston
```

- ### Rate Limiter

```bash
npx servercn add rate-limiter
```

- ### GitHub OAuth

```bash
npx servercn add github-oauth
```

- ### Google OAuth

```bash
npx servercn add google-oauth
```

- ### GitHub and Google OAuth

```bash
npx servercn add github-google-oauth
```

- ### Health Check

```bash
npx servercn add health-check
```

Visit [ServerCN](https://servercn.vercel.app) for more information.
