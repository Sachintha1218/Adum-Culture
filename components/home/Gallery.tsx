import Container from "@/components/shared/Container";
import GalleryGrid from "@/components/home/GalleryGrid";
import { client } from "@/sanity/lib/client";
import { GALLERY_IMAGES_QUERY } from "@/sanity/lib/queries";
import { resolveImageUrl, resolveSlug } from "@/lib/sanity-helpers";

// Static fallback images used when no best-seller products exist in Sanity
const fallbackImages = [
    { src: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2669&auto=format&fit=crop", alt: "Elegant silk dress details" },
    { src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2673&auto=format&fit=crop", alt: "Summer floral collection" },
    { src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=2670&auto=format&fit=crop", alt: "Modern chic evening wear" },
    { src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2670&auto=format&fit=crop", alt: "Minimalist fashion aesthetic" },
    { src: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=2683&auto=format&fit=crop", alt: "Luxury accessories close-up" },
    { src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2787&auto=format&fit=crop", alt: "Urban street style fusion" },
    { src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2670&auto=format&fit=crop", alt: "Elegant evening fashion" },
];

const Gallery = async () => {
    let galleryImages = fallbackImages.map((img, i) => ({ ...img, index: i }));

    try {
        const sanityProducts = await client.fetch(GALLERY_IMAGES_QUERY);
        if (sanityProducts?.length > 0) {
            const sanityImages = sanityProducts
                .flatMap((product: { name: string; slug: string; images: unknown[] }) =>
                    (product.images ?? []).slice(0, 1).map((img: unknown) => ({
                        src: resolveImageUrl(img as Parameters<typeof resolveImageUrl>[0], 800),
                        alt: product.name,
                        index: 0,
                    }))
                )
                .slice(0, 7)
                .map((img: { src: string; alt: string }, i: number) => ({ ...img, index: i }));

            if (sanityImages.length > 0) {
                galleryImages = sanityImages;
            }
        }
    } catch {
        // fall through to fallback
    }

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
