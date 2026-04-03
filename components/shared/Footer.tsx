import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";

import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// TikTok icon (not in lucide-react)
const TikTokIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
    </svg>
);

const Footer = () => {
    return (
        <footer className="bg-background border-t">
            <Container className="py-12 md:py-16">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
                    {/* Brand */}
                    <div className="sm:col-span-2 md:col-span-1">
                        <Link href="/" className="inline-block">
                            <Image src="/logos/logo-full.png" alt="Adum Culture" width={200} height={100} className="w-auto h-16 object-contain" />
                        </Link>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Beyond the fabrics. Premium Sri Lankan fashion for the bold, the elegant, and the unapologetic.
                        </p>
                        <div className="mt-6 flex space-x-4">
                            <Link href="https://www.instagram.com/adum_culture/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="https://web.facebook.com/profile.php?id=61587991092811" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="https://www.tiktok.com/@adum.culture" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                <TikTokIcon />
                                <span className="sr-only">TikTok</span>
                            </Link>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider">Shop</h3>
                        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
                            <li><Link href="/shop?category=new-arrivals" className="hover:text-primary transition-colors">New Arrivals</Link></li>
                            <li><Link href="/shop?category=best-sellers" className="hover:text-primary transition-colors">Best Sellers</Link></li>
                            <li><Link href="/shop?category=dresses" className="hover:text-primary transition-colors">Dresses</Link></li>
                            <li><Link href="/gift-vouchers" className="hover:text-primary transition-colors">Gift Vouchers</Link></li>
                        </ul>
                    </div>

                    {/* Help & Policies */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider">Help</h3>
                        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/policies/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
                            <li><Link href="/policies/exchange-refund" className="hover:text-primary transition-colors">Exchange &amp; Refund</Link></li>
                            <li><Link href="/policies/international-shipping" className="hover:text-primary transition-colors">International Shipping</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider">Newsletter</h3>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Subscribe to receive updates, access to exclusive deals, and more.
                        </p>
                        <form className="mt-4 flex flex-col gap-2">
                            <Input type="email" placeholder="Enter your email" className="bg-background" />
                            <Button type="submit" className="w-full">Subscribe</Button>
                        </form>
                        <div className="mt-6 space-y-1 text-xs text-muted-foreground">
                            <p>📧 info@adumculture.com</p>
                            <p>📞 +94 76 061 3070</p>
                            <p>📍 Kiribathgoda, Sri Lanka 11600</p>
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                {/* Payment Badges */}
                <div className="mb-6 flex flex-wrap items-center gap-3">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">We Accept:</span>
                    <Image src="/images/payment/visa.svg" alt="Visa" width={48} height={30} className="h-7 w-auto opacity-70" />
                    <Image src="/images/payment/mastercard.svg" alt="Mastercard" width={48} height={30} className="h-7 w-auto opacity-70" />
                    <Image src="/images/payment/koko.svg" alt="Koko" width={48} height={30} className="h-7 w-auto opacity-70" />
                </div>

                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} Adum Culture. All rights reserved.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                        <Link href="/policies/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="/policies/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
                        <Link href="/policies/exchange-refund" className="hover:text-primary transition-colors">Exchange &amp; Refund</Link>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
