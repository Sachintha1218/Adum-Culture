import { notFound } from "next/navigation";
import { Metadata } from "next";
import Container from "@/components/shared/Container";
import ProductPageClient from "@/components/product/ProductPageClient";
import ProductCard from "@/components/shared/ProductCard";
import { getProductBySlug, getAllProductSlugs, getRelatedProducts } from "@/lib/admin-api";
import { products as fallbackProducts } from "@/data/products";
import { Product } from "@/types";
import { resolveSlug } from "@/lib/sanity-helpers";

export const revalidate = 60;
export const dynamicParams = true;

interface ProductPageProps {
    params: { slug: string };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    let product: Product | null = null;
    try {
        product = await getProductBySlug(params.slug);
    } catch {}

    if (!product) {
        const staticProduct = fallbackProducts.find(p => resolveSlug(p.slug) === params.slug);
        if (staticProduct) product = staticProduct as Product;
    }

    if (!product) return { title: "Product Not Found" };

    const imageUrl = typeof product.images?.[0] === 'string' ? product.images[0] : '/placeholder.jpg';
    const rawDesc = Array.isArray(product.description)
        ? product.description.join(" ")
        : (product.description ?? "");
    const description = rawDesc ? rawDesc.slice(0, 160) : `Shop ${product.name} at Adum Culture.`;

    return {
        title: `${product.name} — Adum Culture`,
        description,
        openGraph: { title: `${product.name} | Adum Culture`, description, images: [{ url: imageUrl, alt: product.name }], type: "website" },
        twitter: { card: "summary_large_image", title: `${product.name} | Adum Culture`, description, images: [imageUrl] },
    };
}

export async function generateStaticParams() {
    try {
        const slugs = await getAllProductSlugs();
        if (slugs?.length > 0) return slugs.map((item: { slug: string }) => ({ slug: item.slug }));
    } catch {}
    return fallbackProducts.map(product => ({ slug: resolveSlug(product.slug) }));
}

export default async function ProductPage({ params }: ProductPageProps) {
    let product: Product | null = null;
    let relatedProducts: Product[] = [];
    const slug = params.slug;

    try {
        product = await getProductBySlug(slug);
    } catch {}

    if (!product) {
        const staticProduct = fallbackProducts.find(p => resolveSlug(p.slug) === slug);
        if (staticProduct) product = staticProduct as Product;
    }

    if (!product) notFound();

    try {
        relatedProducts = await getRelatedProducts(product!.category, slug, 4);
    } catch {
        relatedProducts = fallbackProducts
            .filter(p => p.category === product!.category && resolveSlug(p.slug) !== slug)
            .slice(0, 4) as Product[];
    }

    return (
        <Container className="pt-24 md:pt-32 pb-10 md:pb-16">
            <ProductPageClient product={product!} />

            {relatedProducts.length > 0 && (
                <div className="mt-24 border-t pt-16">
                    <h2 className="mb-12 text-center text-3xl font-bold uppercase tracking-widest md:text-4xl">
                        Complete the Look
                    </h2>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                        {relatedProducts.map(related => (
                            <ProductCard key={related._id ?? related.id} product={related} />
                        ))}
                    </div>
                </div>
            )}
        </Container>
    );
}
