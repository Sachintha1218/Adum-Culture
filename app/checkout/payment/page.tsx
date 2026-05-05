"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { apiFetch } from "@/context/AuthContext";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

declare global {
    interface Window {
        onePayData?: Record<string, unknown>;
    }
}

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <Container className="flex items-center justify-center py-40">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            </Container>
        }>
            <PaymentContent />
        </Suspense>
    );
}

function PaymentContent() {
    const { finalTotal, clearCart } = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [paymentData, setPaymentData] = useState<Record<string, unknown> | null>(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);

    // Fetch OnePay initiation data from backend
    useEffect(() => {
        if (!orderId) { setError("No order ID found. Please restart checkout."); setIsLoading(false); return; }

        apiFetch("/api/payment/initiate", { method: "POST", body: JSON.stringify({ orderId }) })
            .then((res) => {
                window.onePayData = res.data;   // set BEFORE script loads
                setPaymentData(res.data);
            })
            .catch((err) => setError(err.message ?? "Failed to load payment. Please try again."))
            .finally(() => setIsLoading(false));
    }, [orderId]);

    // Inject OnePay script dynamically after data is set — guarantees SDK reads window.onePayData on init
    useEffect(() => {
        if (!paymentData) return;

        const existing = document.getElementById("onepay-script");
        if (existing) return; // already injected

        const script = document.createElement("script");
        script.id = "onepay-script";
        script.src = "https://storage.googleapis.com/onepayjs/onepayv2.js";
        script.async = true;
        script.onload = () => setScriptLoaded(true);
        document.body.appendChild(script);

        return () => {
            const s = document.getElementById("onepay-script");
            if (s) s.remove();
        };
    }, [paymentData]);

    const handlePaySuccess = useCallback(
        async (e: Event) => {
            const detail = (e as CustomEvent).detail ?? {};
            const transactionId = detail.transaction_id ?? detail.transactionId ?? "";
            try {
                await apiFetch("/api/payment/verify", {
                    method: "POST",
                    body: JSON.stringify({ transactionId, orderId }),
                });
            } catch {/* callback already handles it */}
            clearCart();
            router.push(`/checkout/success?orderId=${orderId}`);
        },
        [orderId, router, clearCart]
    );

    const handlePayFail = useCallback(() => {
        setError("Payment was unsuccessful. Please try again or choose a different payment method.");
    }, []);

    useEffect(() => {
        window.addEventListener("onePaySuccess", handlePaySuccess as EventListener);
        window.addEventListener("onePayFail", handlePayFail);
        return () => {
            window.removeEventListener("onePaySuccess", handlePaySuccess as EventListener);
            window.removeEventListener("onePayFail", handlePayFail);
        };
    }, [handlePaySuccess, handlePayFail]);

    if (isLoading) {
        return (
            <Container className="flex items-center justify-center py-40">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            </Container>
        );
    }

    if (error && !paymentData) {
        return (
            <Container className="flex flex-col items-center justify-center py-32 text-center gap-6">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <p className="text-lg font-medium max-w-md">{error}</p>
                <Button asChild variant="outline"><Link href="/checkout">Back to Checkout</Link></Button>
            </Container>
        );
    }

    return (
        <Container className="pt-24 pb-12 md:pt-28 md:py-20">
            <h1 className="mb-12 text-3xl font-bold uppercase tracking-widest md:text-4xl text-center">Payment</h1>

            <div className="max-w-lg mx-auto">
                <div className="rounded-lg border p-6 md:p-8 space-y-8">
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between font-bold text-xl">
                            <span>Amount to Pay</span>
                            <span>{formatCurrency((paymentData?.amount as number) ?? finalTotal)}</span>
                        </div>
                        <Separator />
                    </div>

                    {error && (
                        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                        </div>
                    )}

                    {/* OnePay mounts its button here */}
                    <div id="onepay-btn" className="min-h-[60px] flex items-center justify-center" />
                    <div id="iframe-container" />

                    {!scriptLoaded && (
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" /> Loading secure payment...
                        </div>
                    )}

                    <p className="text-xs text-center text-muted-foreground">
                        Payments are processed securely via OnePay. Your card details are never stored.
                    </p>

                    {error && (
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/checkout">Back to Checkout</Link>
                        </Button>
                    )}
                </div>
            </div>
        </Container>
    );
}
