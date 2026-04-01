"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { resolveImageUrl } from "@/lib/sanity-helpers";
import { SanityImage } from "@/types";

interface ProductGalleryProps {
    images: (SanityImage | string)[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
    const resolvedImages = images.map((img) => resolveImageUrl(img, 1200));
    const [selectedImage, setSelectedImage] = useState(resolvedImages[0] || "");


    return (
        <div className="flex flex-col gap-4">
            {/* Adaptive Gallery Layout: Stacked on Mobile, Thumbnails on Left on Desktop */}
            <div className="flex flex-col md:flex-row gap-4 lg:gap-8 h-auto md:h-[600px] lg:h-[700px]">

                {/* Main Image View - Moved First for Mobile */}
                <div className="relative w-full aspect-[3/4] md:flex-1 md:aspect-auto rounded-sm overflow-hidden bg-gray-100 group order-1 md:order-2">
                    <Image
                        key={selectedImage}
                        src={selectedImage}
                        alt="Product main image"
                        fill
                        className="object-cover animate-in fade-in duration-500 ease-out"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                        priority
                    />
                </div>

                {/* Thumbnails Column/Row */}
                <div className="relative flex flex-row md:flex-col w-full md:w-20 lg:w-24 flex-shrink-0 order-2 md:order-1">
                    {/* The elegant connecting line - Only on desktop */}
                    <div className="hidden md:block absolute left-[8px] top-4 bottom-4 w-px bg-primary/20 z-0" />

                    <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden h-24 md:h-full py-2 md:py-4 z-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {resolvedImages.map((image, index) => (
                            <div key={index} className="relative flex items-center group flex-shrink-0">
                                {/* Active Indicator Line */}
                                <div
                                    className={cn(
                                        "absolute bg-primary transition-all duration-300 z-20",
                                        "md:left-0 md:w-[2px] md:h-full",
                                        "bottom-0 w-full h-[2px] md:hidden",
                                        selectedImage === image
                                            ? "opacity-100 scale-100"
                                            : "opacity-0 scale-0 group-hover:opacity-50 group-hover:scale-100"
                                    )}
                                />

                                <button
                                    onClick={() => setSelectedImage(image)}
                                    aria-label={`View product image ${index + 1}`}
                                    className={cn(
                                        "relative md:ml-4 h-full md:h-auto aspect-[3/4] w-16 md:w-full overflow-hidden rounded-sm bg-gray-100 transition-all duration-500 will-change-transform mb-2 md:mb-0",
                                        selectedImage === image
                                            ? "opacity-100 shadow-md scale-100"
                                            : "opacity-60 hover:opacity-100 scale-95 hover:scale-100 cursor-pointer"
                                    )}
                                >
                                    <Image
                                        src={image}
                                        alt={`Product thumbnail ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 80px, 150px"
                                    />
                                    {/* Subtle overlay for unselected items */}
                                    <div className={cn(
                                        "absolute inset-0 bg-background/20 transition-opacity duration-300",
                                        selectedImage === image ? "opacity-0" : "opacity-100 group-hover:opacity-0"
                                    )} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductGallery;
