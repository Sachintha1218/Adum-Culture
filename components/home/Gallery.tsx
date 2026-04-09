import Container from "@/components/shared/Container";
import GalleryGrid from "@/components/home/GalleryGrid";
import { freshClient } from "@/sanity/lib/client";
import { GALLERY_IMAGES_QUERY, ALL_PRODUCTS_QUERY } from "@/sanity/lib/queries";
import { resolveImageUrl } from "@/lib/sanity-helpers";

const Gallery = async () => {
    let galleryImages: { src: string; alt: string; index: number }[] = [];

    try {
        // Try best-seller images first
        const bestSellers = await freshClient.fetch(GALLERY_IMAGES_QUERY);
        if (bestSellers?.length > 0) {
            galleryImages = bestSellers
                .flatMap((product: { name: string; slug: string; images: unknown[] }) =>
                    (product.images ?? []).slice(0, 1).map((img: unknown) => ({
                        src: resolveImageUrl(img as Parameters<typeof resolveImageUrl>[0], 800),
                        alt: product.name,
                    }))
                )
                .slice(0, 7)
                .map((img: { src: string; alt: string }, i: number) => ({ ...img, index: i }));
        }

        // Fall back to any products if no best sellers
        if (galleryImages.length === 0) {
            const allProducts = await freshClient.fetch(ALL_PRODUCTS_QUERY);
            if (allProducts?.length > 0) {
                galleryImages = allProducts
                    .flatMap((product: { name: string; slug: string; images: unknown[] }) =>
                        (product.images ?? []).slice(0, 1).map((img: unknown) => ({
                            src: resolveImageUrl(img as Parameters<typeof resolveImageUrl>[0], 800),
                            alt: product.name,
                        }))
                    )
                    .slice(0, 7)
                    .map((img: { src: string; alt: string }, i: number) => ({ ...img, index: i }));
            }
        }
    } catch {
        // fall through
    }

    // Don't render the section if Sanity has no products
    if (galleryImages.length === 0) return null;

    return (
        <section className="py-16 md:py-24 overflow-hidden">
            <Container>
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold uppercase tracking-widest md:text-4xl">
                        The Aesthetic
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Beyond the fabrics — curated looks for the bold and elegant.
                    </p>
                </div>
                <GalleryGrid images={galleryImages} />
            </Container>
        </section>
    );
};

export default Gallery;
