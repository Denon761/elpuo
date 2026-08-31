import type { MetadataRoute } from "next";
import { abs, SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/thank-you"],
    },
    sitemap: abs("/sitemap.xml"),
    host: SITE_URL,
  };
}
