"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { categories } from "@/data/categories";
import { cn } from "@/lib/utils";

const sizes = ["XS", "S", "M", "L", "XL"];
const colors = ["Black", "White", "Navy", "Red", "Beige", "Floral Print"];

export const FilterSidebar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const selectedSizes = searchParams.get("sizes")?.split(",") || [];
    const selectedColors = searchParams.get("colors")?.split(",") || [];
    const selectedCategory = searchParams.get("category");

    const handleCategoryChange = (slug: string | null) => {
        const params = new URLSearchParams(searchParams.toString());

        // When clicking a category, we want to clear any active search query
        // so that the user sees all products in that category, not just those matching the old search.
        params.delete("search");

        if (slug) {
            params.set("category", slug);
        } else {
            params.delete("category");
        }
        router.push(`/shop?${params.toString()}`);
    };

    const handleSizeToggle = (size: string) => {
        const params = new URLSearchParams(searchParams.toString());
        let newSizes = [...selectedSizes];
        if (newSizes.includes(size)) {
            newSizes = newSizes.filter(s => s !== size);
        } else {
            newSizes.push(size);
        }

        if (newSizes.length > 0) {
            params.set("sizes", newSizes.join(","));
        } else {
            params.delete("sizes");
        }
        router.push(`/shop?${params.toString()}`);
    };

    const handleColorToggle = (color: string) => {
        const params = new URLSearchParams(searchParams.toString());
        let newColors = [...selectedColors];
        if (newColors.includes(color)) {
            newColors = newColors.filter(c => c !== color);
        } else {
            newColors.push(color);
        }

        if (newColors.length > 0) {
            params.set("colors", newColors.join(","));
        } else {
            params.delete("colors");
        }
        router.push(`/shop?${params.toString()}`);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold uppercase tracking-wider">Categories</h3>
                <Separator className="my-4" />
                <div className="space-y-2">
                    <button
                        onClick={() => handleCategoryChange(null)}
                        className={cn(
                            "flex w-full items-center justify-between text-sm transition-colors hover:text-primary",
                            !selectedCategory ? "font-medium text-primary" : "text-muted-foreground"
                        )}
                    >
                        All Categories
                        {!selectedCategory && <Check className="h-4 w-4" />}
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryChange(category.slug)}
                            className={cn(
                                "flex w-full items-center justify-between text-sm transition-colors hover:text-primary",
                                selectedCategory === category.slug ? "font-medium text-primary" : "text-muted-foreground"
                            )}
                        >
                            {category.name}
                            {selectedCategory === category.slug && <Check className="h-4 w-4" />}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold uppercase tracking-wider">Size</h3>
                <Separator className="my-4" />
                <div className="grid grid-cols-3 gap-2">
                    {sizes.map((size) => (
                        <Button
                            key={size}
                            variant={selectedSizes.includes(size) ? "default" : "outline"}
                            size="sm"
                            className="h-9 w-full"
                            onClick={() => handleSizeToggle(size)}
                        >
                            {size}
                        </Button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold uppercase tracking-wider">Color</h3>
                <Separator className="my-4" />
                <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                        <Button
                            key={color}
                            variant={selectedColors.includes(color) ? "default" : "outline"}
                            size="sm"
                            className="h-9"
                            onClick={() => handleColorToggle(color)}
                        >
                            {color}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};
