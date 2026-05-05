"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth, apiFetch } from "@/context/AuthContext";
import Container from "@/components/shared/Container";
import { resolveImageUrl } from "@/lib/sanity-helpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Loader2, Tag, X } from "lucide-react";
import { resolveSlug } from "@/lib/sanity-helpers";

export default function CheckoutPage() {
    const { cartItems, cartTotal, shippingCharge, finalTotal, discount, appliedCouponCode, applyDiscount, removeDiscount, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");
    const [couponInput, setCouponInput] = useState("");
    const [couponError, setCouponError] = useState("");
    const [couponSuccess, setCouponSuccess] = useState("");

    // Collect form field refs
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const addressRef = useRef<HTMLInputElement>(null);
    const address2Ref = useRef<HTMLInputElement>(null);
    const cityRef = useRef<HTMLInputElement>(null);
    const districtRef = useRef<HTMLInputElement>(null);
    const postalCodeRef = useRef<HTMLInputElement>(null);
    const noteRef = useRef<HTMLTextAreaElement>(null);

    if (cartItems.length === 0) {
        return (
            <Container className="flex flex-col items-center justify-center py-32 text-center">
                <h1 className="mb-4 text-2xl font-bold uppercase tracking-widest">Nothing here… yet.</h1>
                <Button asChild variant="link"><Link href="/shop">View Collection</Link></Button>
            </Container>
        );
    }

    const handleValidateCoupon = async () => {
        setCouponError(""); setCouponSuccess("");
        if (!couponInput.trim()) { setCouponError("Please enter a coupon code."); return; }

        try {
            const res = await apiFetch("/api/orders/validate-coupon", {
                method: "POST",
                body: JSON.stringify({ code: couponInput.trim(), subtotal: cartTotal }),
            });
            applyDiscount(res.data.code, res.data.discountAmount);
            setCouponSuccess(`${res.data.code} applied! You save ${formatCurrency(res.data.discountAmount)}.`);
            setCouponInput("");
        } catch {
            // Fallback: validate client-side against known codes
            const { coupons } = await import("@/data/coupons");
            const coupon = coupons.find((c) => c.code.toLowerCase() === couponInput.toLowerCase());
            if (!coupon) { setCouponError("Invalid coupon code."); return; }
            let amount = coupon.discountType === "percentage"
                ? Math.round((cartTotal * coupon.discountValue) / 100)
                : coupon.discountValue;
            if (amount > cartTotal) amount = cartTotal;
            applyDiscount(coupon.code, amount);
            setCouponSuccess(`${coupon.code} applied!`);
            setCouponInput("");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setError("");

        const firstName = firstNameRef.current?.value ?? "";
        const lastName = lastNameRef.current?.value ?? "";
        const customerName = `${firstName} ${lastName}`.trim();

        const payload = {
            customerName,
            customerPhone: phoneRef.current?.value ?? "",
            customerEmail: emailRef.current?.value || undefined,
            shippingAddress: addressRef.current?.value ?? "",
            addressLine2: address2Ref.current?.value || undefined,
            city: cityRef.current?.value ?? "",
            district: districtRef.current?.value ?? "",
            postalCode: postalCodeRef.current?.value || undefined,
            paymentMethod: "card" as const,
            couponCode: appliedCouponCode || undefined,
            customerNote: noteRef.current?.value || undefined,
            items: cartItems.map((item) => ({
                sku: item.itemCode ?? resolveSlug(item.slug),
                slug: resolveSlug(item.slug),
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                size: item.selectedSize,
            })),
        };

        try {
            const data = await apiFetch("/api/orders/create", { method: "POST", body: JSON.stringify(payload) });
            const { orderId, requiresPayment } = data.data;

            if (requiresPayment) {
                router.push(`/checkout/payment?orderId=${orderId}`);
            } else {
                clearCart();
                router.push(`/checkout/success?orderId=${orderId}`);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
            setIsProcessing(false);
        }
    };

    return (
        <Container className="py-12 md:py-20">
            <h1 className="mb-12 text-3xl font-bold uppercase tracking-widest md:text-4xl text-center">Checkout</h1>

            <div className="grid gap-12 lg:grid-cols-12">
                {/* Shipping Form */}
                <div className="lg:col-span-7">
                    <div className="rounded-lg border p-6 md:p-8">
                        <h2 className="mb-8 text-xl font-medium uppercase tracking-widest">Shipping Details</h2>
                        {error && (
                            <div className="mb-6 p-3 bg-destructive/10 text-destructive text-sm rounded-md">{error}</div>
                        )}
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" ref={firstNameRef} required placeholder="Jane" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" ref={lastNameRef} required placeholder="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" ref={emailRef} type="email" defaultValue={user?.email ?? ""} placeholder="jane@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone <span className="text-destructive">*</span></Label>
                                <Input id="phone" ref={phoneRef} type="tel" required placeholder="+94 7X XXX XXXX" defaultValue={user?.phone ?? ""} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
                                <Input id="address" ref={addressRef} required placeholder="123 Main St" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                                <Input id="address2" ref={address2Ref} placeholder="Apt, Suite, etc." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City <span className="text-destructive">*</span></Label>
                                    <Input id="city" ref={cityRef} required placeholder="Colombo" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="district">District <span className="text-destructive">*</span></Label>
                                    <Input id="district" ref={districtRef} required placeholder="Western" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="postalCode">Postal Code</Label>
                                <Input id="postalCode" ref={postalCodeRef} placeholder="00100" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="note">Order Note (Optional)</Label>
                                <textarea
                                    id="note"
                                    ref={noteRef}
                                    rows={3}
                                    placeholder="Any special instructions..."
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            </div>
                        </form>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-5">
                    <div className="sticky top-24 rounded-lg border bg-gray-50/50 p-6 md:p-8">
                        <h2 className="mb-6 text-lg font-medium uppercase tracking-widest">Your Order</h2>
                        <div className="mb-6 space-y-4 max-h-80 overflow-auto pr-2">
                            {cartItems.map((item) => (
                                <div key={`${item._id ?? item.id}-${item.selectedSize}`} className="flex gap-4">
                                    <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-gray-100 rounded">
                                        <Image src={resolveImageUrl(item.images[0], 200)} alt={item.name} fill className="object-cover" />
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
                                <span className={shippingCharge === 0 ? "text-green-600" : ""}>
                                    {shippingCharge === 0 ? "Free" : formatCurrency(shippingCharge)}
                                </span>
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

                        {/* Coupon */}
                        <div className="mt-6 pt-6 border-t">
                            <h3 className="mb-3 text-sm font-medium uppercase tracking-widest flex items-center gap-2">
                                <Tag className="w-4 h-4" /> Apply Discount Code
                            </h3>
                            {appliedCouponCode ? (
                                <div className="flex items-center justify-between p-3 bg-green-50 text-green-700 rounded-md border border-green-200">
                                    <span className="font-medium text-sm">Coupon <strong>{appliedCouponCode}</strong> applied!</span>
                                    <button type="button" onClick={() => { removeDiscount(); setCouponSuccess(""); setCouponError(""); }}>
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
                                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleValidateCoupon())}
                                        />
                                        <Button type="button" variant="outline" onClick={handleValidateCoupon}>Apply</Button>
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
                            {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> : "Proceed to Payment"}
                        </Button>

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
