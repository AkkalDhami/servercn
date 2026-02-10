# ServerCN

ServerCN is a component registry for building production-ready Node.js backends by composition.

`servercn` helps you scaffold and install **backend components**
(logging, auth, validation, error handling, etc.) into an existing project —`similar in spirit to`shadcn/ui`, but for **backend infrastructure**.

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

Visit [ServerCN](https://servercn.vercel.app) for more information.
