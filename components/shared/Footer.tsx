import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
    return (
        <footer className="bg-background border-t">
            <Container className="py-12 md:py-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="md:col-span-1">
                        <Link href="/" className="text-xl font-bold uppercase tracking-widest">
                            ADUM CULTURE
                        </Link>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Premium modern clothing for the contemporary individual. Redefining luxury with every stitch.
                        </p>
                        <div className="mt-6 flex space-x-4">
                            <Link href="https://instagram.com/adumculture" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="https://facebook.com/adumculture" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                            <Link href="https://twitter.com/adumculture" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider">Shop</h3>
                        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                            <li>
                                <Link href="/shop" className="hover:text-primary">
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop?category=new-arrivals" className="hover:text-primary">
                                    New Arrivals
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop?category=best-sellers" className="hover:text-primary">
                                    Best Sellers
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop?category=dresses" className="hover:text-primary">
                                    Dresses
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider">Help</h3>
                        <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                            <li>
                                <Link href="/contact" className="hover:text-primary">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-primary">
                                    Shipping Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-primary">
                                    Returns & Exchanges
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-primary">
                                    Size Guide
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider">Newsletter</h3>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Subscribe to receive updates, access to exclusive deals, and more.
                        </p>
                        <form className="mt-4 flex flex-col gap-2 sm:flex-row">
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-background"
                            />
                            <Button type="submit">Subscribe</Button>
                        </form>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} Adum Culture. All rights reserved.
                    </p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                        <Link href="/contact" className="hover:text-primary">Privacy Policy</Link>
                        <Link href="/contact" className="hover:text-primary">Terms of Service</Link>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
