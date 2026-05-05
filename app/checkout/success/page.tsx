"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { apiFetch, type Order } from "@/context/AuthContext";
import { formatCurrency } from "@/lib/utils";

export default function OrderSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(!!orderId);

    useEffect(() => {
        if (!orderId) return;
        apiFetch(`/api/account/orders/${orderId}`)
            .then((res) => setOrder(res.data.order))
            .catch(() => {/* guest order — silently skip */})
            .finally(() => setLoading(false));
    }, [orderId]);

    const ref = order?.ormOrderNumber ?? order?.id ?? orderId ?? "";

    return (
        <Container className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-6 rounded-full bg-green-100 p-6 text-green-600">
                <CheckCircle2 className="h-16 w-16" />
            </div>
            <h1 className="mb-4 text-3xl font-bold uppercase tracking-widest">Order Confirmed!</h1>
            <p className="mb-2 max-w-md text-muted-foreground">
                Thank you for your purchase. We have received your order and will begin processing it shortly.
            </p>

            {loading && <Loader2 className="mt-4 h-5 w-5 animate-spin text-muted-foreground" />}

            {ref && !loading && (
                <p className="mt-4 text-sm font-medium">
                    Your order reference: <span className="font-bold tracking-wider">{ref}</span>
                </p>
            )}

            {order && !loading && (
                <div className="mt-8 w-full max-w-md rounded-lg border bg-gray-50/50 p-6 text-left space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment</span>
                        <span className={order.paymentStatus === "paid" ? "text-green-600 font-medium" : "capitalize"}>
                            {order.paymentStatus === "paid" ? "Paid" : order.paymentStatus}
                        </span>
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
                Quote <strong>{ref}</strong> when contacting support. A confirmation email has been sent to you.
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
