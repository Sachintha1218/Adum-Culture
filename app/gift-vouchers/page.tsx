import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gift, ChevronDown } from "lucide-react";

import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

import { vouchers } from "@/lib/data/vouchers";

export const metadata = {
    title: "Gift Vouchers - Adum Culture",
    description: "Give the gift of premium style. Choose from our distinct collection of Adum Culture gift vouchers for every special occasion.",
};

export default function GiftVouchersPage() {
    return (
        <main className="flex min-h-screen flex-col pt-24 pb-16">
            <Container>
                {/* Header Section */}
                <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-3xl mx-auto mb-20 animate-fade-in min-h-[50vh]">
                    <div className="bg-primary/10 p-4 rounded-full mb-2">
                        <Gift className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest font-serif">
                        Gift Vouchers
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Give the gift of choice. Whether it&apos;s to celebrate a milestone or just because, an Adum Culture Gift Voucher lets them select their perfect piece of premium elegance.
                    </p>

                    <a
                        href="#vouchers"
                        className="mt-12 animate-bounce p-4 rounded-full hover:bg-muted transition-colors inline-block"
                        aria-label="Scroll down to vouchers"
                    >
                        <ChevronDown className="w-8 h-8 text-muted-foreground" />
                    </a>
                </div>

                {/* Vouchers Grid */}
                <div id="vouchers" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12 scroll-mt-24">
                    {vouchers.map((voucher, index) => (
                        <div
                            key={voucher.id}
                            className={`group relative overflow-hidden rounded-xl border flex flex-col md:flex-row h-full transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 ${voucher.color}`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Image Section */}
                            <div className="relative w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
                                <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors duration-500" />
                                <Image
                                    src={voucher.image}
                                    alt={voucher.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>

                            {/* Content Section */}
                            <div className={`flex flex-col justify-between p-6 sm:p-8 md:w-3/5 z-20 ${voucher.textColor}`}>
                                <div className="space-y-4">
                                    <h3 className="text-xl sm:text-2xl font-semibold font-serif tracking-wide">
                                        {voucher.title}
                                    </h3>
                                    <p className="text-sm opacity-90 leading-relaxed font-light">
                                        {voucher.description}
                                    </p>
                                </div>

                                <div className="mt-6 sm:mt-8">
                                    <Button
                                        asChild
                                        variant="outline"
                                        className={`w-full sm:w-auto bg-transparent border-current hover:bg-white hover:text-black transition-all duration-300 font-medium tracking-wider group/btn`}
                                    >
                                        <Link href={`/gift-vouchers/${voucher.id}`}>
                                            Select Amount
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                        </Link>
                                    </Button>
                                    <div className="mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2 opacity-60 text-[10px] sm:text-xs font-mono uppercase tracking-widest leading-tight">
                                        <span>Digital Delivery</span>
                                        <span className="w-1 h-1 rounded-full bg-current hidden sm:inline-block" />
                                        <span className="sm:hidden block w-full"></span>
                                        <span>No Expiry</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </main>
    );
}
