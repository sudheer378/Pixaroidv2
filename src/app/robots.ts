import type { MetadataRoute } from "next";
import { siteSeo } from "@/core/seo/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${siteSeo.url}/sitemap.xml`,
  };
}
