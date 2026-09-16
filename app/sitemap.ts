export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return isIndexable && siteUrl
    ? [{ url: siteUrl, changeFrequency: "yearly", priority: 1 }]
    : [];
}
