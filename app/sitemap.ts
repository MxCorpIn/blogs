import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/constants";
import { getPostMetaList } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPosts: MetadataRoute.Sitemap = getPostMetaList().map((post) => ({
    url: `${APP_URL}/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: post.featured ? 0.75 : 0.65,
  }));

  return [
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...blogPosts,
  ];
}
