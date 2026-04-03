"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

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

    return (
        <div
            ref={ref}
            className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[300px] md:grid-flow-dense"
        >
            {images.map((image, index) => (
                <motion.div
                    key={index}
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
    );
}
