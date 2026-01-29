import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://servercn.vercel.app"; // change to your domain

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/private/", "/dashboard/"]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
