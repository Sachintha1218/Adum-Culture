"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, Search, User, ChevronDown } from "lucide-react";

import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { CartSheet } from "@/components/shop/CartSheet";

const routes = [
    { href: "/", label: "Home" },
    {
        href: "/shop",
        label: "Shop",
        subItems: [
            { href: "/shop", label: "All Collection" },
            { href: "/shop?category=dresses", label: "Dresses" },
            { href: "/shop?category=tops", label: "Tops" },
            { href: "/shop?category=bottoms", label: "Bottoms" },
        ]
    },
    { href: "/about", label: "About" },
    {
        href: "/gift-vouchers",
        label: "Gift Vouchers",
        subItems: [
            { href: "/gift-vouchers", label: "All Vouchers" },
            { href: "/gift-vouchers/standard", label: "Standard Voucher" },
            { href: "/gift-vouchers/birthday", label: "Birthdays" },
            { href: "/gift-vouchers/anniversary", label: "Anniversaries" },
            { href: "/gift-vouchers/valentine", label: "Valentine's Day" },
            { href: "/gift-vouchers/new-year", label: "New Years" },
            { href: "/gift-vouchers/wedding", label: "Weddings" },
            { href: "/gift-vouchers/mother", label: "Mother's Day" },
            { href: "/gift-vouchers/womens-day", label: "Women's Day" },
            { href: "/gift-vouchers/friendship", label: "Friendship" },
            { href: "/gift-vouchers/for-her", label: "For Her" },
        ]
    },
    { href: "/contact", label: "Contact" },
];

const Navbar = () => {
    const pathname = usePathname();
    const { cartCount, openCart } = useCart();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isHome = pathname === "/";

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300",
                scrolled
                    ? "bg-background/80 backdrop-blur-md border-b"
                    : isHome
                        ? "bg-transparent border-transparent"
                        : "bg-background/80 backdrop-blur-md border-b"
            )}
        >
            <Container>
                <div className="flex h-16 items-center justify-between">

                    {/* Mobile Menu Removed */}

                    {/* Logo */}
                    <Link
                        href="/"
                        className={cn(
                            "text-base font-bold uppercase tracking-widest md:text-2xl transition-colors whitespace-nowrap",
                            isHome && !scrolled ? "text-white" : "text-foreground"
                        )}
                    >
                        Adum Culture
                    </Link>

                    {/* Desktop Navigation adapted for mobile */}
                    <nav className="flex gap-2 md:gap-8 overflow-x-auto no-scrollbar items-center">
                        {routes.map((route) => (
                            <div key={route.href} className="relative group flex items-center h-16 shrink-0">
                                <Link
                                    href={route.href}
                                    className={cn(
                                        "text-[10px] md:text-sm font-medium uppercase tracking-widest transition-colors hover:text-primary/80 flex items-center gap-0.5 md:gap-1 h-full px-1 md:px-0",
                                        isHome && !scrolled
                                            ? "text-white/90 hover:text-white"
                                            : pathname === route.href || (route.href !== '/' && pathname.startsWith(route.href))
                                                ? "text-primary"
                                                : "text-muted-foreground"
                                    )}
                                >
                                    {route.label}
                                    {route.subItems && <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />}
                                </Link>

                                {route.subItems && (
                                    <div className="absolute top-16 left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-in-out w-56 z-50">
                                        <div className="bg-background border rounded-md shadow-lg p-2 flex flex-col gap-1">
                                            {route.subItems.map(sub => (
                                                <Link
                                                    key={sub.label}
                                                    href={sub.href}
                                                    className="text-sm px-4 py-3 hover:bg-primary/10 hover:text-primary hover:translate-x-1 rounded-sm transition-all duration-300 text-foreground uppercase tracking-wider"
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-1 md:gap-2 shrink-0">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn("flex", isHome && !scrolled ? "text-white hover:text-white/80 hover:bg-white/10" : "")}
                                    aria-label="Search"
                                >
                                    <Search className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="top" className="h-[200px] flex flex-col justify-center">
                                <form
                                    className="max-w-2xl mx-auto w-full relative"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.currentTarget);
                                        const query = formData.get("search");
                                        if (query) {
                                            window.location.href = `/shop?search=${query}`;
                                        }
                                    }}
                                >
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                                    <input
                                        type="search"
                                        name="search"
                                        placeholder="Search for products..."
                                        className="w-full h-16 pl-14 pr-4 text-xl border-b-2 border-primary/20 bg-transparent focus:border-primary focus:outline-none transition-colors"
                                        autoFocus
                                    />
                                    <button type="submit" className="sr-only">Search</button>
                                </form>
                            </SheetContent>
                        </Sheet>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(isHome && !scrolled ? "text-white hover:text-white/80 hover:bg-white/10" : "")}
                            aria-label="Account"
                            asChild
                        >
                            <Link href="/account">
                                <User className="h-5 w-5" />
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(isHome && !scrolled ? "text-white hover:text-white/80 hover:bg-white/10" : "")}
                            aria-label="Selection"
                            onClick={openCart}
                        >
                            <div className="relative">
                                <ShoppingBag className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                                        {cartCount}
                                    </span>
                                )}
                                <span className="sr-only">Selection</span>
                            </div>
                        </Button>
                    </div>
                </div>
            </Container>
            <CartSheet />
        </header>
    );
};

export default Navbar;
