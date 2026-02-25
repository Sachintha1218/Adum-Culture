import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import BestSellers from "@/components/home/BestSellers";
import Gallery from "@/components/home/Gallery";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
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
