import Link from "next/link";
import Container from "@/components/shared/Container";
import ProductCard from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";

const BestSellers = () => {
    // Filter best sellers and take up to 4
    const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);

    // If not enough best sellers, just take first 4 products
    const displayProducts = bestSellers.length > 0 ? bestSellers : products.slice(0, 4);

    return (
        <section className="bg-secondary/30 py-16 md:py-24">
            <Container>
                <div className="mb-12 flex items-end justify-between">
                    <h2 className="text-3xl font-bold uppercase tracking-widest md:text-4xl">
                        Best Sellers
                    </h2>
                    <Button variant="link" className="hidden text-base text-primary md:inline-flex" asChild>
                        <Link href="/shop?category=best-sellers">View All</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                    {displayProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-10 flex justify-center md:hidden">
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/shop?category=best-sellers">View All Best Sellers</Link>
                    </Button>
                </div>
            </Container>
        </section>
    );
};

export default BestSellers;
