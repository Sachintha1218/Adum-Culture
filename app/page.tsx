import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import BestSellers from "@/components/home/BestSellers";
import Gallery from "@/components/home/Gallery";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getHeroSlides, getPageContent } from "@/lib/admin-api";

export const revalidate = 60;

export interface HeroSlide {
  id: string;
  alt: string;
  desktopSrc: string;
  mobileSrc: string;
}

const STORY_FALLBACK = "Adum Culture was born from a desire to bridge the gap between streetwear ease and high-fashion elegance. We believe in clothing that empowers, endures, and expresses your unique identity. Each piece is crafted with meticulous attention to detail, using premium fabrics that feel as good as they look."

export default async function Home() {
  let heroSlides: HeroSlide[] = [];
  let storyBody = STORY_FALLBACK;
  let heroTagline: { title?: string; body?: string } | null = null;

  try {
    const [raw, story, hero] = await Promise.all([
      getHeroSlides(),
      getPageContent('about_story'),
      getPageContent('homepage_hero'),
    ]);
    if (raw?.length > 0) {
      heroSlides = raw.map((slide: { _id: string; alt: string; desktopImage: string; mobileImage: string }) => ({
        id: slide._id,
        alt: slide.alt,
        desktopSrc: slide.desktopImage,
        mobileSrc: slide.mobileImage,
      }));
    }
    if (story?.body) storyBody = story.body;
    if (hero?.title || hero?.body) heroTagline = hero;
  } catch {
    // fallbacks set above
  }

  return (
    <div className="flex flex-col">
      <Hero slides={heroSlides} />
      {heroTagline && (
        <div className="border-b border-gray-100 py-4 text-center bg-white">
          <Container>
            {heroTagline.title && <p className="text-xs font-bold uppercase tracking-widest text-foreground">{heroTagline.title}</p>}
            {heroTagline.body && <p className="text-xs text-muted-foreground mt-1">{heroTagline.body}</p>}
          </Container>
        </div>
      )}
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
            <p className="mb-8 text-lg font-light leading-relaxed text-muted-foreground whitespace-pre-line">
              {storyBody}
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
