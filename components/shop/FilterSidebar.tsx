"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Category } from "@/types";
import { resolveSlug, resolveId } from "@/lib/sanity-helpers";
import { cn } from "@/lib/utils";

interface ColorOption {
    hex: string;
    name?: string | null;
}

interface FilterSidebarProps {
    categories: Category[];
    sizes: string[];
    colors: ColorOption[];
}

export const FilterSidebar = ({ categories, sizes, colors }: FilterSidebarProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const selectedSizes = searchParams.get("sizes")?.split(",").filter(Boolean) || [];
    const selectedColors = searchParams.get("colors")?.split(",").filter(Boolean) || [];
    const selectedCategory = searchParams.get("category");

    const activeFilterCount = selectedSizes.length + selectedColors.length + (selectedCategory ? 1 : 0);

    const clearAllFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("sizes");
        params.delete("colors");
        params.delete("category");
        router.push(`/shop?${params.toString()}`);
    };

    const handleCategoryChange = (slug: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
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

    const handleColorToggle = (hex: string) => {
        const params = new URLSearchParams(searchParams.toString());
        let newColors = [...selectedColors];
        if (newColors.includes(hex)) {
            newColors = newColors.filter(c => c !== hex);
        } else {
            newColors.push(hex);
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
            {/* Active filters header */}
            {activeFilterCount > 0 && (
                <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                        {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
                    </span>
                    <button
                        onClick={clearAllFilters}
                        className="flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 font-medium transition-colors touch-manipulation"
                    >
                        <X className="h-3 w-3" />
                        Clear all
                    </button>
                </div>
            )}

            {/* Categories */}
            <div>
                <h3 className="text-base sm:text-lg font-semibold uppercase tracking-wider">Categories</h3>
                <Separator className="my-3 sm:my-4" />
                <div className="space-y-3">
                    <button
                        onClick={() => handleCategoryChange(null)}
                        className={cn(
                            "flex w-full items-center justify-between text-sm transition-colors hover:text-primary py-1 touch-manipulation",
                            !selectedCategory ? "font-medium text-primary" : "text-muted-foreground"
                        )}
                    >
                        All Categories
                        {!selectedCategory && <Check className="h-4 w-4 shrink-0" />}
                    </button>
                    {categories.map((category) => {
                        const id = resolveId(category);
                        const slug = resolveSlug(category.slug);
                        return (
                            <button
                                key={id}
                                onClick={() => handleCategoryChange(slug)}
                                className={cn(
                                    "flex w-full items-center justify-between text-sm transition-colors hover:text-primary py-1 touch-manipulation",
                                    selectedCategory === slug ? "font-medium text-primary" : "text-muted-foreground"
                                )}
                            >
                                {category.name}
                                {selectedCategory === slug && <Check className="h-4 w-4 shrink-0" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Size */}
            {sizes.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h3 className="text-base sm:text-lg font-semibold uppercase tracking-wider">Size</h3>
                        {selectedSizes.length > 0 && (
                            <button
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.delete("sizes");
                                    router.push(`/shop?${params.toString()}`);
                                }}
                                className="text-xs text-muted-foreground hover:text-destructive touch-manipulation"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    <Separator className="mb-3 sm:mb-4" />
                    <div className="grid grid-cols-3 gap-2">
                        {sizes.map((size) => (
                            <Button
                                key={size}
                                variant={selectedSizes.includes(size) ? "default" : "outline"}
                                size="sm"
                                className="h-10 w-full text-xs touch-manipulation"
                                onClick={() => handleSizeToggle(size)}
                            >
                                {size}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Color */}
            {colors.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h3 className="text-base sm:text-lg font-semibold uppercase tracking-wider">Color</h3>
                        {selectedColors.length > 0 && (
                            <button
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.delete("colors");
                                    router.push(`/shop?${params.toString()}`);
                                }}
                                className="text-xs text-muted-foreground hover:text-destructive touch-manipulation"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    <Separator className="mb-3 sm:mb-4" />
                    <div className="flex flex-wrap gap-3">
                        {colors.map(({ hex, name }) => {
                            const isSelected = selectedColors.includes(hex);
                            return (
                                <button
                                    key={hex}
                                    title={name || hex}
                                    onClick={() => handleColorToggle(hex)}
                                    className={cn(
                                        "relative w-9 h-9 rounded-full border-2 transition-all overflow-hidden touch-manipulation",
                                        isSelected
                                            ? "border-foreground scale-110 shadow-md ring-2 ring-offset-1 ring-foreground/30"
                                            : "border-gray-200 hover:border-gray-400 hover:scale-105"
                                    )}
                                    style={{ backgroundColor: hex }}
                                    aria-label={name || hex}
                                    aria-pressed={isSelected}
                                >
                                    {isSelected && (
                                        <span className="absolute inset-0 flex items-center justify-center">
                                            <Check className="h-4 w-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" />
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
