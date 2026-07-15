import { SERVERCN_URL } from "@/lib/constants";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SERVERCN_URL;

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
