export const siteConfig = {
  title: {
    default: "ServerCN",
    template: "%s | ServerCN",
  },
  url: "https://servercn.com",
  github: "https://github.com/akkaldhami/servercn",
  navItems: [
    {
      label: "Docs",
      href: "/docs",
    },
    {
      label: "Components",
      href: "/components",
    },
    {
      label: "Foundations",
      href: "/foundations",
    },
  ],

  description:
    "Official ServerCN documentation. Guides, components, and best practices for building scalable Node.js backends.",
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
  ],
  metadataBase: new URL("https://servercn.com"),
};
