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
import { getAllProducts, getAllCollections } from "@/lib/admin-api";
import { products as fallbackProducts } from "@/data/products";
import { categories as fallbackCategories } from "@/data/categories";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Product, Category } from "@/types";

// Always fetch fresh data from Sanity
export const revalidate = 0;

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
        const adminProducts = await getAllProducts();
        allProducts = adminProducts?.length > 0 ? adminProducts : fallbackProducts;
    } catch {
        allProducts = fallbackProducts;
    }

    try {
        const adminCategories = await getAllCollections();
        allCategories = adminCategories?.length > 0 ? adminCategories : fallbackCategories;
    } catch {
        allCategories = fallbackCategories;
    }

    // Derive available sizes (from all products, sorted by standard order)
    const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];
    const allSizeSet = new Set<string>();
    allProducts.forEach(p => p.sizes?.forEach((s: { size: string }) => allSizeSet.add(s.size)));
    const availableSizes = Array.from(allSizeSet).sort((a, b) => {
        const ai = SIZE_ORDER.indexOf(a), bi = SIZE_ORDER.indexOf(b);
        if (ai === -1 && bi === -1) return a.localeCompare(b);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
    });

    // Derive available colors (unique by hex, from colorVariants of all products)
    const colorMap = new Map<string, string | null>();
    allProducts.forEach(p => {
        (p.colorVariants ?? []).forEach((cv: { colorHex: string; colorName?: string | null }) => {
            if (!colorMap.has(cv.colorHex)) colorMap.set(cv.colorHex, cv.colorName ?? null);
        });
    });
    const availableColors = Array.from(colorMap.entries()).map(([hex, name]) => ({ hex, name }));

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
        const query = searchParams.search.trim();
        if (query.length > 0) {
            const q = query.toLowerCase();
            if (query.length <= 2) {
                // Short queries: simple substring match so single letters return all matching products
                filteredProducts = filteredProducts.filter((p) => {
                    const desc = Array.isArray(p.description) ? p.description.join(" ") : (p.description ?? "");
                    return (
                        p.name.toLowerCase().includes(q) ||
                        (p.category && p.category.toLowerCase().includes(q)) ||
                        (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
                        desc.toLowerCase().includes(q)
                    );
                });
            } else {
                // Longer queries: fuzzy search with permissive threshold
                const fuse = new Fuse(filteredProducts, {
                    keys: [
                        { name: "name", weight: 0.6 },
                        { name: "categoryName", weight: 0.2 },
                        { name: "category", weight: 0.2 },
                        { name: "description", weight: 0.1 },
                    ],
                    threshold: 0.45,
                    distance: 300,
                    ignoreLocation: true,
                    minMatchCharLength: 2,
                });
                const results = fuse.search(query);
                // Fall back to substring if fuzzy returns nothing
                filteredProducts = results.length > 0
                    ? results.map((r) => r.item)
                    : filteredProducts.filter((p) => {
                        const desc = Array.isArray(p.description) ? p.description.join(" ") : (p.description ?? "");
                        return (
                            p.name.toLowerCase().includes(q) ||
                            (p.category && p.category.toLowerCase().includes(q)) ||
                            (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
                            desc.toLowerCase().includes(q)
                        );
                    });
            }
        }
    }

    if (searchParams.sizes) {
        const sizesArr = searchParams.sizes.split(",");
        filteredProducts = filteredProducts.filter((p) =>
            p.sizes && p.sizes.some((s) => sizesArr.includes(s.size))
        );
    }

    if (searchParams.colors) {
        const colorsArr = searchParams.colors.split(",");
        filteredProducts = filteredProducts.filter((p) =>
            (p.colorVariants ?? []).some((cv: { colorHex: string }) => colorsArr.includes(cv.colorHex))
        );
    }

    // 2. Sort products
    const sort = searchParams.sort || "featured";
    filteredProducts = [...filteredProducts].sort((a, b) => {
        switch (sort) {
            case "price-asc":
                return a.price - b.price;
            case "price-desc":
                return b.price - a.price;
            case "newest":
                return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
            case "featured":
            default:
                return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
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
                                <Button variant="outline" className="flex items-center gap-2 relative">
                                    <Filter className="h-4 w-4" />
                                    Filters
                                    {(() => {
                                        const count =
                                            (searchParams.sizes ? searchParams.sizes.split(",").filter(Boolean).length : 0) +
                                            (searchParams.colors ? searchParams.colors.split(",").filter(Boolean).length : 0) +
                                            (searchParams.category ? 1 : 0);
                                        return count > 0 ? (
                                            <span className="absolute -top-1.5 -right-1.5 bg-foreground text-background text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                                                {count}
                                            </span>
                                        ) : null;
                                    })()}
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[85%] sm:max-w-md overflow-y-auto h-full pt-14 px-5">
                                <Suspense fallback={<div>Loading filters...</div>}>
                                    <FilterSidebar categories={allCategories} sizes={availableSizes} colors={availableColors} />
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
                        <FilterSidebar categories={allCategories} sizes={availableSizes} colors={availableColors} />
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
