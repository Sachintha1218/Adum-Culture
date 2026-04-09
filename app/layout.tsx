import type { Metadata, Viewport } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/shared/SiteShell";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { freshClient } from "@/sanity/lib/client";
import { ALL_CATEGORIES_QUERY } from "@/sanity/lib/queries";
import { Category } from "@/types";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" });
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-heading" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://adumculture.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Adum Culture | Beyond the Fabrics",
    template: "%s — Adum Culture",
  },
  description:
    "Adum Culture — Sri Lankan luxury fashion brand. Discover bold, premium clothing that celebrates individuality. Shop online at adumculture.com.",
  keywords: [
    "Adum Culture", "fashion", "clothing", "Sri Lanka", "luxury fashion",
    "women clothing", "dresses", "tops", "accessories", "beyond the fabrics",
  ],
  authors: [{ name: "Adum Culture", url: siteUrl }],
  creator: "Adum Culture",
  icons: {
    icon: [
      { url: "/favicon/Favicon_01.svg", type: "image/svg+xml" },
      { url: "/favicon/Favicon_01.png", type: "image/png" },
    ],
    apple: "/favicon/Favicon_01.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://adumculture.com",
    siteName: "Adum Culture",
    title: "Adum Culture | Beyond the Fabrics",
    description:
      "Discover bold, premium fashion from Adum Culture — Sri Lanka's luxury streetwear brand. Shop the latest collections online.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Adum Culture — Beyond the Fabrics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adum Culture | Beyond the Fabrics",
    description:
      "Bold, premium Sri Lankan fashion. Shop online at adumculture.com.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let shopCategories: Category[] = [];
  try {
    const fetched = await freshClient.fetch(ALL_CATEGORIES_QUERY);
    if (fetched?.length > 0) shopCategories = fetched;
  } catch {
    // fallback already set
  }

  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        montserrat.variable,
        poppins.variable
      )}>
        <AuthProvider>
          <CartProvider>
            <SiteShell shopCategories={shopCategories}>
              {children}
            </SiteShell>
          </CartProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
