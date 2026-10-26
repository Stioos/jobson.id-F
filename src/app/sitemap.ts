import type { MetadataRoute } from "next";
import { getSitemapRoutes } from "@/lib/routeRegistry";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://jobsonn.com";
  const routes = getSitemapRoutes();

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changefreq || "weekly",
    priority: route.priority || 0.5,
  }));
}
