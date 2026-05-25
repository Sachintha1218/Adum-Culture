"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { formatCurrency } from "@/lib/utils";
import { resolveImageUrl, resolveSlug } from "@/lib/sanity-helpers";

export function CartSheet() {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        cartTotal,
        shippingCharge,
        discount,
        finalTotal,
        isCartOpen,
        closeCart,
    } = useCart();

    return (
        <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
            <SheetContent className="w-full sm:max-w-lg flex flex-col p-0 h-full">
                <SheetHeader className="px-4 py-4 sm:px-6 sm:py-5 border-b text-left">
                    <SheetTitle className="uppercase tracking-widest flex items-center gap-2 text-base">
                        <ShoppingBag className="h-5 w-5" />
                        ADUM SELECTION ({cartItems.length})
                    </SheetTitle>
                </SheetHeader>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 space-y-5 custom-scrollbar">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-lg font-medium">Nothing here… yet.</p>
                            <p className="text-muted-foreground text-sm max-w-[260px]">
                                Start your ADUM Selection with pieces designed for comfort and presence.
                            </p>
                            <Button
                                className="mt-4 uppercase tracking-widest"
                                onClick={closeCart}
                                asChild
                            >
                                <Link href="/shop">View Collection</Link>
                            </Button>
                        </div>
                    ) : (
                        cartItems.map((item) => {
                            const itemId = item._id ?? item.id ?? '';
                            const itemSlug = resolveSlug(item.slug);

                            const colorVariantImg = item.selectedColor && item.colorVariants
                                ? item.colorVariants.find(cv => cv.colorHex === item.selectedColor)?.images?.[0]
                                : undefined;
                            const imgSrc = colorVariantImg ?? resolveImageUrl(item.images[0], 200);

                            return (
                                <div key={`${itemId}-${item.selectedSize}-${item.selectedColor ?? ''}`} className="flex gap-3 sm:gap-4 border-b pb-5 last:border-0 last:pb-0">
                                    {/* Image */}
                                    <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-gray-100 rounded-lg">
                                        <Image
                                            src={imgSrc}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex flex-1 flex-col justify-between min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="min-w-0">
                                                <h3 className="font-medium text-sm leading-tight uppercase tracking-wide truncate">
                                                    <Link href={`/shop/${itemSlug}`} onClick={closeCart} className="hover:underline">
                                                        {item.name}
                                                    </Link>
                                                </h3>
                                                <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
                                                    <span>Size: {item.selectedSize}</span>
                                                    {item.selectedColor && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <span
                                                                className="inline-block w-3 h-3 rounded-full border border-gray-200 shrink-0"
                                                                style={{ backgroundColor: item.selectedColor }}
                                                            />
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="font-semibold text-sm shrink-0">{formatCurrency(item.price * item.quantity)}</p>
                                        </div>

                                        <div className="flex items-center justify-between mt-3">
                                            {/* Quantity stepper — larger touch targets */}
                                            <div className="flex items-center rounded-full border px-1 h-9">
                                                <button
                                                    onClick={() => updateQuantity(itemId, item.selectedSize, item.quantity - 1, item.selectedColor)}
                                                    disabled={item.quantity <= 1}
                                                    className="p-1.5 hover:text-primary disabled:opacity-40 touch-manipulation"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus className="h-3.5 w-3.5" />
                                                </button>
                                                <span className="mx-2 text-xs w-5 text-center font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(itemId, item.selectedSize, item.quantity + 1, item.selectedColor)}
                                                    className="p-1.5 hover:text-primary touch-manipulation"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(itemId, item.selectedSize, item.selectedColor)}
                                                className="text-xs text-muted-foreground underline hover:text-destructive py-1 px-1 touch-manipulation"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer Summary */}
                {cartItems.length > 0 && (
                    <div className="px-4 py-4 sm:px-6 sm:py-5 border-t bg-gray-50/50">
                        <div className="space-y-2.5 text-sm mb-5">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-medium">{formatCurrency(cartTotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className={shippingCharge === 0 ? "text-green-600 font-medium" : ""}>
                                    {shippingCharge === 0 ? "Free" : formatCurrency(shippingCharge)}
                                </span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-{formatCurrency(discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between border-t pt-2.5 font-bold text-base">
                                <span>Total</span>
                                <span>{formatCurrency(finalTotal)}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                                Taxes included. Discount info available at checkout.
                            </p>
                        </div>
                        <Button
                            className="w-full h-12 uppercase tracking-widest text-sm touch-manipulation"
                            onClick={closeCart}
                            asChild
                        >
                            <Link href="/checkout">Proceed to Checkout</Link>
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
