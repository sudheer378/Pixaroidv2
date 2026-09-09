import type { MetadataRoute } from "next";
import { siteSeo } from "@/core/seo/config";
import { toolRegistry } from "@/core/tools/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteSeo.url, changeFrequency: "weekly", priority: 1 },
  ];

  const toolRoutes: MetadataRoute.Sitemap = toolRegistry.map((tool) => ({
    url: `${siteSeo.url}/tools/${tool.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...toolRoutes];
}
