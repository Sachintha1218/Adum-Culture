import Container from "@/components/shared/Container";
import Image from "next/image";

export default function AboutPage() {
    return (
        <Container className="py-12 md:py-20">
            <div className="mx-auto max-w-4xl text-center">
                <h1 className="mb-6 text-4xl font-bold uppercase tracking-widest md:text-5xl">About Adum Culture</h1>
                <p className="text-lg leading-relaxed text-muted-foreground md:text-xl">
                    Where modern aesthetics meet timeless elegance.
                </p>
            </div>

            <div className="mt-16 grid gap-12 md:grid-cols-2 md:items-center">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-gray-100">
                    <Image
                        src="https://images.unsplash.com/photo-1560343776-97e7d202ff0e?q=80&w=2000&auto=format&fit=crop"
                        alt="Adum Culture Brand Image"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold uppercase tracking-wide">Our Story</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Founded with a vision to revolutionize the fashion landscape in Sri Lanka, Adum Culture started as a small passion project and has grown into a symbol of modern sophistication. We believe that what you wear is an extension of who you are.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        Our collections are curated for the bold, the elegant, and the unique. We merge international street style trends with premium quality fabrics to create pieces that not only look stunning but feel incredible to wear.
                    </p>
                    <h2 className="text-2xl font-bold uppercase tracking-wide pt-4">Our Values</h2>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Quality over quantity</li>
                        <li>Sustainable practices</li>
                        <li>Empowering individuality</li>
                        <li>Customer-centric design</li>
                    </ul>
                </div>
            </div>
        </Container>
    );
}
