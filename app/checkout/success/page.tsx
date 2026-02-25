"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

export default function OrderSuccessPage() {
    return (
        <Container className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-6 rounded-full bg-green-100 p-6 text-green-600">
                <CheckCircle2 className="h-16 w-16" />
            </div>
            <h1 className="mb-4 text-3xl font-bold uppercase tracking-widest">Order Confirmed!</h1>
            <p className="mb-8 max-w-md text-muted-foreground">
                Thank you for your purchase. We have received your order and will send you a confirmation email shortly.
            </p>
            <div className="flex gap-4">
                <Button asChild className="uppercase tracking-widest">
                    <Link href="/shop">View Collection</Link>
                </Button>
            </div>
        </Container>
    );
}
