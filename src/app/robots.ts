import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/admin",
                "/api",
                "/navigation/bookings",
                "/navigation/checkout",
                "/navigation/login",
                "/navigation/profile",
            ],
        },
        ...(siteUrl
            ? { sitemap: new URL("/sitemap.xml", siteUrl).toString() }
            : {}),
    };
}