"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

const heroImages = [
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2683&auto=format&fit=crop",
];

const Hero = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative h-screen w-full overflow-hidden bg-gray-900">
            {/* Cinematic Slideshow */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1.0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url("${heroImages[currentImageIndex]}")` }}
                />
            </AnimatePresence>

            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <Container className="relative flex h-full flex-col justify-center items-center text-center text-white z-10 px-4">

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-6 text-sm font-light tracking-[0.2em] uppercase text-gray-200 md:text-base"
                >
                    {/* TODO: Hero background images — recommended 1920×1080px (desktop), 768×1024px (mobile). Replace heroImages array with brand photography when assets are ready. */}
                    Beyond the Fabrics
                </motion.p>

                {/* Main Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="font-serif text-5xl font-bold uppercase tracking-[0.3em] leading-tight sm:text-6xl md:text-8xl lg:text-9xl"
                >
                    Adum Culture
                </motion.h1>

                {/* Interactive Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-12"
                >
                    <Button
                        size="lg"
                        className="group relative h-14 overflow-hidden rounded-none border border-white bg-transparent px-10 text-base uppercase tracking-widest text-white transition-all hover:text-black hover:border-white"
                        asChild
                    >
                        <Link href="/shop">
                            <span className="relative z-10 flex items-center gap-2">
                                Shop Collection
                            </span>
                            <div className="absolute inset-0 -translate-x-full bg-white transition-transform duration-500 group-hover:translate-x-0" />
                        </Link>
                    </Button>
                </motion.div>
            </Container>
        </section>
    );
};

export default Hero;
