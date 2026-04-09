import Link from "next/link";
import Container from "@/components/shared/Container";
import ProductCard from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import { freshClient } from "@/sanity/lib/client";
import { BEST_SELLERS_QUERY, ALL_PRODUCTS_QUERY } from "@/sanity/lib/queries";
import { Product } from "@/types";

const BestSellers = async () => {
    let displayProducts: Product[] = [];

    try {
        // Try best sellers first
        const bestSellers = await freshClient.fetch(BEST_SELLERS_QUERY);
        if (bestSellers?.length > 0) {
            displayProducts = bestSellers;
        } else {
            // No best sellers marked — show latest 4 Sanity products instead
            const all = await freshClient.fetch(ALL_PRODUCTS_QUERY);
            displayProducts = all?.slice(0, 4) ?? [];
        }
    } catch {
        displayProducts = [];
    }

    // Don't render the section if Sanity has no products at all
    if (displayProducts.length === 0) return null;

    return (
        <section className="bg-secondary/30 py-16 md:py-24">
            <Container>
                <div className="mb-6 md:mb-12 flex items-end justify-between">
                    <h2 className="text-xl font-bold uppercase tracking-widest md:text-4xl">
                        Best Sellers
                    </h2>
                    <Button variant="link" className="text-xs md:text-base text-primary inline-flex px-0" asChild>
                        <Link href="/shop">View All</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-x-6 md:gap-y-10">
                    {displayProducts.map((product) => (
                        <ProductCard key={product._id ?? product.id} product={product} />
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default BestSellers;
