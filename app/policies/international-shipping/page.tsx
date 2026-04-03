import { Metadata } from "next";
import Container from "@/components/shared/Container";

export const metadata: Metadata = {
    title: "International Shipping Policy",
    description: "Adum Culture international shopping and shipping policy — duties, taxes, payment methods, and delivery timeframes.",
};

export default function InternationalShippingPage() {
    return (
        <Container className="pt-24 pb-16 md:pt-32 md:pb-24 max-w-3xl">
            <h1 className="mb-2 text-3xl font-bold uppercase tracking-widest md:text-4xl">International Shipping Policy</h1>
            <p className="mb-12 text-sm text-muted-foreground">Adum Culture — Kiribathgoda, Sri Lanka 11600</p>

            <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">

                <section className="space-y-3">
                    <p>At ADUM CULTURE, we are proud to offer an enhanced international shopping experience, delivering our products to customers around the world. You can shop in your preferred local currency and view your complete order total — including shipping fees — at checkout.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">Shipping</h2>
                    <p>International deliveries may experience delays caused by flight disruptions, cancellations, government regulations, or border restrictions. We appreciate your patience in such circumstances.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">International Shipping Costs</h2>
                    <p>Shipping charges are calculated based on:</p>
                    <ul className="list-disc list-outside ml-5 space-y-2">
                        <li>Shipping method selected</li>
                        <li>Number of items purchased</li>
                        <li>Weight of the items</li>
                        <li>Destination country</li>
                    </ul>
                    <p>The final shipping cost will be calculated and confirmed at checkout.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">Duties &amp; Taxes</h2>
                    <ul className="list-disc list-outside ml-5 space-y-2">
                        <li><strong className="text-foreground">Duties</strong> (customs tariffs) are determined by the customs authorities of the destination country.</li>
                        <li><strong className="text-foreground">International taxes</strong> (such as VAT) are also set by the destination country.</li>
                        <li>These charges are the <strong className="text-foreground">responsibility of the customer</strong> and may be applicable upon delivery.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">Payment</h2>
                    <ul className="list-disc list-outside ml-5 space-y-2">
                        <li>We accept <strong className="text-foreground">Visa and Mastercard</strong> for international orders.</li>
                        <li>ADUM CULTURE will appear as the merchant of record on your credit card statement for all international transactions.</li>
                        <li>We are required to declare the full value of the shipment and include an invoice with all international orders.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">Shipment Timeframes</h2>
                    <ul className="list-disc list-outside ml-5 space-y-2">
                        <li>Estimated delivery: <strong className="text-foreground">10–14 working days</strong> from the date of shipping.</li>
                        <li>Delivery dates are not guaranteed and may be subject to unforeseen delays.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">Returns &amp; Exchanges</h2>
                    <p><strong className="text-foreground">Returns and exchanges are NOT accepted for international orders.</strong> Please ensure you select the correct size and review your order carefully before completing your purchase.</p>
                </section>

                <div className="border-t pt-8 space-y-1">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground mb-3">Customer Support</h2>
                    <p>Email: <a href="mailto:info@adumculture.com" className="text-foreground underline hover:text-primary">info@adumculture.com</a></p>
                    <p>Hotline: <a href="https://wa.me/94760613070" target="_blank" rel="noopener noreferrer" className="text-foreground underline hover:text-primary">+94 76 061 3070</a></p>
                </div>
            </div>
        </Container>
    );
}
