"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import type { HeroSlide } from "@/app/page";

// Fallback landscape images used only when no Sanity hero slides are configured
const FALLBACK_SLIDES: HeroSlide[] = [
    {
        id: "fallback-1",
        alt: "Adum Culture Collection",
        desktopSrc: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1920&auto=format&fit=crop",
        mobileSrc: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=828&auto=format&fit=crop&ar=3:4",
    },
    {
        id: "fallback-2",
        alt: "Adum Culture Style",
        desktopSrc: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1920&auto=format&fit=crop",
        mobileSrc: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=828&auto=format&fit=crop&ar=3:4",
    },
    {
        id: "fallback-3",
        alt: "Adum Culture Fashion",
        desktopSrc: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1920&auto=format&fit=crop",
        mobileSrc: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=828&auto=format&fit=crop&ar=3:4",
    },
];

interface HeroProps {
    slides?: HeroSlide[];
}

const Hero = ({ slides = [] }: HeroProps) => {
    const activeSlides = slides.length > 0 ? slides : FALLBACK_SLIDES;
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (activeSlides.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [activeSlides.length]);

    const current = activeSlides[currentIndex];

    return (
        <section className="relative h-screen w-full overflow-hidden bg-gray-900">

            {/* Slideshow */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={current.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0"
                >
                    {/*
                     * Two background layers toggled by CSS — no JS needed.
                     * Mobile  (<768px): portrait image, bg positioned top-center
                     * Desktop (≥768px): landscape image, bg positioned center
                     */}

                    {/* Mobile image — hidden on md+ */}
                    <div
                        className="absolute inset-0 block md:hidden bg-cover bg-top"
                        style={{ backgroundImage: `url("${current.mobileSrc}")` }}
                        role="img"
                        aria-label={current.alt}
                    />

                    {/* Desktop image — hidden on <md */}
                    <div
                        className="absolute inset-0 hidden md:block bg-cover bg-center"
                        style={{ backgroundImage: `url("${current.desktopSrc}")` }}
                        role="img"
                        aria-label={current.alt}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Vignette overlay — lighter on mobile to keep portrait design readable */}
            <div className="absolute inset-0 bg-black/30 md:bg-black/40" />

            {/* Text content */}
            <Container className="relative flex h-full flex-col justify-end pb-16 items-center text-center text-white z-10 px-4 md:justify-center md:pb-0">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-4 text-sm font-light tracking-[0.2em] uppercase text-gray-200 md:mb-6 md:text-base"
                >
                    Beyond the Fabrics
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="font-serif text-5xl font-bold uppercase tracking-[0.3em] leading-tight sm:text-6xl md:text-8xl lg:text-9xl"
                >
                    Adum Culture
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-8 md:mt-12"
                >
                    <Button
                        size="lg"
                        className="group relative h-12 md:h-14 overflow-hidden rounded-none border border-white bg-transparent px-8 md:px-10 text-sm md:text-base uppercase tracking-widest text-white transition-all hover:text-black hover:border-white"
                        asChild
                    >
                        <Link href="/shop">
                            <span className="relative z-10">Shop Collection</span>
                            <div className="absolute inset-0 -translate-x-full bg-white transition-transform duration-500 group-hover:translate-x-0" />
                        </Link>
                    </Button>
                </motion.div>

                {/* Slide indicator dots */}
                {activeSlides.length > 1 && (
                    <div className="mt-8 flex gap-2">
                        {activeSlides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    i === currentIndex ? "w-8 bg-white" : "w-2 bg-white/40"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </Container>
        </section>
    );
};

export default Hero;
