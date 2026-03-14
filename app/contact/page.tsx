import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
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
                    <p className="text-muted-foreground">
                        Have a question about an order, a product, or just want to say hi?
                        Reach out to our team.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <MapPin className="h-6 w-6 text-primary mt-1" />
                            <div>
                                <h3 className="font-semibold">Visit Us</h3>
                                <p className="text-muted-foreground">
                                    123 Fashion Avenue,<br />
                                    Colombo 07, Sri Lanka
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <Mail className="h-6 w-6 text-primary mt-1" />
                            <div>
                                <h3 className="font-semibold">Email Us</h3>
                                <p className="text-muted-foreground">hello@adumculture.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <Phone className="h-6 w-6 text-primary mt-1" />
                            <div>
                                <h3 className="font-semibold">Call Us</h3>
                                <p className="text-muted-foreground">+94 77 123 4567</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-secondary/20 p-8 rounded-lg">
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
                            <Textarea
                                id="message"
                                placeholder="Your message here..."
                                className="min-h-[120px]"
                            />
                        </div>

                        <Button type="submit" className="w-full uppercase tracking-widest">Send Message</Button>
                    </form>
                </div>
            </div>
        </Container>
    );
}
