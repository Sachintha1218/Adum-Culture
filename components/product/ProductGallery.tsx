"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
    images: string[];
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(images[0] || "");

    return (
        <div className="flex flex-col gap-4">
            {/* Mobile Carousel Removed to use desktop layout */}

            {/* Adaptive Gallery Layout: Thumbnails on Left, Main Image on Right */}
            <div className="flex flex-row gap-2 md:gap-4 lg:gap-8 h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px]">
                {/* Thumbnails Column - Creative Vertical Line Layout */}
                <div className="relative flex flex-col w-16 md:w-20 lg:w-24 flex-shrink-0">
                    {/* The elegant connecting line */}
                    <div className="absolute left-[8px] top-4 bottom-4 w-px bg-primary/20 z-0" />

                    <div className="flex flex-col gap-4 overflow-y-auto overflow-x-hidden h-full py-4 z-10 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {images.map((image, index) => (
                            <div key={index} className="relative flex items-center group">
                                {/* Active Indicator Line */}
                                <div
                                    className={cn(
                                        "absolute left-0 w-[2px] h-full bg-primary transition-all duration-300 z-20",
                                        selectedImage === image ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 group-hover:opacity-50 group-hover:scale-y-100"
                                    )}
                                />

                                <button
                                    onClick={() => setSelectedImage(image)}
                                    aria-label={`View product image ${index + 1}`}
                                    className={cn(
                                        "relative ml-4 aspect-[3/4] w-full overflow-hidden rounded-sm bg-gray-100 transition-all duration-500 will-change-transform",
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
                                        sizes="(max-width: 1200px) 100px, 150px"
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

                {/* Main Image View */}
                <div className="relative flex-1 rounded-sm overflow-hidden bg-gray-100 group">
                    <Image
                        key={selectedImage}
                        src={selectedImage}
                        alt="Product main image"
                        fill
                        className="object-cover animate-in fade-in duration-500 ease-out"
                        sizes="(max-width: 1200px) 50vw, 40vw"
                        priority
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductGallery;
