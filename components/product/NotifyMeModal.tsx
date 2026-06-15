"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ColorVariant } from "@/types";

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3002";

interface NotifyMeModalProps {
    isOpen: boolean;
    onClose: () => void;
    productSlug: string;
    sizeOptions: string[];
    colorVariants?: ColorVariant[];
    initialSize?: string | null;
    initialColorHex?: string | null;
}

export function NotifyMeModal({
    isOpen,
    onClose,
    productSlug,
    sizeOptions,
    colorVariants,
    initialSize,
    initialColorHex,
}: NotifyMeModalProps) {
    const hasColors = !!colorVariants && colorVariants.length > 0;

    const [size, setSize] = useState(initialSize ?? sizeOptions[0] ?? "");
    const [colorHex, setColorHex] = useState(initialColorHex ?? colorVariants?.[0]?.colorHex ?? "");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

    useEffect(() => {
        if (!isOpen) return;
        setSize(initialSize ?? sizeOptions[0] ?? "");
        setColorHex(initialColorHex ?? colorVariants?.[0]?.colorHex ?? "");
        setName("");
        setEmail("");
        setStatus("idle");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const selectedColor = hasColors ? colorVariants!.find(cv => cv.colorHex === colorHex) : null;
    const canSubmit = !!size && name.trim().length > 0 && email.trim().length > 0;

    const handleSubmit = async () => {
        if (!canSubmit) return;
        setStatus("submitting");
        try {
            const res = await fetch(`${ADMIN_URL}/api/public/products/${productSlug}/notify-me`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    size,
                    colorHex: hasColors ? colorHex : undefined,
                    colorName: hasColors ? selectedColor?.colorName : undefined,
                    name: name.trim(),
                    email: email.trim(),
                }),
            });
            if (!res.ok) throw new Error("Request failed");
            setStatus("success");
        } catch {
            setStatus("error");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent className="w-[95vw] sm:max-w-md bg-white text-foreground border border-gray-200 rounded-xl p-6">
                <DialogHeader>
                    <DialogTitle className="uppercase tracking-widest text-base">
                        Email Me When Available
                    </DialogTitle>
                </DialogHeader>

                {status === "success" ? (
                    <div className="py-4 text-center space-y-3">
                        <p className="font-medium">Thanks! We&apos;ll be in touch.</p>
                        <p className="text-sm text-muted-foreground">
                            We&apos;ll email you as soon as this item is back in stock.
                        </p>
                        <Button
                            className="mt-2 w-full rounded-full uppercase tracking-widest h-12 text-xs sm:text-sm"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Size</Label>
                            <Select value={size} onValueChange={setSize}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a size" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sizeOptions.map(s => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {hasColors && (
                            <div className="space-y-2">
                                <Label>Color</Label>
                                <Select value={colorHex} onValueChange={setColorHex}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a color" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {colorVariants!.map(cv => (
                                            <SelectItem key={cv.colorHex} value={cv.colorHex}>
                                                <span className="flex items-center gap-2">
                                                    <span
                                                        className="h-3.5 w-3.5 rounded-full border border-gray-300 shrink-0"
                                                        style={{ backgroundColor: cv.colorHex }}
                                                    />
                                                    {cv.colorName ?? cv.colorHex}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="notify-name">Name</Label>
                            <Input
                                id="notify-name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Your name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notify-email">Email</Label>
                            <Input
                                id="notify-email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                            />
                        </div>

                        {status === "error" && (
                            <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
                        )}

                        <Button
                            className="w-full rounded-full uppercase tracking-widest h-12 text-xs sm:text-sm"
                            onClick={handleSubmit}
                            disabled={status === "submitting" || !canSubmit}
                        >
                            {status === "submitting" ? "Submitting..." : "Email Me When Available"}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
