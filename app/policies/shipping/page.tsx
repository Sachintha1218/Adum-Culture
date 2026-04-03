import { Metadata } from "next";
import Container from "@/components/shared/Container";

export const metadata: Metadata = {
    title: "Shipping Policy",
    description: "Adum Culture shipping policy — local and international delivery information, dispatch times, and tracking.",
};

export default function ShippingPage() {
    return (
        <Container className="pt-24 pb-16 md:pt-32 md:pb-24 max-w-3xl">
            <h1 className="mb-2 text-3xl font-bold uppercase tracking-widest md:text-4xl">Shipping Policy</h1>
            <p className="mb-12 text-sm text-muted-foreground">Adum Culture — Kiribathgoda, Sri Lanka 11600</p>

            <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">

                <section className="space-y-4">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">Local Shipping</h2>
                    <p>Our staff at our Kiribathgoda warehouse work hard to dispatch goods within <strong className="text-foreground">24 hours</strong>, though it could take a bit longer during promotions and new collection drops.</p>
                    <p>Delivery dates and charges depend on the shipping address and order date. We will send an email and text message when your order is dispatched from our warehouse.</p>
                    <ul className="list-disc list-outside ml-5 space-y-2">
                        <li>We deliver to <strong className="text-foreground">all addresses in Sri Lanka</strong>.</li>
                        <li>A full postal address is required, including the postcode and city, clearly filled out at checkout.</li>
                        <li>We <strong className="text-foreground">cannot deliver</strong> to military bases or PO boxes.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">International Shipping</h2>
                    <p>The estimated standard delivery period is <strong className="text-foreground">10–14 working days</strong>, depending on the delivery address.</p>
                    <ul className="list-disc list-outside ml-5 space-y-2">
                        <li>All international delivery options are fully tracked.</li>
                        <li>Shipping time commences from the <strong className="text-foreground">date of shipping</strong>, rather than the date of order.</li>
                        <li>Deliveries can take longer than expected due to invalid addresses, customs clearance procedures, or other unforeseen causes.</li>
                    </ul>
                    <p>For full details about international orders, please see our <a href="/policies/international-shipping" className="text-foreground underline hover:text-primary">International Shipping Policy</a>.</p>
                </section>

                <div className="border-t pt-8">
                    <p>For any shipping queries, contact us at <a href="mailto:info@adumculture.com" className="text-foreground underline hover:text-primary">info@adumculture.com</a> or WhatsApp <a href="https://wa.me/94760613070" target="_blank" rel="noopener noreferrer" className="text-foreground underline hover:text-primary">+94 76 061 3070</a>.</p>
                </div>
            </div>
        </Container>
    );
}
