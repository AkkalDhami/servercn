import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx$/
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  redirects() {
    return [
      {
        source: "/docs",
        destination: "/docs/installation",
        permanent: true
      }
    ];
  },
  typedRoutes: true
};

export default withMDX(nextConfig);
