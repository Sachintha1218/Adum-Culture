import type { Metadata, Viewport } from "next";
import { Montserrat, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import SiteShell from "@/components/shared/SiteShell";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { getAllCollections, getPageContent } from "@/lib/admin-api";
import { Category } from "@/types";

const GA_MEASUREMENT_ID = "G-FRY2ZJBZKD";

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

export const revalidate = 60;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let shopCategories: Category[] = [];
  let bannerText = '';
  try {
    const [fetched, banner] = await Promise.all([
      getAllCollections(),
      getPageContent('homepage_banner'),
    ]);
    if (fetched?.length > 0) shopCategories = fetched;
    if (banner?.body) bannerText = banner.body;
  } catch {
    // fallbacks already set
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
            <SiteShell shopCategories={shopCategories} bannerText={bannerText}>
              {children}
            </SiteShell>
          </CartProvider>
        </AuthProvider>
        <Toaster />

        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "x3vswikpme");
          `}
        </Script>
      </body>
    </html>
  );
}
