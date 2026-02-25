import { Suspense } from "react";
import Fuse from "fuse.js";
import Container from "@/components/shared/Container";
import ProductCard from "@/components/shared/ProductCard";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { SortSelect } from "@/components/shop/SortSelect";
import { products } from "@/data/products";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

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
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm" className="h-10 gap-2">
                                    <Filter className="h-4 w-4" />
                                    Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <div className="mt-6">
                                    <FilterSidebar />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                    <Suspense fallback={<div>Loading sort...</div>}>
                        <SortSelect />
                    </Suspense>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
                {/* Sidebar - Desktop */}
                <aside className="hidden md:block md:col-span-1">
                    <Suspense fallback={<div>Loading filters...</div>}>
                        <FilterSidebar />
                    </Suspense>
                </aside>

                {/* Product Grid */}
                <div className="md:col-span-3 lg:col-span-4">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
