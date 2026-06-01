import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx$/
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  typedRoutes: true,
  redirects() {
    return [
      {
        source: "/docs",
        destination: "/docs/installation",
        permanent: true
      },
      {
        source: "/docs/express/components/route-handler",
        destination: "/docs/express/components/async-handler",
        permanent: true
      },
      {
        source: "/docs/nextjs/components/async-handler",
        destination: "/docs/nextjs/components/route-handler",
        permanent: true
      },
      {
        source: "/docs/express/foundations/nextjs-starter",
        destination: "/docs/express/foundations/express-starter",
        permanent: true
      },
      {
        source: "/docs/nextjs/foundations/express-starter",
        destination: "/docs/nextjs/foundations/nextjs-starter",
        permanent: true
      }
    ];
  }
};

export default withMDX(nextConfig);
