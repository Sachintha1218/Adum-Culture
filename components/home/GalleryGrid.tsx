"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

interface GalleryImage {
    src: string;
    alt: string;
    index: number;
}

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <div ref={ref} className="w-full max-w-4xl mx-auto px-12 relative">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent className="-ml-4">
                    {images.map((image, index) => (
                        <CarouselItem key={`slide-${index}`} className="pl-4 basis-full">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="relative overflow-hidden rounded-lg w-full aspect-[4/5] md:aspect-video"
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
                <CarouselPrevious className="-left-12 hidden md:flex" />
                <CarouselNext className="-right-12 hidden md:flex" />
            </Carousel>
        </div>
    );
}
