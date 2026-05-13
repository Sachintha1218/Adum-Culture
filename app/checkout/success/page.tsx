"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { apiFetch, type Order } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/utils";

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <Container className="flex items-center justify-center py-40">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            </Container>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const [order, setOrder] = useState<Order | null>(null);
    const [verifying, setVerifying] = useState(true);
    const [paymentConfirmed, setPaymentConfirmed] = useState<boolean | null>(null);
    const { clearCart } = useCart();

    useEffect(() => {
        if (!orderId) {
            setVerifying(false);
            setPaymentConfirmed(false);
            return;
        }

        // Verify payment status first — only show success if actually paid
        apiFetch("/api/payment/verify", { method: "POST", body: JSON.stringify({ orderId }) })
            .then((res) => {
                const paid = res.data?.paymentStatus === "paid";
                setPaymentConfirmed(paid);
                if (paid) {
                    clearCart(); // only clear cart on confirmed payment
                }
            })
            .catch(() => setPaymentConfirmed(false))
            .finally(() => {
                setVerifying(false);
                // Load order details regardless (for display)
                apiFetch(`/api/account/orders/${orderId}`)
                    .then((res) => setOrder(res.data.order))
                    .catch(() => {});
            });
    }, [orderId, clearCart]);

    if (verifying) {
        return (
            <Container className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Verifying your payment...</p>
            </Container>
        );
    }

    // Payment failed or cancelled
    if (!paymentConfirmed) {
        return (
            <Container className="flex flex-col items-center justify-center py-32 text-center">
                <div className="mb-6 rounded-full bg-red-100 p-6 text-red-600">
                    <XCircle className="h-16 w-16" />
                </div>
                <h1 className="mb-4 text-3xl font-bold uppercase tracking-widest">Payment Unsuccessful</h1>
                <p className="mb-8 max-w-md text-muted-foreground">
                    Your payment could not be completed. Your cart has been kept — you can try again.
                </p>
                <div className="flex gap-4 flex-wrap justify-center">
                    <Button asChild className="uppercase tracking-widest">
                        <Link href="/checkout">Try Again</Link>
                    </Button>
                    <Button asChild variant="outline" className="uppercase tracking-widest">
                        <Link href="/shop">Continue Shopping</Link>
                    </Button>
                </div>
            </Container>
        );
    }

    // Payment confirmed — only show ORM order number if available, never the DB id
    const ref = order?.ormOrderNumber ?? null;

    return (
        <Container className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-6 rounded-full bg-green-100 p-6 text-green-600">
                <CheckCircle2 className="h-16 w-16" />
            </div>
            <h1 className="mb-4 text-3xl font-bold uppercase tracking-widest">Order Confirmed!</h1>
            <p className="mb-2 max-w-md text-muted-foreground">
                Thank you for your purchase. We have received your order and will begin processing it shortly.
            </p>

            {ref && (
                <p className="mt-4 text-sm font-medium">
                    Your order reference: <span className="font-bold tracking-wider">{ref}</span>
                </p>
            )}

            {order && (
                <div className="mt-8 w-full max-w-md rounded-lg border bg-gray-50/50 p-6 text-left space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment</span>
                        <span className="text-green-600 font-medium">Paid</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping to</span>
                        <span className="text-right">{order.city}, {order.district}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base pt-2 border-t">
                        <span>Total</span>
                        <span>{formatCurrency(order.total)}</span>
                    </div>
                </div>
            )}

            <p className="mt-6 text-xs text-muted-foreground max-w-sm">
                A confirmation email has been sent to you.
            </p>

            <div className="mt-8 flex gap-4 flex-wrap justify-center">
                <Button asChild className="uppercase tracking-widest">
                    <Link href="/shop">Continue Shopping</Link>
                </Button>
                {order && (
                    <Button asChild variant="outline" className="uppercase tracking-widest">
                        <Link href="/account">View Orders</Link>
                    </Button>
                )}
            </div>
        </Container>
    );
}
