import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Shop",
    description:
        "Browse the full Adum Culture collection — dresses, tops, bottoms, and accessories. Filter by size, colour, and category.",
};
import Fuse from "fuse.js";
import { Filter } from "lucide-react";
import Container from "@/components/shared/Container";
import ProductCard from "@/components/shared/ProductCard";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { SortSelect } from "@/components/shop/SortSelect";
import { client } from "@/sanity/lib/client";
import { ALL_PRODUCTS_QUERY, ALL_CATEGORIES_QUERY } from "@/sanity/lib/queries";
import { products as fallbackProducts } from "@/data/products";
import { categories as fallbackCategories } from "@/data/categories";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Product, Category } from "@/types";
import { resolveSlug } from "@/lib/sanity-helpers";

// Static rendering with ISR - revalidate every 60 seconds
export const revalidate = 60;

interface ShopPageProps {
    searchParams: {
        category?: string;
        sort?: string;
        search?: string;
        sizes?: string;
        colors?: string;
    };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    // Fetch products and categories from Sanity, fall back to static data
    let allProducts: Product[] = [];
    let allCategories: Category[] = [];

    try {
        const sanityProducts = await client.fetch(ALL_PRODUCTS_QUERY);
        allProducts = sanityProducts?.length > 0 ? sanityProducts : fallbackProducts;
    } catch {
        allProducts = fallbackProducts;
    }

    try {
        const sanityCategories = await client.fetch(ALL_CATEGORIES_QUERY);
        allCategories = sanityCategories?.length > 0 ? sanityCategories : fallbackCategories;
    } catch {
        allCategories = fallbackCategories;
    }

    // 1. Filter products
    let filteredProducts = allProducts;

    if (searchParams.category && searchParams.category !== "best-sellers") {
        filteredProducts = filteredProducts.filter(
            (p) => p.category === searchParams.category
        );
    }
    if (searchParams.category === "best-sellers") {
        filteredProducts = filteredProducts.filter((p) => p.bestSeller);
    }

    if (searchParams.search) {
        const query = searchParams.search;
        const fuse = new Fuse(filteredProducts, {
            keys: [
                { name: "name", weight: 0.6 },
                { name: "category", weight: 0.3 },
                { name: "description", weight: 0.1 },
            ],
            threshold: 0.2,
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
                return 0; // Sanity already orders by _createdAt desc
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
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[85%] sm:max-w-md overflow-y-auto h-full pt-16">
                                <Suspense fallback={<div>Loading filters...</div>}>
                                    <FilterSidebar categories={allCategories} />
                                </Suspense>
                            </SheetContent>
                        </Sheet>
                    </div>
                    <Suspense fallback={<div>Loading sort...</div>}>
                        <SortSelect />
                    </Suspense>
                </div>
            </div>

            <div className="flex flex-col gap-6 md:grid md:grid-cols-4 lg:grid-cols-5 md:gap-8">
                {/* Sidebar - Hidden on mobile, visible on tablet+ */}
                <aside className="hidden md:block md:w-auto md:col-span-1 shrink-0">
                    <Suspense fallback={<div>Loading filters...</div>}>
                        <FilterSidebar categories={allCategories} />
                    </Suspense>
                </aside>

                {/* Product Grid */}
                <div className="w-full md:col-span-3 lg:col-span-4 flex-grow">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product._id ?? product.id} product={product} />
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
