import { APP_NAME } from "./constants";

export const siteConfig = {
  title: {
    default: "Servercn",
    template: "%s | Servercn"
  },
  url: "https://servercn.vercel.app",
  github: "https://github.com/akkaldhami/servercn",
  navItems: [
    {
      label: "Docs",
      href: "/docs"
    },
    {
      label: "Components",
      href: "/components"
    },
    {
      label: "Foundations",
      href: "/foundations"
    },
    {
      label: "Blueprints",
      href: "/blueprints"
    },
    {
      label: "Providers",
      href: "/providers"
    },
    {
      label: "Schemas",
      href: "/schemas"
    },
    {
      label: "Contributing",
      href: "/contributing"
    },
    {
      label: "Contributors",
      href: "/contributors"
    },
    {
      label: "Changelog",
      href: "/docs/changelog"
    }
  ],

  creator: "@_akkal_dhami",

  description: `${APP_NAME} is a component registry for building production-ready Node.js backends by composition, inspired by shadcn/ui. Servercn standardizes backend patterns so you can focus on business logic, not boilerplate.`,
  applicationName: `${APP_NAME}`,
  authors: [
    {
      name: "akkaldhami",
      url: "https://www.akkal.com.np"
    },
    {
      name: "servercn",
      url: "https://www.servercn.xyz"
    }
  ],
  generator: "Next.js",
  keywords: [
    `${APP_NAME}`,
    "Node.js backend",
    "Express",
    "JWT authentication",
    "API error handling",
    "Backend components",
    "Nodejs",
    "Expressjs",
    "Nextjs",
    "Nestjs",
    "TypeScript"
  ],
  author: "Akkal Dhami",
  metadataBase: new URL("https://www.servercn.xyz")
};
