import type { MetadataRoute } from "next";
import { siteSeo } from "@/core/seo/config";
import { toolRegistry } from "@/core/tools/registry";
import { toolCategories } from "@/core/tools/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  // Build timestamp: the site is fully static, so every route is regenerated
  // on each deploy. Gives crawlers a recrawl signal alongside changeFrequency.
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteSeo.url, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${siteSeo.url}/about`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteSeo.url}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteSeo.url}/terms`, lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteSeo.url}/contact`, lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = toolCategories.map((category) => ({
    url: `${siteSeo.url}/${category.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const toolRoutes: MetadataRoute.Sitemap = toolRegistry.map((tool) => ({
    url: `${siteSeo.url}/tools/${tool.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes];
}
