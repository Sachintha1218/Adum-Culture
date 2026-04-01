"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Container from "@/components/shared/Container";

const galleryImages = [
    {
        src: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2669&auto=format&fit=crop",
        alt: "Elegant silk dress details",
        className: "col-span-1 md:col-span-2 row-span-2",
    },
    {
        src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2673&auto=format&fit=crop",
        alt: "Summer floral collection",
        className: "col-span-1 md:col-span-1 row-span-1",
    },
    {
        src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=2670&auto=format&fit=crop",
        alt: "Modern chic evening wear",
        className: "col-span-1 md:col-span-1 row-span-1",
    },
    {
        src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2670&auto=format&fit=crop",
        alt: "Minimalist fashion aesthetic",
        className: "col-span-1 md:col-span-1 row-span-2",
    },
    {
        src: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2683&auto=format&fit=crop",
        alt: "Luxury accessories close-up",
        className: "col-span-1 md:col-span-2 row-span-1",
    },
    {
        src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2787&auto=format&fit=crop",
        alt: "Urban street style fusion",
        className: "col-span-1 md:col-span-1 row-span-1",
    },
    {
        src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2670&auto=format&fit=crop",
        alt: "Elegant evening fashion",
        className: "col-span-1 md:col-span-1 row-span-1",
    },
];

const Gallery = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section className="py-16 md:py-24 overflow-hidden">
            <Container>
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold uppercase tracking-widest md:text-4xl">
                        The Aesthetic
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Curated looks for the modern woman.
                    </p>
                </div>

                <div
                    ref={ref}
                    className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[300px] md:grid-flow-dense"
                >
                    {galleryImages.map((image, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`relative overflow-hidden rounded-lg group ${image.className}`}
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
            </Container>
        </section>
    );
};

export default Gallery;
