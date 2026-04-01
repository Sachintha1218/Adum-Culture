import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { ALL_PRODUCT_SLUGS_QUERY } from "@/sanity/lib/queries";
import { products as fallbackProducts } from "@/data/products";
import { resolveSlug } from "@/lib/sanity-helpers";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://adumculture.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let productSlugs: string[] = fallbackProducts.map((p) => resolveSlug(p.slug));

    try {
        const slugs = await client.fetch(ALL_PRODUCT_SLUGS_QUERY);
        if (slugs?.length > 0) {
            productSlugs = slugs.map((s: { slug: string }) => s.slug);
        }
    } catch {
        // fall through to fallback slugs already set above
    }

    const productPages: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
        url: `${siteUrl}/shop/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    return [
        { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
        { url: `${siteUrl}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
        { url: `${siteUrl}/gift-vouchers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
        { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
        { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
        ...productPages,
    ];
}
