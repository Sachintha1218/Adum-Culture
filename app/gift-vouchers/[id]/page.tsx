"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Gift, ShoppingBag } from "lucide-react";

import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCart } from "@/context/CartContext";
import { vouchers } from "@/lib/data/vouchers";
import { toast } from "sonner";

const amounts = [5000, 10000, 15000, 25000, 50000, 100000];

export default function VoucherBuyingPage({ params }: { params: { id: string } }) {
    const voucher = vouchers.find(v => v.id === params.id);
    const { addToCart } = useCart();

    // Form State
    const [selectedAmount, setSelectedAmount] = useState<number>(10000);
    const [recipientName, setRecipientName] = useState("");
    const [recipientEmail, setRecipientEmail] = useState("");
    const [senderName, setSenderName] = useState("");
    const [message, setMessage] = useState("");

    if (!voucher) {
        notFound();
    }

    const handleAddToCart = () => {
        if (!recipientName || !recipientEmail || !senderName) {
            toast.error("Please fill in all required recipient fields.");
            return;
        }

        const cartProduct = {
            id: `voucher-${voucher.id}`,
            name: `${voucher.title} Gift Voucher`,
            price: selectedAmount,
            image: voucher.image,
            category: "Gift Vouchers",
            description: "Digital Gift Voucher",
            images: [voucher.image],
            sizes: [{ size: "Digital", quantity: 999 }],
            colors: [],
            slug: `voucher-${voucher.id}`,
        };

        addToCart(cartProduct, 1, "Digital");

        // Reset form
        setRecipientName("");
        setRecipientEmail("");
        setSenderName("");
        setMessage("");
    };

    return (
        <main className="flex min-h-screen flex-col pt-24 pb-16">
            <Container>
                {/* Back Navigation */}
                <div className="mb-8">
                    <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary">
                        <Link href="/gift-vouchers" className="flex items-center gap-2 group">
                            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                            <span className="font-medium uppercase tracking-wider text-sm">Back to Vouchers</span>
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Left Column - Visuals */}
                    <div className="space-y-8 h-full lg:sticky lg:top-28">
                        {/* Image Preview */}
                        <div className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border ${voucher.color}`}>
                            <div className="absolute inset-0 bg-black/10 z-10" />
                            <Image
                                src={voucher.image}
                                alt={voucher.title}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            {/* Overlay Text inside Voucher */}
                            <div className={`absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-12 ${voucher.textColor}`}>
                                <div className="flex justify-between items-start">
                                    <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/20">
                                        <Gift className="w-4 h-4 md:w-5 md:h-5" />
                                    </div>
                                    <h2 className="text-xl md:text-3xl font-bold uppercase tracking-widest drop-shadow-lg font-serif">
                                        Adum Culture
                                    </h2>
                                </div>
                                <div>
                                    <h3 className="text-2xl md:text-5xl font-serif tracking-widest drop-shadow-xl font-bold mb-1 md:mb-2">
                                        {voucher.title}
                                    </h3>
                                    <p className="text-base md:text-2xl font-light opacity-90 drop-shadow-md">
                                        Value: Rs. {selectedAmount.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="bg-muted/50 p-8 rounded-2xl border">
                            <h4 className="font-serif text-xl tracking-wide mb-4 flex items-center gap-2">
                                <Check className="w-5 h-5 text-primary" />
                                Premium Gifting Experience
                            </h4>
                            <p className="text-muted-foreground leading-relaxed">
                                {voucher.description} This digital gift voucher will be emailed directly to the recipient with your personalized message. It can be redeemed online for any luxury item in our collection.
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="flex flex-col space-y-10">
                        {/* Header Info */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest font-serif mb-4">
                                {voucher.title}
                            </h1>
                            <p className="text-2xl text-primary font-light">
                                Rs. {selectedAmount.toLocaleString()}
                            </p>
                        </div>

                        <div className="h-px bg-border w-full" />

                        {/* Amount Selection */}
                        <div className="space-y-4">
                            <Label className="text-sm uppercase tracking-wider font-semibold text-muted-foreground">
                                Select Amount (LKR)
                            </Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {amounts.map((amount) => (
                                    <button
                                        key={amount}
                                        onClick={() => setSelectedAmount(amount)}
                                        className={`py-4 rounded-xl border-2 transition-all duration-300 font-medium tracking-wider text-sm md:text-base ${selectedAmount === amount
                                            ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                                            : "border-border hover:border-primary/50 hover:bg-muted"
                                            }`}
                                    >
                                        Rs. {amount.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Personalization Form */}
                        <div className="space-y-8 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
                            <div className="flex items-center gap-3 border-b pb-4">
                                <div className="bg-primary/10 p-2 rounded-full">
                                    <Gift className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="font-serif text-2xl tracking-wide">Personalize Your Gift</h3>
                            </div>

                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="recipientName">Recipient&apos;s Full Name *</Label>
                                    <Input
                                        id="recipientName"
                                        placeholder="Enter their name"
                                        value={recipientName}
                                        onChange={(e) => setRecipientName(e.target.value)}
                                        className="h-12 bg-background"
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="recipientEmail">Recipient&apos;s Email Address *</Label>
                                    <Input
                                        id="recipientEmail"
                                        type="email"
                                        placeholder="Where should we send it?"
                                        value={recipientEmail}
                                        onChange={(e) => setRecipientEmail(e.target.value)}
                                        className="h-12 bg-background"
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="senderName">Your Name *</Label>
                                    <Input
                                        id="senderName"
                                        placeholder="Who is this from?"
                                        value={senderName}
                                        onChange={(e) => setSenderName(e.target.value)}
                                        className="h-12 bg-background"
                                        required
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="message">Personal Message (Optional)</Label>
                                    <Textarea
                                        id="message"
                                        placeholder="Add a special note..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="min-h-[120px] bg-background resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Purchase Action */}
                        <div className="pt-4 sticky bottom-4 z-30">
                            <Button
                                size="lg"
                                className="w-full h-16 text-lg tracking-widest uppercase bg-primary hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-primary/20"
                                onClick={handleAddToCart}
                            >
                                <ShoppingBag className="w-5 h-5 mr-3" />
                                ADD TO SELECTION - Rs. {selectedAmount.toLocaleString()}
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </main>
    );
}
