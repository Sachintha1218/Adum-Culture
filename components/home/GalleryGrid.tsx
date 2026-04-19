"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";

const gridClasses = [
    "col-span-1 md:col-span-2 row-span-2",
    "col-span-1 md:col-span-1 row-span-1",
    "col-span-1 md:col-span-1 row-span-1",
    "col-span-1 md:col-span-1 row-span-2",
    "col-span-1 md:col-span-2 row-span-1",
    "col-span-1 md:col-span-1 row-span-1",
    "col-span-1 md:col-span-1 row-span-1",
];

interface GalleryImage {
    src: string;
    alt: string;
    index: number;
}

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) return;
        
        setCurrent(api.selectedScrollSnap() + 1);
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    return (
        <div ref={ref} className="w-full">
            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[300px] md:grid-flow-dense">
                {images.map((image, index) => (
                    <motion.div
                        key={`desktop-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className={`relative overflow-hidden rounded-lg group ${gridClasses[index] ?? "col-span-1 row-span-1"}`}
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/20" />
                    </motion.div>
                ))}
            </div>

            {/* Mobile Carousel */}
            <div className="block md:hidden">
                <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="w-full">
                    <CarouselContent className="-ml-4">
                        {images.map((image, index) => (
                            <CarouselItem key={`mobile-${index}`} className="pl-4 basis-[90%] sm:basis-[85%]">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="relative overflow-hidden rounded-lg w-full h-[450px]"
                                >
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        fill
                                        sizes="100vw"
                                        className="object-cover"
                                    />
                                </motion.div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                {/* Dots Pagination */}
                <div className="flex justify-center gap-1.5 mt-5">
                    {images.map((_, index) => (
                        <div
                            key={`dot-${index}`}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                current === index + 1 ? "w-6 bg-primary" : "w-1.5 bg-primary/30"
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
