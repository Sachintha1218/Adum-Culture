import type { Metadata, Viewport } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/shared/SiteShell";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

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
    default: "ADUM CULTURE | Premium Modern Clothing",
    template: "%s | Adum Culture",
  },
  description:
    "Modern luxury fashion for the contemporary woman. Shop premium clothing, dresses, tops, and accessories crafted for the bold and elegant.",
  keywords: [
    "fashion", "clothing", "Sri Lanka", "luxury fashion", "women clothing",
    "dresses", "tops", "accessories", "Adum Culture", "modern fashion",
  ],
  authors: [{ name: "Adum Culture", url: siteUrl }],
  creator: "Adum Culture",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Adum Culture",
    title: "ADUM CULTURE | Premium Modern Clothing",
    description:
      "Modern luxury fashion for the contemporary woman. Shop premium clothing, dresses, tops, and accessories.",
    images: [
      {
        url: "/logos/logo-full.png",
        width: 1200,
        height: 630,
        alt: "Adum Culture — Premium Modern Clothing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ADUM CULTURE | Premium Modern Clothing",
    description:
      "Modern luxury fashion for the contemporary woman. Shop premium clothing, dresses, tops, and accessories.",
    images: ["/logos/logo-full.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        montserrat.variable,
        poppins.variable
      )}>
        <AuthProvider>
          <CartProvider>
            <SiteShell>
              {children}
            </SiteShell>
          </CartProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
