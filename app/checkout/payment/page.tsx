"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/context/AuthContext";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

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
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId) {
            setError("No order ID found. Please restart checkout.");
            setLoading(false);
            return;
        }

        // Call backend which calls OnePay server-to-server and returns redirect URL
        apiFetch("/api/payment/initiate", {
            method: "POST",
            body: JSON.stringify({ orderId }),
        })
            .then((res) => {
                if (res.data?.redirectUrl) {
                    // Redirect to OnePay hosted payment page
                    window.location.href = res.data.redirectUrl;
                } else {
                    setError("No payment URL received. Please try again.");
                    setLoading(false);
                }
            })
            .catch((err) => {
                setError(err.message ?? "Failed to initiate payment. Please try again.");
                setLoading(false);
            });
    }, [orderId]);

    if (loading) {
        return (
            <Container className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Connecting to payment gateway...</p>
            </Container>
        );
    }

    return (
        <Container className="flex flex-col items-center justify-center py-32 text-center gap-6">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <p className="text-lg font-medium max-w-md">{error}</p>
            <Button asChild variant="outline">
                <Link href="/checkout">Back to Checkout</Link>
            </Button>
        </Container>
    );
}
