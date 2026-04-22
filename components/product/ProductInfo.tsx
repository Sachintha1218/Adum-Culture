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

// Renders a string as a paragraph, or an array as bullet points
const BulletOrText = ({ value }: { value: string | string[] | undefined }) => {
    if (!value) return null;
    const items = Array.isArray(value) ? value : [value];
    if (items.length === 0) return null;
    if (items.length === 1) return <p>{items[0]}</p>;
    return (
        <ul className="list-disc list-inside space-y-1">
            {items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
    );
};

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

    // ─── Per-size stock helpers ─────────────────────────────────────────────
    /**
     * Returns the stock quantity for a given size.
     * Returns Infinity if sizeStocks not set (backwards-compatible — all sizes selectable).
     */
    const getSizeStock = (size: string): number => {
        if (!product.sizeStocks || product.sizeStocks.length === 0) return Infinity;
        const entry = product.sizeStocks.find((s) => s.size === size);
        return entry?.quantity ?? 0;
    };

    /** Total stock across all sizes (falls back to legacy stock field) */
    const totalStock: number =
        product.sizeStocks && product.sizeStocks.length > 0
            ? product.sizeStocks.reduce((sum, s) => sum + s.quantity, 0)
            : (product.stock ?? 0);

    const selectedSizeStock = selectedSize ? getSizeStock(selectedSize) : null;

    // ─── Quantity controls ──────────────────────────────────────────────────
    const handleQuantityChange = (type: "inc" | "dec") => {
        if (type === "dec" && quantity > 1) {
            setQuantity(quantity - 1);
        } else if (type === "inc") {
            const maxQty =
                selectedSizeStock !== null && selectedSizeStock !== Infinity
                    ? selectedSizeStock
                    : 999;
            if (quantity < maxQty) setQuantity(quantity + 1);
        }
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Please select a size");
            return;
        }
        if (getSizeStock(selectedSize) === 0) {
            alert("This size is out of stock");
            return;
        }
        setIsAdding(true);
        addToCart(product, quantity, getDisplaySize(selectedSize));
        setTimeout(() => setIsAdding(false), 500);
    };

    const handleBuyNow = () => {
        if (!selectedSize) {
            alert("Please select a size");
            return;
        }
        if (getSizeStock(selectedSize) === 0) {
            alert("This size is out of stock");
            return;
        }
        addToCart(product, quantity, getDisplaySize(selectedSize));
        router.push("/checkout");
    };

    const sizeMapping: Record<string, string> = {
        XXS: "UK04 - XXS",
        XS: "UK06 - XS",
        S: "UK08 - S",
        M: "UK10 - M",
        L: "UK12 - L",
        XL: "UK14 - XL",
        XXL: "UK16 - XXL",
    };

    const getDisplaySize = (size: string) => sizeMapping[size] || size;

    const discountPercentage =
        product.originalPrice && product.originalPrice > product.price
            ? Math.round(
                  ((product.originalPrice - product.price) / product.originalPrice) * 100
              )
            : 0;

    // Add-to-cart & buy-now are only enabled when a valid in-stock size is selected
    const canPurchase = selectedSize !== null && getSizeStock(selectedSize) > 0;

    return (
        <div className="flex flex-col gap-y-8 sticky top-24">
            {/* ─── Name & Price ─── */}
            <div>
                {product.itemCode && (
                    <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">
                        Item Code: {product.itemCode}
                    </p>
                )}
                <h1 className="font-serif text-4xl font-bold uppercase tracking-widest text-foreground md:text-5xl">
                    {product.name}
                </h1>

                <div className="mt-4 flex flex-col items-start gap-1">
                    {discountPercentage > 0 && (
                        <div className="mb-1 bg-[#B91C1C] px-2.5 py-1 text-sm font-bold text-white tracking-widest">
                            {discountPercentage}% OFF
                        </div>
                    )}
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        {product.originalPrice && (
                            <p className="text-2xl text-muted-foreground line-through decoration-gray-400 font-medium">
                                {formatCurrency(product.originalPrice)}
                            </p>
                        )}
                        <p className="text-4xl font-bold text-foreground">
                            {formatCurrency(product.price)}
                        </p>
                    </div>
                </div>

                {/* ─── Total Stock Badge ─── */}
                <div className="mt-3 flex items-center gap-2">
                    {totalStock > 0 ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-semibold text-green-700">
                            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            In Stock &mdash; {totalStock} available
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-semibold text-red-600">
                            <span className="h-2 w-2 rounded-full bg-red-500" />
                            Out of Stock
                        </span>
                    )}
                </div>
            </div>

            {/* ─── Size Selector ─── */}
            <div className="space-y-4">
                <div className="flex justify-between">
                    <h3 className="font-medium text-sm uppercase tracking-wide">Size</h3>
                    <button
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="text-xs text-muted-foreground underline uppercase tracking-widest hover:text-foreground transition-colors"
                    >
                        Size Guide
                    </button>
                </div>

                <div className="flex flex-wrap gap-3">
                    {(product.sizes ?? []).map((size) => {
                        const sizeQty = getSizeStock(size);
                        const isOutOfStock = sizeQty === 0;
                        const isSelected = selectedSize === size;

                        if (isOutOfStock) {
                            return (
                                <div key={size} className="relative group">
                                    {/* Not Available button */}
                                    <button
                                        disabled
                                        aria-label={`${getDisplaySize(size)} — Not available`}
                                        className={cn(
                                            "flex h-12 px-4 items-center justify-center rounded-full text-sm font-medium",
                                            "border border-dashed border-muted-foreground/30",
                                            "bg-muted/20 text-muted-foreground/40",
                                            "cursor-not-allowed select-none"
                                        )}
                                    >
                                        <span className="line-through decoration-muted-foreground/30">
                                            {getDisplaySize(size)}
                                        </span>
                                    </button>
                                    {/* Hover tooltip */}
                                    <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-[10px] text-background opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        Not Available
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <button
                                key={size}
                                onClick={() => {
                                    setSelectedSize(size);
                                    if (quantity > sizeQty) setQuantity(1);
                                }}
                                className={cn(
                                    "flex h-12 px-4 items-center justify-center rounded-full border text-sm font-medium transition-all",
                                    isSelected
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-input bg-background hover:border-foreground"
                                )}
                            >
                                {getDisplaySize(size)}
                            </button>
                        );
                    })}
                </div>

                {/* Low stock warning */}
                {selectedSize &&
                    selectedSizeStock !== null &&
                    selectedSizeStock !== Infinity &&
                    selectedSizeStock > 0 &&
                    selectedSizeStock <= 5 && (
                        <p className="text-xs text-amber-600 font-medium">
                            ⚠ Only {selectedSizeStock} left in this size — order soon!
                        </p>
                    )}
            </div>

            {/* ─── Quantity & Add to Cart ─── */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Qty stepper */}
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
                            disabled={
                                selectedSizeStock !== null &&
                                selectedSizeStock !== Infinity &&
                                quantity >= selectedSizeStock
                            }
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col sm:flex-row flex-1 gap-2">
                        <Button
                            className="w-full sm:flex-1 uppercase tracking-widest h-12 rounded-full text-xs sm:text-sm"
                            size="lg"
                            variant="outline"
                            onClick={handleAddToCart}
                            disabled={isAdding || !canPurchase}
                        >
                            {isAdding ? "Adding..." : "ADD TO SELECTION"}
                            {!isAdding && <ShoppingBag className="ml-2 h-4 w-4" />}
                        </Button>
                        <Button
                            className="w-full sm:flex-1 uppercase tracking-widest h-12 rounded-full text-xs sm:text-sm"
                            size="lg"
                            onClick={handleBuyNow}
                            disabled={!canPurchase}
                        >
                            Buy Now
                            <CreditCard className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {!selectedSize && (
                    <p className="text-xs text-muted-foreground text-center">
                        Please select a size to continue
                    </p>
                )}
                <p className="text-xs text-muted-foreground text-center">
                    Free standard shipping on orders over LKR 10,000
                </p>
            </div>

            <Separator />

            <Accordion type="single" collapsible className="w-full">
                {product.description &&
                    (Array.isArray(product.description)
                        ? product.description.length > 0
                        : true) && (
                        <AccordionItem value="description">
                            <AccordionTrigger className="uppercase tracking-widest text-sm">
                                Description
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                                <BulletOrText value={product.description} />
                                {product.modelDetails && (
                                    <p className="text-sm font-medium text-foreground mt-2">
                                        <strong>Model:</strong> {product.modelDetails}
                                    </p>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    )}

                {(product.material || product.careInstructions) && (
                    <AccordionItem value="fabric">
                        <AccordionTrigger className="uppercase tracking-widest text-sm">
                            Fabric & Care
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                            {product.material && (
                                <p>
                                    <strong>Material:</strong> {product.material}
                                </p>
                            )}
                            {product.careInstructions &&
                                (Array.isArray(product.careInstructions)
                                    ? product.careInstructions.length > 0
                                    : true) && (
                                    <div>
                                        <p className="font-medium text-foreground mb-1">
                                            Care Instructions
                                        </p>
                                        <BulletOrText value={product.careInstructions} />
                                    </div>
                                )}
                        </AccordionContent>
                    </AccordionItem>
                )}

                {product.styleGuide && product.styleGuide.length > 0 && (
                    <AccordionItem value="style">
                        <AccordionTrigger className="uppercase tracking-widest text-sm">
                            Style Guide
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            <BulletOrText value={product.styleGuide} />
                        </AccordionContent>
                    </AccordionItem>
                )}

                {product.shippingInfo && product.shippingInfo.length > 0 && (
                    <AccordionItem value="shipping">
                        <AccordionTrigger className="uppercase tracking-widest text-sm">
                            Shipping & Returns
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                            <BulletOrText value={product.shippingInfo} />
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>

            {/* ─── Instalment Payments ─── */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 mt-4">
                <p className="text-sm font-medium text-center uppercase tracking-wider mb-4">
                    Available Instalments
                </p>
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

            <SizeGuideModal
                isOpen={isSizeGuideOpen}
                onClose={() => setIsSizeGuideOpen(false)}
                sizeGuide={product.sizeGuide}
            />
        </div>
    );
};

export default ProductInfo;
