import { Metadata } from "next";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Facebook, Instagram } from "lucide-react";
import Link from "next/link";
import { getPageContent } from "@/lib/admin-api";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with the Adum Culture team. Reach us via email, WhatsApp, or our contact form.",
};

const DEFAULTS = {
    description: "Have a question about an order, a product, or just want to say hi? Reach out to our team.",
    address: "Adum Culture,\nKiribathgoda, Sri Lanka 11600",
    email: "info@adumculture.com",
    phone: "+94 76 061 3070",
    whatsappUrl: "https://wa.me/94760613070",
    instagramUrl: "https://www.instagram.com/adum_culture/",
    instagramLabel: "Instagram",
    facebookUrl: "https://web.facebook.com/profile.php?id=61587991092811",
    facebookLabel: "Facebook",
}

export default async function ContactPage() {
    let c = DEFAULTS
    try {
        const content = await getPageContent('contact_info')
        if (content && (content as { data?: Record<string, string> }).data) {
            c = { ...DEFAULTS, ...(content as { data: Record<string, string> }).data }
        }
    } catch { /* use defaults */ }

    return (
        <Container className="pt-32 pb-12 md:pt-40 md:pb-20">
            <div className="mx-auto max-w-4xl text-center mb-16">
                <h1 className="mb-6 text-4xl font-bold uppercase tracking-widest md:text-5xl">Contact Us</h1>
                <p className="text-lg text-muted-foreground">
                    We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-2">
                {/* Contact Info */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold uppercase tracking-wide">Get in Touch</h2>
                    {c.description && <p className="text-muted-foreground">{c.description}</p>}

                    <div className="space-y-6">
                        {c.address && (
                            <div className="flex items-start gap-4">
                                <MapPin className="h-6 w-6 text-primary mt-1 shrink-0" />
                                <div>
                                    <h3 className="font-semibold">Visit Us</h3>
                                    <p className="text-muted-foreground whitespace-pre-line">{c.address}</p>
                                </div>
                            </div>
                        )}

                        {c.email && (
                            <div className="flex items-start gap-4">
                                <Mail className="h-6 w-6 text-primary mt-1 shrink-0" />
                                <div>
                                    <h3 className="font-semibold">Email Us</h3>
                                    <a href={`mailto:${c.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                                        {c.email}
                                    </a>
                                </div>
                            </div>
                        )}

                        {c.phone && (
                            <div className="flex items-start gap-4">
                                <Phone className="h-6 w-6 text-primary mt-1 shrink-0" />
                                <div>
                                    <h3 className="font-semibold">WhatsApp / Call</h3>
                                    <a href={c.whatsappUrl || `https://wa.me/${c.phone.replace(/\D/g, '')}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-primary transition-colors">
                                        {c.phone}
                                    </a>
                                </div>
                            </div>
                        )}

                        {(c.instagramUrl || c.facebookUrl) && (
                            <div className="flex items-start gap-4">
                                <div className="h-6 w-6 text-primary mt-1 shrink-0 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold">Follow Us</h3>
                                    <div className="flex gap-3 mt-1">
                                        {c.instagramUrl && (
                                            <Link href={c.instagramUrl} target="_blank" rel="noopener noreferrer"
                                                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm">
                                                <Instagram className="h-4 w-4" /> {c.instagramLabel || 'Instagram'}
                                            </Link>
                                        )}
                                        {c.facebookUrl && (
                                            <Link href={c.facebookUrl} target="_blank" rel="noopener noreferrer"
                                                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-sm">
                                                <Facebook className="h-4 w-4" /> {c.facebookLabel || 'Facebook'}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-secondary/20 p-6 sm:p-8 rounded-lg">
                    <form className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                                <Input id="firstName" placeholder="Jane" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                                <Input id="lastName" placeholder="Doe" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <Input id="email" type="email" placeholder="jane@example.com" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">Message</label>
                            <Textarea id="message" placeholder="Your message here..." className="min-h-[120px]" />
                        </div>
                        <Button type="submit" className="w-full uppercase tracking-widest">Send Message</Button>
                    </form>
                </div>
            </div>
        </Container>
    );
}
