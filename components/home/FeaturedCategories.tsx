import Link from "next/link";
import Image from "next/image";
import Container from "@/components/shared/Container";
import { getAllCollections } from "@/lib/admin-api";
import { resolveSlug, resolveId } from "@/lib/sanity-helpers";
import { Category } from "@/types";

const FeaturedCategories = async () => {
    let featured: Category[] = [];

    try {
        featured = await getAllCollections();
    } catch {
        featured = [];
    }

    // Don't render the section if no categories exist in Sanity
    if (featured.length === 0) return null;

    const gridClass =
        featured.length === 1
            ? "grid gap-6 max-w-lg mx-auto"
            : featured.length === 2
            ? "grid gap-6 sm:grid-cols-2"
            : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

    return (
        <section className="py-16 md:py-24">
            <Container>
                <h2 className="mb-12 text-center text-3xl font-bold uppercase tracking-widest md:text-4xl">
                    Shop by Category
                </h2>
                <div className={gridClass}>
                    {featured.map((category) => {
                        const id = resolveId(category);
                        const slug = resolveSlug(category.slug);
                        const imageUrl = typeof category.image === 'string' ? category.image : '/placeholder.jpg';
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
