import type { MetadataRoute } from "next";
import { SPORTS } from "@/lib/catalog";

const BASE = "https://elpuo.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/sports",
    "/how-it-works",
    "/about",
    "/contact",
    "/policies/customization",
    "/policies/sizing",
    "/policies/shipping",
    "/policies/returns",
    "/policies/terms",
    "/policies/privacy",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${BASE}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...SPORTS.map((s) => ({
      url: `${BASE}/sports/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
