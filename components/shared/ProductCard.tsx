"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { useRef } from "react";
import { useInView } from "framer-motion";

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const ref = useRef<HTMLAnchorElement>(null);
    const isInView = useInView(ref, { amount: 0.5, margin: "0px 0px -20% 0px" });

    return (
        <Link ref={ref} href={`/shop/${product.slug}`} className="group block space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className={cn(
                        "object-cover transition-transform duration-500 group-hover:scale-105",
                        isInView && "scale-105 md:scale-100 md:group-hover:scale-105"
                    )}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {product.images[1] && (
                    <Image
                        src={product.images[1]}
                        alt={product.name}
                        fill
                        className={cn(
                            "absolute inset-0 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                            isInView && "opacity-100 md:opacity-0 md:group-hover:opacity-100"
                        )}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                )}
                {product.newArrival && (
                    <div className="absolute left-2 top-2 bg-black px-2 py-1 text-xs font-medium text-white uppercase tracking-wider">
                        New
                    </div>
                )}
                {product.originalPrice && (
                    <div className="absolute left-2 top-2 bg-red-600 px-2 py-1 text-xs font-medium text-white uppercase tracking-wider">
                        Sale
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-sm font-medium uppercase tracking-wide text-foreground group-hover:text-primary transition-colors">
                    {product.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{product.category}</p>
                <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-semibold">{formatCurrency(product.price)}</span>
                    {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through decoration-red-500">{formatCurrency(product.originalPrice)}</span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
