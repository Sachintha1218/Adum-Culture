"use client";

import { useState } from "react";
import { Product } from "@/types";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";

export default function ProductPageClient({ product }: { product: Product }) {
    const hasVariantImages = product.productType === 'variable' &&
        product.colorVariants && product.colorVariants.length > 0;

    const [activeColorHex, setActiveColorHex] = useState<string | null>(
        hasVariantImages ? (product.colorVariants![0].colorHex) : null
    );

    // Get images for the currently selected color
    const controlledImages = hasVariantImages && activeColorHex
        ? (product.colorVariants!.find(cv => cv.colorHex === activeColorHex)?.images ?? []) as string[]
        : undefined;

    return (
        <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2 lg:gap-x-16 items-start">
            <ProductGallery
                images={product.images}
                controlledImages={controlledImages}
            />
            <ProductInfo
                product={product}
                onColorChange={hasVariantImages ? setActiveColorHex : undefined}
            />
        </div>
    );
}
