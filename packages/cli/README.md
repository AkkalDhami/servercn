# ServerCN

ServerCN is a component registry for building production-ready Node.js backends by composition.

`servercn` helps you scaffold and install **backend components**
(logging, auth, validation, error handling, etc.) into an existing project — similar in spirit to `shadcn/ui`, but for **backend infrastructure**.

Visit [ServerCN](https://servercn.vercel.app) for more information.

[GitHub Link](https://github.com/akkaldhami/servercn)

---

## Installation

```bash
npx servercn-cli init
```

## Add Components

Add specific modules to your existing project. This allows for incremental adoption.

```bash
npx servercn-cli add [component-name]
```

Add multiple components like this:

```bash
npx servercn-cli add logger-pino jwt-utils
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

- ### File Upload Cloudinary

```bash
npx servercn-cli add file-upload
```

- ### JWT Utils

```bash
npx servercn-cli add jwt-utils
```

- ### Logger Pino

```bash
npx servercn-cli add logger-pino
```

- ### Logger Winston

```bash
npx servercn-cli add logger-winston
```

- ### Rate Limiter

```bash
npx servercn-cli add rate-limiter
```

- ### GitHub OAuth

```bash
npx servercn-cli add github-oauth
```

- ### Google OAuth

```bash
npx servercn-cli add google-oauth
```

- ### GitHub and Google OAuth

```bash
npx servercn-cli add github-google-oauth
```

- ### Health Check

```bash
npx servercn-cli add health-check
```

Visit [ServerCN](https://servercn.vercel.app) for more information.
