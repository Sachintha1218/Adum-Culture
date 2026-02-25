import { notFound } from "next/navigation";
import Container from "@/components/shared/Container";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import { products } from "@/data/products";
import ProductCard from "@/components/shared/ProductCard";

interface ProductPageProps {
    params: {
        slug: string;
    };
}

export async function generateStaticParams() {
    return products.map((product) => ({
        slug: product.slug,
    }));
}

export default function ProductPage({ params }: ProductPageProps) {
    const product = products.find((p) => p.slug === params.slug);

    if (!product) {
        notFound();
    }

    // Get related products (same category, excluding current)
    const relatedProducts = products
        .filter((p) => p.category === product.category && p.slug !== product.slug)
        .slice(0, 4);

    return (
        <Container className="pt-24 md:pt-32 pb-10 md:pb-16">
            <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2 lg:gap-x-16 items-start">
                {/* Gallery */}
                <ProductGallery images={product.images} />

                {/* Info */}
                <ProductInfo product={product} />
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-24 border-t pt-16">
                    <h2 className="mb-12 text-center text-3xl font-bold uppercase tracking-widest md:text-4xl">Complete the Look</h2>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                        {relatedProducts.map((related) => (
                            <ProductCard key={related.id} product={related} />
                        ))}
                    </div>
                </div>
            )}
        </Container>
    );
}
