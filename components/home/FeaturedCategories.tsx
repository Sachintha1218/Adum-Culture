import Link from "next/link";
import Image from "next/image";
import Container from "@/components/shared/Container";
import { client } from "@/sanity/lib/client";
import { FEATURED_CATEGORIES_QUERY } from "@/sanity/lib/queries";
import { categories as fallbackCategories } from "@/data/categories";
import { resolveImageUrl, resolveSlug, resolveId } from "@/lib/sanity-helpers";
import { Category } from "@/types";

const FeaturedCategories = async () => {
    let featured: Category[] = [];

    try {
        const sanityCategories = await client.fetch(FEATURED_CATEGORIES_QUERY);
        featured = sanityCategories?.length > 0 ? sanityCategories : fallbackCategories.slice(0, 3);
    } catch {
        featured = fallbackCategories.slice(0, 3);
    }

    return (
        <section className="py-16 md:py-24">
            <Container>
                <h2 className="mb-12 text-center text-3xl font-bold uppercase tracking-widest md:text-4xl">
                    Shop by Category
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {featured.map((category) => {
                        const id = resolveId(category);
                        const slug = resolveSlug(category.slug);
                        const imageUrl = resolveImageUrl(category.image, 800);
                        return (
                            <Link
                                key={id}
                                href={`/shop?category=${slug}`}
                                className="group relative block aspect-[4/5] overflow-hidden bg-gray-100"
                            >
                                <Image
                                    src={imageUrl}
                                    alt={category.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="bg-white/90 px-6 py-3 text-xl font-bold uppercase tracking-wider backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-2 group-hover:bg-white">
                                        {category.name}
                                    </h3>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
};

export default FeaturedCategories;
