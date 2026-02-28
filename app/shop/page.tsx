import { Suspense } from "react";
import Fuse from "fuse.js";
import Container from "@/components/shared/Container";
import ProductCard from "@/components/shared/ProductCard";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { SortSelect } from "@/components/shop/SortSelect";
import { products } from "@/data/products";

// For server components to receive searchParams, type needs to be defined
interface ShopPageProps {
    searchParams: {
        category?: string;
        sort?: string;
        search?: string;
        sizes?: string;
        colors?: string;
    };
}

export default function ShopPage({ searchParams }: ShopPageProps) {
    // 1. Filter products based on Category and Search Query
    let filteredProducts = products;

    if (searchParams.category) {
        filteredProducts = filteredProducts.filter(
            (p) => p.category === searchParams.category
        );
    }

    if (searchParams.search) {
        const query = searchParams.search;
        const fuse = new Fuse(filteredProducts, {
            keys: [
                { name: "name", weight: 0.6 },
                { name: "category", weight: 0.3 },
                { name: "description", weight: 0.1 },
            ],
            threshold: 0.2, // Lower threshold to make matching more strict
            distance: 100,
            ignoreLocation: true,
        });
        const results = fuse.search(query);
        filteredProducts = results.map((result) => result.item);
    }

    if (searchParams.sizes) {
        const sizesArr = searchParams.sizes.split(",");
        filteredProducts = filteredProducts.filter((p) =>
            p.sizes && p.sizes.some((size) => sizesArr.includes(size))
        );
    }

    if (searchParams.colors) {
        const colorsArr = searchParams.colors.split(",");
        filteredProducts = filteredProducts.filter((p) =>
            p.colors && p.colors.some((color) => colorsArr.includes(color))
        );
    }

    // 2. Sort products
    const sort = searchParams.sort || "newest";

    filteredProducts = [...filteredProducts].sort((a, b) => {
        switch (sort) {
            case "price-asc":
                return a.price - b.price;
            case "price-desc":
                return b.price - a.price;
            case "newest":
            default:
                // Mock "newest" by just keeping original order or id based
                return Number(b.id) - Number(a.id);
        }
    });

    return (
        <Container className="pt-24 pb-8 md:pt-28 md:pb-12">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold uppercase tracking-widest">Shop</h1>
                    <p className="text-muted-foreground mt-2">
                        {filteredProducts.length} Products Found
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Mobile filter button removed, now side-nav shows everywhere */}
                    <Suspense fallback={<div>Loading sort...</div>}>
                        <SortSelect />
                    </Suspense>
                </div>
            </div>

            <div className="flex flex-row gap-4 md:grid md:grid-cols-4 lg:grid-cols-5 md:gap-8">
                {/* Sidebar - Now visible on all screens */}
                <aside className="w-1/3 md:w-auto md:col-span-1 shrink-0">
                    <Suspense fallback={<div>Loading filters...</div>}>
                        <FilterSidebar />
                    </Suspense>
                </aside>

                {/* Product Grid */}
                <div className="w-2/3 md:w-auto md:col-span-3 lg:col-span-4 flex-grow">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
                            <p className="text-muted-foreground">No products found for this category.</p>
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
}
