import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/constants";

function hostFromAppUrl(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return "blog.ossium.in";
  }
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${APP_URL}/sitemap.xml`,
    host: hostFromAppUrl(APP_URL),
  };
}
