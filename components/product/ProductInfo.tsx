"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Product } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { SizeGuideModal } from "./SizeGuideModal";

interface ProductInfoProps {
    product: Product;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
    const router = useRouter();
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const handleQuantityChange = (type: "inc" | "dec") => {
        if (type === "dec" && quantity > 1) {
            setQuantity(quantity - 1);
        } else if (type === "inc") {
            setQuantity(quantity + 1);
        }
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Please select a size"); // Replace with toast if available
            return;
        }

        setIsAdding(true);
        addToCart(product, quantity, getDisplaySize(selectedSize));

        setTimeout(() => {
            setIsAdding(false);
        }, 500);
    };

    const handleBuyNow = () => {
        if (!selectedSize) {
            alert("Please select a size"); // Replace with toast if available
            return;
        }
        addToCart(product, quantity, getDisplaySize(selectedSize));
        router.push("/cart"); // Given we have /cart but no /checkout right now. Wait, I should route to checkout if it exists. /checkout usually.
        // Let's use /checkout since we created Cart & Checkout previously.
        // Actually, some setups go to cart first. We will route to /checkout assuming it exists. If not, user has a Cart & Checkout implementation. Or we can just route to /cart. Let's use /cart to be safe, or /checkout. Reviewing past messages, user has checkout.
        // Let's route to /checkout.
        router.push("/checkout");
    };

    const sizeMapping: Record<string, string> = {
        "XXS": "UK04 - XXS",
        "XS": "UK06 - XS",
        "S": "UK08 - S",
        "M": "UK10 - M",
        "L": "UK12 - L",
        "XL": "UK14 - XL",
        "XXL": "UK16 - XXL"
    };

    const getDisplaySize = (size: string) => {
        return sizeMapping[size] || size;
    };

    return (
        <div className="flex flex-col gap-y-8 sticky top-24">
            <div>
                {product.itemCode && (
                    <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Item Code: {product.itemCode}</p>
                )}
                <h1 className="font-serif text-4xl font-bold uppercase tracking-widest text-foreground md:text-5xl">{product.name}</h1>
                <div className="mt-4 flex items-center gap-4">
                    <p className="text-2xl font-light text-primary">{formatCurrency(product.price)}</p>
                    {product.originalPrice && (
                        <p className="text-lg text-muted-foreground line-through">{formatCurrency(product.originalPrice)}</p>
                    )}
                </div>
                {product.stock !== undefined && (
                    <p className="mt-2 text-sm text-green-600 font-medium">
                        {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
                    </p>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex justify-between">
                    <h3 className="font-medium text-sm uppercase tracking-wide">Size</h3>
                    <button onClick={() => setIsSizeGuideOpen(true)} className="text-xs text-muted-foreground underline uppercase tracking-widest hover:text-foreground transition-colors">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={cn(
                                "flex h-12 px-4 items-center justify-center rounded-full border text-sm font-medium transition-all",
                                selectedSize === size
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-input bg-background hover:border-foreground"
                            )}
                        >
                            {getDisplaySize(size)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex justify-between sm:justify-center items-center rounded-full border px-2 shrink-0 h-12">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-full hover:bg-transparent"
                            onClick={() => handleQuantityChange("dec")}
                            disabled={quantity <= 1}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <div className="flex h-10 w-8 items-center justify-center text-sm font-medium">
                            {quantity}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-full hover:bg-transparent"
                            onClick={() => handleQuantityChange("inc")}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex flex-col sm:flex-row flex-1 gap-2">
                        <Button
                            className="flex-1 uppercase tracking-widest h-12 rounded-full text-xs sm:text-sm"
                            size="lg"
                            variant="outline"
                            onClick={handleAddToCart}
                            disabled={isAdding}
                        >
                            {isAdding ? "Adding..." : "ADD TO SELECTION"}
                            {!isAdding && <ShoppingBag className="ml-2 h-4 w-4" />}
                        </Button>
                        <Button
                            className="flex-1 uppercase tracking-widest h-12 rounded-full text-xs sm:text-sm"
                            size="lg"
                            onClick={handleBuyNow}
                        >
                            Buy Now
                            <CreditCard className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                    Free standard shipping on orders over LKR 10,000
                </p>
            </div>

            <Separator />

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="description">
                    <AccordionTrigger className="uppercase tracking-widest text-sm">Description</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed space-y-4">
                        <p>{product.description}</p>
                        {product.modelDetails && (
                            <p className="text-sm font-medium text-foreground">
                                <strong>Model Details:</strong> {product.modelDetails}
                            </p>
                        )}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="fabric">
                    <AccordionTrigger className="uppercase tracking-widest text-sm">Fabric & Care</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed space-y-4">
                        <p><strong>Material:</strong> {product.material || "Premium quality materials sourced responsibly."}</p>
                        <p><strong>Care Instructions:</strong> {product.careInstructions || "Dry clean only. Do not bleach. Iron on low heat."}</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="style">
                    <AccordionTrigger className="uppercase tracking-widest text-sm">Style Guide</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                        Pair this piece with minimalistic jewelry and classic footwear for an effortlessly chic look.
                        Its versatile design allows it to transition seamlessly from day to night.
                        Tonal accessories are highly recommended to elevate the overall aesthetic.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping">
                    <AccordionTrigger className="uppercase tracking-widest text-sm">Shipping & Returns</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                        Free standard shipping on all orders over LKR 10,000.<br />
                        Returns are accepted within 14 days of delivery for unworn items with tags attached.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Instalment Payments */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 mt-4">
                <p className="text-sm font-medium text-center uppercase tracking-wider mb-4">Available Instalments</p>
                <div className="flex gap-4 justify-center items-center flex-wrap">
                    <div className="flex flex-col items-center gap-1">
                        <div className="h-10 px-4 rounded-md border flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                            <span className="font-bold text-[#E82B61] text-lg leading-none">Koko</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">3 Instalments</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <div className="h-10 px-4 rounded-md border flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                            <span className="font-bold text-[#1E3A8A] text-lg leading-none">Intpay</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">Up to 6 Months</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                        <div className="h-10 px-4 rounded-md border flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
                            <span className="font-bold text-[#00A19D] text-lg leading-none">PayZy</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">Flexible Payments</span>
                    </div>
                </div>
            </div>

            <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
        </div>
    );
};

export default ProductInfo;
