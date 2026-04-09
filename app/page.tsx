import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import BestSellers from "@/components/home/BestSellers";
import Gallery from "@/components/home/Gallery";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { freshClient } from "@/sanity/lib/client";
import { HERO_SLIDES_QUERY } from "@/sanity/lib/queries";
import { resolveImageUrl } from "@/lib/sanity-helpers";
import { SanityImage } from "@/types";

// Always fetch fresh data from Sanity — no stale cache
export const revalidate = 0;

interface SanityHeroSlide {
  _id: string;
  order: number;
  alt: string;
  desktopImage: SanityImage;
  mobileImage: SanityImage;
}

export interface HeroSlide {
  id: string;
  alt: string;
  desktopSrc: string;
  mobileSrc: string;
}

export default async function Home() {
  let heroSlides: HeroSlide[] = [];

  try {
    const raw: SanityHeroSlide[] = await freshClient.fetch(HERO_SLIDES_QUERY);
    if (raw?.length > 0) {
      heroSlides = raw.map((slide) => ({
        id: slide._id,
        alt: slide.alt,
        // Desktop: wide crop, 1920px wide
        desktopSrc: resolveImageUrl(slide.desktopImage, 1920),
        // Mobile: portrait crop, 828px wide (iPhone retina)
        mobileSrc: resolveImageUrl(slide.mobileImage, 828),
      }));
    }
  } catch {
    // fallback handled inside Hero component
  }

  return (
    <div className="flex flex-col">
      <Hero slides={heroSlides} />
      <FeaturedCategories />
      <BestSellers />
      <Gallery />

      {/* Brand Story Section */}
      <section className="py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold uppercase tracking-widest md:text-4xl">
              Our Story
            </h2>
            <p className="mb-8 text-lg font-light leading-relaxed text-muted-foreground">
              Adum Culture was born from a desire to bridge the gap between streetwear ease and high-fashion elegance.
              We believe in clothing that empowers, endures, and expresses your unique identity.
              Each piece is crafted with meticulous attention to detail, using premium fabrics that feel as good as they look.
            </p>
            <Button variant="outline" size="lg" className="uppercase tracking-widest" asChild>
              <Link href="/about">Read More</Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
