import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const publicRoutes = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/navigation/about-app", changeFrequency: "monthly", priority: 0.7 },
    { path: "/navigation/bikes", changeFrequency: "weekly", priority: 0.8 },
    { path: "/navigation/blogs", changeFrequency: "weekly", priority: 0.7 },
    { path: "/navigation/Cars", changeFrequency: "weekly", priority: 0.8 },
    { path: "/navigation/help", changeFrequency: "monthly", priority: 0.5 },
    { path: "/component/rules/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/component/rules/terms", changeFrequency: "yearly", priority: 0.3 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
    if (!siteUrl) {
        return [];
    }

    return publicRoutes.map((route) => ({
        url: new URL(route.path, siteUrl).toString(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));
}