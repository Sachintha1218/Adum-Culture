import Container from "@/components/shared/Container";
import GalleryGrid from "@/components/home/GalleryGrid";
import { getGalleryImages, getAllProducts } from "@/lib/admin-api";

const Gallery = async () => {
    let galleryImages: { src: string; alt: string; index: number }[] = [];

    try {
        let products = await getGalleryImages(7);
        if (!products?.length) products = (await getAllProducts()).slice(0, 7);

        if (products?.length > 0) {
            galleryImages = products
                .flatMap((product: { name: string; images: string[] }) =>
                    (product.images ?? []).slice(0, 1).map((img: string) => ({
                        src: img,
                        alt: product.name,
                    }))
                )
                .slice(0, 7)
                .map((img: { src: string; alt: string }, i: number) => ({ ...img, index: i }));
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
