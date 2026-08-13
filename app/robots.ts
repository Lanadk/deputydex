import type { MetadataRoute } from "next";
import { SITE_URL } from "@/app/_shared/seo/seo.config";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/component-library"],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
