"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import WhatsAppWidget from "@/components/shared/WhatsAppWidget";
import { Category } from "@/types";

export default function SiteShell({ children, shopCategories, bannerText }: { children: React.ReactNode; shopCategories: Category[]; bannerText?: string }) {
    const pathname = usePathname();
    const isStudio = pathname?.startsWith("/studio");

    if (isStudio) {
        return <>{children}</>;
    }

    return (
        <>
            {bannerText && (
                <div className="bg-black text-white text-xs text-center py-2 px-4 tracking-widest uppercase font-medium">
                    {bannerText}
                </div>
            )}
            <Navbar shopCategories={shopCategories} />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppWidget />
        </>
    );
}
