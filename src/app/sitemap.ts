import type { MetadataRoute } from "next";
import { siteSeo } from "@/core/seo/config";
import { toolRegistry } from "@/core/tools/registry";
import { toolCategories } from "@/core/tools/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteSeo.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteSeo.url}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteSeo.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteSeo.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteSeo.url}/contact`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = toolCategories.map((category) => ({
    url: `${siteSeo.url}/${category.slug}`,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const toolRoutes: MetadataRoute.Sitemap = toolRegistry.map((tool) => ({
    url: `${siteSeo.url}/tools/${tool.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes];
}
