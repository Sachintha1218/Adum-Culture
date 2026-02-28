"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { giftVouchers, GiftVoucher } from "@/data/giftVouchersList";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Loader2, Gift, CreditCard, Wallet, Smartphone, X } from "lucide-react";
import Link from "next/link";

type PaymentMethod = "credit_card" | "koko" | "intpay" | "payzy" | null;

export default function PaymentPage() {
    const { cartItems, finalTotal, clearCart, appliedCouponCode } = useCart();
    const { user, recordUsedCoupon } = useAuth();
    const router = useRouter();

    const [isProcessing, setIsProcessing] = useState(false);

    // Gift Voucher State
    const [voucherInput, setVoucherInput] = useState("");
    const [appliedVoucher, setAppliedVoucher] = useState<GiftVoucher | null>(null);
    const [voucherError, setVoucherError] = useState("");
    const [voucherSuccess, setVoucherSuccess] = useState("");

    // Payment Method State
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);

    // If no items, redirect back
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

    const remainingBalance = Math.max(0, finalTotal - (appliedVoucher ? appliedVoucher.balance : 0));

    const handleApplyVoucher = () => {
        setVoucherError("");
        setVoucherSuccess("");

        if (!voucherInput.trim()) {
            setVoucherError("Please enter a voucher code.");
            return;
        }

        const voucher = giftVouchers.find((v) => v.code.toLowerCase() === voucherInput.toLowerCase());

        if (!voucher) {
            setVoucherError("Invalid gift voucher code.");
            return;
        }

        if (voucher.balance <= 0) {
            setVoucherError("This gift voucher has a 0 balance.");
            return;
        }

        setAppliedVoucher(voucher);
        setVoucherSuccess(`Voucher ${voucher.code} applied! Covered: ${formatCurrency(Math.min(finalTotal, voucher.balance))}`);
        setVoucherInput("");
        // If the voucher covers everything, we don"t need a payment method
        if (finalTotal - voucher.balance <= 0) {
            setPaymentMethod(null);
        }
    };

    const handleRemoveVoucher = () => {
        setAppliedVoucher(null);
        setVoucherSuccess("");
        setVoucherError("");
    };

    const handlePayment = async () => {
        if (remainingBalance > 0 && !paymentMethod) {
            alert("Please select a payment method for the remaining balance.");
            return;
        }

        setIsProcessing(true);

        // Simulate API call to process payment
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Note: In a real app, you"d update the gift voucher balance here in the backend

        if (appliedCouponCode && user) {
            recordUsedCoupon(appliedCouponCode);
        }

        clearCart();
        router.push("/checkout/success");
    };

    return (
        <Container className="pt-24 pb-12 md:pt-28 md:py-20">
            <h1 className="mb-12 text-3xl font-bold uppercase tracking-widest md:text-4xl text-center">Payment</h1>

            <div className="grid gap-12 lg:grid-cols-12 max-w-5xl mx-auto">
                <div className="lg:col-span-7 space-y-8">

                    {/* Gift Voucher Section */}
                    <div className="rounded-lg border p-6 md:p-8">
                        <h2 className="mb-6 text-xl font-medium uppercase tracking-widest flex items-center gap-2">
                            <Gift className="w-5 h-5" /> Gift Voucher
                        </h2>

                        {appliedVoucher ? (
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border">
                                <div>
                                    <p className="font-medium flex items-center gap-2">
                                        Voucher <span className="font-bold">{appliedVoucher.code}</span>
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Available Balance: {formatCurrency(appliedVoucher.balance)}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemoveVoucher}
                                    className="text-gray-500 hover:text-black transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <Label htmlFor="voucher">Enter Gift Voucher Code</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="voucher"
                                        placeholder="E.g., GIFT5000"
                                        value={voucherInput}
                                        onChange={(e) => setVoucherInput(e.target.value)}
                                        className="uppercase"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleApplyVoucher}
                                    >
                                        Apply
                                    </Button>
                                </div>
                                {voucherError && <p className="text-xs text-red-500">{voucherError}</p>}
                                {voucherSuccess && <p className="text-xs text-green-600">{voucherSuccess}</p>}
                            </div>
                        )}
                    </div>

                    {/* Payment Methods */}
                    {remainingBalance > 0 && (
                        <div className="rounded-lg border p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="mb-6 text-xl font-medium uppercase tracking-widest">Payment Method</h2>
                            <p className="text-sm text-muted-foreground mb-6">
                                Balance to pay: <span className="font-bold text-black">{formatCurrency(remainingBalance)}</span>
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setPaymentMethod("credit_card")}
                                    className={`flex items-center gap-3 p-4 border rounded-lg transition-all ${paymentMethod === "credit_card" ? "border-black bg-gray-50 ring-1 ring-black" : "hover:border-gray-400"
                                        }`}
                                >
                                    <CreditCard className="w-6 h-6" />
                                    <span className="font-medium">Credit/Debit Card</span>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod("koko")}
                                    className={`flex items-center gap-3 p-4 border rounded-lg transition-all ${paymentMethod === "koko" ? "border-black bg-gray-50 ring-1 ring-black" : "hover:border-gray-400"
                                        }`}
                                >
                                    <Wallet className="w-6 h-6 text-[#ff6b6b]" />
                                    <span className="font-medium">Koko Payment</span>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod("intpay")}
                                    className={`flex items-center gap-3 p-4 border rounded-lg transition-all ${paymentMethod === "intpay" ? "border-black bg-gray-50 ring-1 ring-black" : "hover:border-gray-400"
                                        }`}
                                >
                                    <Smartphone className="w-6 h-6 text-blue-600" />
                                    <span className="font-medium">Intpay</span>
                                </button>

                                <button
                                    onClick={() => setPaymentMethod("payzy")}
                                    className={`flex items-center gap-3 p-4 border rounded-lg transition-all ${paymentMethod === "payzy" ? "border-black bg-gray-50 ring-1 ring-black" : "hover:border-gray-400"
                                        }`}
                                >
                                    <Smartphone className="w-6 h-6 text-purple-600" />
                                    <span className="font-medium">PayZy</span>
                                </button>
                            </div>

                            {paymentMethod === "credit_card" && (
                                <div className="mt-8 space-y-4 pt-6 border-t animate-in fade-in">
                                    <div className="space-y-2">
                                        <Label htmlFor="cardNumber">Card Number</Label>
                                        <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="expiry">Expiry Date</Label>
                                            <Input id="expiry" placeholder="MM/YY" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="cvv">CVV</Label>
                                            <Input id="cvv" placeholder="123" type="password" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nameOnCard">Name on Card</Label>
                                        <Input id="nameOnCard" placeholder="Jane Doe" />
                                    </div>
                                </div>
                            )}

                            {paymentMethod && paymentMethod !== "credit_card" && (
                                <div className="mt-8 pt-6 border-t text-sm text-center text-muted-foreground animate-in fade-in">
                                    You will be redirected to the secure portal to complete your payment.
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Summary */}
                <div className="lg:col-span-5">
                    <div className="sticky top-24 rounded-lg border bg-gray-50/50 p-6 md:p-8">
                        <h2 className="mb-6 text-lg font-medium uppercase tracking-widest">Summary</h2>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Order Total</span>
                                <span>{formatCurrency(finalTotal)}</span>
                            </div>

                            {appliedVoucher && (
                                <div className="flex justify-between text-green-600">
                                    <span>Voucher ({appliedVoucher.code})</span>
                                    <span>-{formatCurrency(Math.min(finalTotal, appliedVoucher.balance))}</span>
                                </div>
                            )}

                            <Separator className="my-4" />

                            <div className="flex justify-between font-bold text-xl">
                                <span>To Pay</span>
                                <span>{formatCurrency(remainingBalance)}</span>
                            </div>
                        </div>

                        <Button
                            onClick={handlePayment}
                            className="w-full mt-8 uppercase tracking-widest h-14 text-base"
                            disabled={isProcessing || (remainingBalance > 0 && !paymentMethod)}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Confirm Payment"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </Container>
    );
}
