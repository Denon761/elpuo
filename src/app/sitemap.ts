import type { MetadataRoute } from "next";
import { SPORTS } from "@/lib/catalog";
import { abs } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

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
      url: abs(path || "/"),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...SPORTS.map((s) => ({
      url: abs(`/sports/${s.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
      images: (s.images ?? []).map((img) => abs(img.src)),
    })),
  ];
}
