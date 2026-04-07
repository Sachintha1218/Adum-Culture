"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import WhatsAppWidget from "@/components/shared/WhatsAppWidget";
import { Category } from "@/types";

export default function SiteShell({ children, shopCategories }: { children: React.ReactNode; shopCategories: Category[] }) {
    const pathname = usePathname();
    const isStudio = pathname?.startsWith("/studio");

    if (isStudio) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar shopCategories={shopCategories} />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppWidget />
        </>
    );
}
