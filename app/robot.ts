import type { MetadataRoute } from "next";
import { getURL } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/"],
      },
    ],
    sitemap: getURL("/sitemap.xml"),
  };
}
