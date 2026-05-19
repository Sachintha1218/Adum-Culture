import { Metadata } from "next";
import Container from "@/components/shared/Container";
import Image from "next/image";
import { getPageContent } from "@/lib/admin-api";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "About Us",
    description:
        "Beyond the fabrics. Discover the story behind Adum Culture — a Sri Lankan luxury fashion brand built from passion, sacrifice, and a vision to reach the world.",
};

const values = [
    {
        title: "Beyond the Fabrics",
        body: "We believe clothing is an extension of who you are. We empower our community to wear their unique identity with absolute pride, offering more than just garments — we offer a lifestyle and a platform for self-expression.",
    },
    {
        title: "Bold Craftsmanship",
        body: "Quality is our signature. We merge international street-style trends with premium materials, ensuring every piece is architecturally designed to look stunning and feel incredible to wear.",
    },
    {
        title: "Passion & Perseverance",
        body: "Built from the ground up by a young couple's hard-earned investments and tireless effort, we value the grind. Authenticity, resilience, and heart are woven into the very core of our brand.",
    },
    {
        title: "Global Vision",
        body: "We dream big. While our roots ground us, our designs are crafted to transcend borders, delivering a truly international standard of premium fashion to the world.",
    },
];

export default async function AboutPage() {
    let storyBody: string | null = null;
    let aboutImage: string | null = null;
    let aboutDescription: string | null = null;
    try {
        const [story, aboutUs] = await Promise.all([
            getPageContent('about_story'),
            getPageContent('about_us'),
        ]);
        if (story?.body) storyBody = story.body;
        if (aboutUs?.imageUrl) aboutImage = aboutUs.imageUrl;
        if (aboutUs?.body) aboutDescription = aboutUs.body;
    } catch { /* use hardcoded */ }

    return (
        <Container className="pt-24 pb-16 md:pt-32 md:pb-24">
            {/* Header */}
            <div className="mx-auto max-w-3xl text-center mb-16 md:mb-24">
                <h1 className="mb-4 text-4xl font-bold uppercase tracking-widest md:text-5xl">
                    About Adum Culture
                </h1>
                <p className="text-lg leading-relaxed text-muted-foreground md:text-xl font-light tracking-wide">
                    Beyond the fabrics.
                </p>
            </div>

            {/* Story Section */}
            <div className="grid gap-12 md:grid-cols-2 md:items-center mb-24">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-gray-100">
                    <Image
                        src={aboutImage ?? "https://images.unsplash.com/photo-1560343776-97e7d202ff0e?q=80&w=2000&auto=format&fit=crop"}
                        alt="Adum Culture Brand Image"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                </div>
                <div className="space-y-5">
                    <h2 className="text-2xl font-bold uppercase tracking-wide">Our Story</h2>
                    {storyBody ? (
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{storyBody}</p>
                    ) : (
                        <>
                            <p className="text-muted-foreground leading-relaxed">
                                ADUM CULTURE wasn&apos;t born in a corporate boardroom. It began as the shared dream of a young couple who believed deeply in the power of self-expression. Fuelled by late-night conversations and a relentless drive, we poured our life&apos;s experiences, countless hours of hard work, and our hard-earned savings into a singular vision.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                We didn&apos;t just want to start a clothing line — we wanted to build an international brand that speaks to the world. What started as a bold leap of faith has evolved into a movement of modern sophistication. Every stitch, every silhouette, and every design is a testament to the sacrifices and passion we&apos;ve invested into bringing this brand to life.
                            </p>
                            <p className="text-muted-foreground leading-relaxed font-medium">
                                From our humble beginnings to the global stage, ADUM CULTURE is for the bold, the elegant, and the unapologetic. This is more than fashion; it is our life&apos;s work, tailored for you.
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* Values Section */}
            <div>
                <h2 className="mb-12 text-center text-3xl font-bold uppercase tracking-widest md:text-4xl">
                    Our Values
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {values.map((value, index) => (
                        <div key={index} className="border p-6 rounded-lg space-y-3 hover:border-primary transition-colors">
                            <div className="text-xs font-bold uppercase tracking-widest text-primary">
                                0{index + 1}
                            </div>
                            <h3 className="font-bold uppercase tracking-wide text-sm">
                                {value.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {value.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    );
}
