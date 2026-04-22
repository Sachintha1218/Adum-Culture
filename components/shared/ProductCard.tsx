"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { resolveImageUrl, resolveSlug } from "@/lib/sanity-helpers";
import { useRef } from "react";
import { useInView } from "framer-motion";

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const ref = useRef<HTMLAnchorElement>(null);
    const isInView = useInView(ref, { amount: 0.5, margin: "0px 0px -20% 0px" });

    const slug = resolveSlug(product.slug);
    const img1 = resolveImageUrl(product.images[0], 600);
    const img2 = product.images[1] ? resolveImageUrl(product.images[1], 600) : null;
    const discountPercentage = product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <Link ref={ref} href={`/shop/${slug}`} className="group block space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <Image
                    src={img1}
                    alt={product.name}
                    fill
                    className={cn(
                        "object-cover transition-transform duration-500 group-hover:scale-105",
                        isInView && "scale-105 md:scale-100 md:group-hover:scale-105"
                    )}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                {img2 && (
                    <Image
                        src={img2}
                        alt={product.name}
                        fill
                        className={cn(
                            "absolute inset-0 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                            isInView && "opacity-100 md:opacity-0 md:group-hover:opacity-100"
                        )}
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                )}
                {product.newArrival && (
                    <div className="absolute left-2 top-2 bg-black px-2 py-1 text-xs font-medium text-white uppercase tracking-wider">
                        New
                    </div>
                )}
                {discountPercentage > 0 && (
                    <div className="absolute left-2 bottom-2 bg-[#B91C1C] px-2 py-1 text-xs font-bold text-white tracking-widest z-10">
                        {discountPercentage}% OFF
                    </div>
                )}
                {(() => {
                    const totalStock = product.sizeStocks && product.sizeStocks.length > 0
                        ? product.sizeStocks.reduce((sum, s) => sum + s.quantity, 0)
                        : (product.stock ?? 0);
                    
                    if (totalStock === 0) {
                        return (
                            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                <span className="bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-black">
                                    Out of Stock
                                </span>
                            </div>
                        );
                    }
                    return null;
                })()}
            </div>
            <div>
                <h3 className="text-sm font-medium uppercase tracking-wide text-foreground group-hover:text-primary transition-colors">
                    {product.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{product.categoryName ?? product.category}</p>
                <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    {product.originalPrice && (
                        <span className="text-sm font-medium text-muted-foreground line-through decoration-gray-400">{formatCurrency(product.originalPrice)}</span>
                    )}
                    <span className={cn(
                        "text-[15px] font-bold",
                        discountPercentage > 0 ? "text-[#B91C1C]" : "text-foreground"
                    )}>{formatCurrency(product.price)}</span>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
