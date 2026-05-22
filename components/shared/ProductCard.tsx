"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Product } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { resolveImageUrl, resolveSlug } from "@/lib/sanity-helpers";

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const slug = resolveSlug(product.slug);
    const hasColors = product.colorVariants && product.colorVariants.length > 0;

    // For variable products with per-color images, track selected color
    const [activeColorIdx, setActiveColorIdx] = useState(0);

    const activeVariant = hasColors ? product.colorVariants![activeColorIdx] : null;

    // Resolve images: variable uses per-color images, single uses product images
    const colorImages = activeVariant?.images ?? [];
    const productImages = product.images;
    const img1Src = colorImages.length > 0
        ? (typeof colorImages[0] === 'string' ? colorImages[0] : resolveImageUrl(colorImages[0] as never, 600))
        : resolveImageUrl(productImages[0], 600);
    const img2Src = colorImages.length > 1
        ? (typeof colorImages[1] === 'string' ? colorImages[1] : resolveImageUrl(colorImages[1] as never, 600))
        : (productImages[1] ? resolveImageUrl(productImages[1], 600) : null);

    const discountPercentage = product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const totalStock = hasColors
        ? (activeVariant?.sizes ?? []).reduce((s, sz) => s + sz.stock, 0)
        : (product.sizes || []).reduce((sum, s) => sum + (s?.quantity || 0), 0);

    return (
        <div className="block space-y-3">
            <Link href={`/shop/${slug}`} className="group block relative aspect-[3/4] overflow-hidden bg-gray-100">
                <Image
                    src={img1Src}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                {img2Src && (
                    <Image
                        src={img2Src}
                        alt={product.name}
                        fill
                        className="absolute inset-0 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                )}
                {product.newArrival && (
                    <div className="absolute left-2 top-2 bg-black px-2 py-1 text-xs font-medium text-white uppercase tracking-wider">New</div>
                )}
                {discountPercentage > 0 && (
                    <div className="absolute left-2 bottom-2 bg-[#B91C1C] px-2 py-1 text-xs font-bold text-white tracking-widest z-10">
                        {discountPercentage}% OFF
                    </div>
                )}
                {totalStock === 0 && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                        <span className="bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-black">Out of Stock</span>
                    </div>
                )}
            </Link>

            <div>
                <Link href={`/shop/${slug}`}>
                    <h3 className="text-sm font-medium uppercase tracking-wide text-foreground hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                </Link>
                <p className="mt-0.5 text-sm text-muted-foreground">{product.categoryName ?? product.category}</p>

                {/* Color swatches */}
                {hasColors && product.colorVariants!.length > 1 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        {product.colorVariants!.map((cv, idx) => {
                            const isOos = cv.sizes.every(s => s.stock === 0)
                            return (
                                <button
                                    key={cv.colorHex}
                                    onClick={e => { e.preventDefault(); setActiveColorIdx(idx) }}
                                    title={cv.colorHex}
                                    className={cn(
                                        "relative w-5 h-5 rounded-full border-2 transition-all overflow-hidden",
                                        activeColorIdx === idx ? "border-black scale-110" : "border-gray-200 hover:border-gray-400",
                                        isOos && "opacity-50"
                                    )}
                                    style={{ backgroundColor: cv.colorHex }}
                                >
                                    {isOos && (
                                        <span className="absolute inset-0 flex items-center justify-center">
                                            <span className="block w-[140%] h-px bg-gray-400 rotate-[-45deg]" />
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                )}

                <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    {product.originalPrice && (
                        <span className="text-sm font-medium text-muted-foreground line-through decoration-gray-400">{formatCurrency(product.originalPrice)}</span>
                    )}
                    <span className={cn("text-[15px] font-bold", discountPercentage > 0 ? "text-[#B91C1C]" : "text-foreground")}>
                        {formatCurrency(product.price)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
