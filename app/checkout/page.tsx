"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { coupons } from "@/data/coupons";
import Container from "@/components/shared/Container";
import { resolveImageUrl } from "@/lib/sanity-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Loader2, Tag, X } from "lucide-react";

export default function CheckoutPage() {
    const { cartItems, cartTotal, finalTotal, discount, appliedCouponCode, applyDiscount, removeDiscount } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [couponInput, setCouponInput] = useState("");
    const [couponError, setCouponError] = useState("");
    const [couponSuccess, setCouponSuccess] = useState("");

    if (cartItems.length === 0) {
        return (
            <Container className="flex flex-col items-center justify-center py-32 text-center">
                <h1 className="mb-4 text-2xl font-bold uppercase tracking-widest">Nothing here… yet.</h1>
                <Button asChild variant="link">
                    <Link href="/shop">View Collection</Link>
                </Button>
            </Container>
        );
    }

    const handleApplyCoupon = () => {
        setCouponError("");
        setCouponSuccess("");

        if (!couponInput.trim()) {
            setCouponError("Please enter a coupon code.");
            return;
        }

        const coupon = coupons.find((c) => c.code.toLowerCase() === couponInput.toLowerCase());

        if (!coupon) {
            setCouponError("Invalid coupon code.");
            return;
        }

        if (user?.usedCoupons?.includes(coupon.code)) {
            setCouponError("You have already used this coupon.");
            return;
        }

        let discountAmount = 0;
        if (coupon.discountType === "percentage") {
            discountAmount = (cartTotal * coupon.discountValue) / 100;
        } else if (coupon.discountType === "fixed") {
            discountAmount = coupon.discountValue;
        }

        // Prevent discount from exceeding cart total
        if (discountAmount > cartTotal) {
            discountAmount = cartTotal;
        }

        applyDiscount(coupon.code, discountAmount);
        setCouponSuccess(`${coupon.code} applied successfully!`);
        setCouponInput("");
    };

    const handleRemoveCoupon = () => {
        removeDiscount();
        setCouponSuccess("");
        setCouponError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate processing / checking stock etc before payment page
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Push user to payment page
        router.push("/checkout/payment");
    };

    return (
        <Container className="py-12 md:py-20">
            <h1 className="mb-12 text-3xl font-bold uppercase tracking-widest md:text-4xl text-center">Checkout</h1>

            <div className="grid gap-12 lg:grid-cols-12">

                {/* Shipping Form */}
                <div className="lg:col-span-7">
                    <div className="rounded-lg border p-6 md:p-8">
                        <h2 className="mb-8 text-xl font-medium uppercase tracking-widest">Shipping Details</h2>
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" required placeholder="Jane" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" required placeholder="Doe" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" required placeholder="jane@example.com" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" type="tel" required placeholder="+94 7X XXX XXXX" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" required placeholder="123 Main St" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" required placeholder="Colombo" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="postalCode">Postal Code</Label>
                                    <Input id="postalCode" required placeholder="00100" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-5">
                    <div className="sticky top-24 rounded-lg border bg-gray-50/50 p-6 md:p-8">
                        <h2 className="mb-6 text-lg font-medium uppercase tracking-widest">Your Order</h2>

                        <div className="mb-6 space-y-4 max-h-80 overflow-auto custom-scrollbar pr-2">
                            {cartItems.map((item) => (
                                <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                                    <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-gray-100 rounded">
                                        <Image
                                            src={resolveImageUrl(item.images[0], 200)}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-1 justify-between">
                                        <div>
                                            <p className="text-sm font-medium">{item.name}</p>
                                            <p className="text-xs text-muted-foreground mt-1">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Separator className="my-6" />

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatCurrency(cartTotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>

                            {discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount ({appliedCouponCode})</span>
                                    <span>-{formatCurrency(discount)}</span>
                                </div>
                            )}

                            <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>{formatCurrency(finalTotal)}</span>
                            </div>
                        </div>

                        {/* Coupon Section */}
                        <div className="mt-6 pt-6 border-t">
                            <h3 className="mb-3 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                                <Tag className="w-4 h-4" /> Apply Discount Code
                            </h3>

                            {appliedCouponCode ? (
                                <div className="flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
                                    <span className="font-medium text-sm flex items-center gap-2">
                                        Coupon <span className="font-bold">{appliedCouponCode}</span> applied!
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleRemoveCoupon}
                                        className="text-green-700 hover:text-green-900 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Enter coupon code"
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value)}
                                            className="uppercase"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleApplyCoupon}
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                    {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                                    {couponSuccess && <p className="text-xs text-green-600">{couponSuccess}</p>}
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            form="checkout-form"
                            className="w-full mt-8 uppercase tracking-widest h-14 text-base"
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Proceed to Payment"
                            )}
                        </Button>

                        {/* Payment method badges */}
                        <div className="mt-4 flex items-center justify-center gap-3">
                            <span className="text-xs text-muted-foreground">We accept:</span>
                            <Image src="/images/payment/visa.svg" alt="Visa" width={40} height={26} className="h-6 w-auto opacity-80" />
                            <Image src="/images/payment/mastercard.svg" alt="Mastercard" width={40} height={26} className="h-6 w-auto opacity-80" />
                            <Image src="/images/payment/koko.svg" alt="Koko" width={40} height={26} className="h-6 w-auto opacity-80" />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
