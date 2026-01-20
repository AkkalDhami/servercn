export const siteConfig = {
  title: {
    default: "ServerCN",
    template: "%s | ServerCN"
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
      label: "Schemas",
      href: "/schemas"
    }
  ],

  description:
    "ServerCN is a component registry for building production-ready Node.js backends by composition, inspired by shadcn/ui. ServerCN standardizes backend patterns so you can focus on business logic, not boilerplate.",
  applicationName: "ServerCN",
  authors: [{ name: "akkaldhami" }],
  generator: "Next.js",
  keywords: [
    "ServerCN",
    "Node.js backend",
    "Express",
    "JWT authentication",
    "API error handling",
    "Backend components",
    "Documentation",
    "Nodejs",
    "Express",
    "Server"
  ],
  author: "Akkal Dhami",
  metadataBase: new URL("https://servercn.vercel.app")
};
