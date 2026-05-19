import { Metadata } from "next";
import Container from "@/components/shared/Container";
import Link from "next/link";
import { getPageContent } from "@/lib/admin-api";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Exchange & Refund Policy",
    description: "Learn about Adum Culture's exchange and refund policy — 7-day exchange window, refund conditions, and how to get in touch.",
};

export default async function ExchangeRefundPage() {
    let cmsBody: string | null = null;
    try {
        const content = await getPageContent('returns_policy');
        if (content?.body) cmsBody = content.body;
    } catch { /* use hardcoded */ }

    return (
        <Container className="pt-24 pb-16 md:pt-32 md:pb-24 max-w-3xl">
            <h1 className="mb-2 text-3xl font-bold uppercase tracking-widest md:text-4xl">Exchange &amp; Refund Policy</h1>
            <p className="mb-12 text-sm text-muted-foreground">Adum Culture — Kiribathgoda, Sri Lanka 11600</p>
            {cmsBody ? (
                <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{cmsBody}</div>
            ) : (
            <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">

                <section className="space-y-4">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">Exchanges</h2>
                    <ul className="list-disc list-outside ml-5 space-y-2">
                        <li>You have <strong className="text-foreground">7 days</strong> from the delivered date to request an exchange for styles purchased online.</li>
                        <li>Items must be in their original condition with all tags intact.</li>
                        <li>We do not offer returns or exchanges for <strong className="text-foreground">discounted or sale items</strong>.</li>
                        <li>You can exchange your item for a different size or color, or receive an exchange code to place a new order for a different style.</li>
                        <li>The online exchange process takes <strong className="text-foreground">7–10 working days</strong>.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">Refunds</h2>
                    <p>Refunds are only accepted in the unlikely event that an item you ordered is <strong className="text-foreground">damaged, defective, or different from what you ordered</strong>. In these specific cases, a return courier will be arranged free of charge.</p>
                    <ul className="list-disc list-outside ml-5 space-y-2">
                        <li>We aim to process all refunds within <strong className="text-foreground">7 working days</strong> of receiving your parcel at our warehouse.</li>
                        <li><strong className="text-foreground">Paid Orders:</strong> Refund made to the card used for the original order.</li>
                        <li><strong className="text-foreground">COD Orders:</strong> Refund made to a bank account assigned to the original customer.</li>
                        <li>You will receive a refund confirmation via email once the process is complete.</li>
                        <li>Refunds usually clear into your account within <strong className="text-foreground">3–5 working days</strong>, though this may vary depending on your bank.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">Please Note</h2>
                    <ul className="list-disc list-outside ml-5 space-y-2">
                        <li>Returns and exchanges can be arranged only after contacting us. Please reach out via email at <a href="mailto:info@adumculture.com" className="text-foreground underline hover:text-primary">info@adumculture.com</a> or WhatsApp hotline <a href="https://wa.me/94760613070" target="_blank" rel="noopener noreferrer" className="text-foreground underline hover:text-primary">+94 76 061 3070</a>.</li>
                        <li>If we find that the product has not been returned in fully resalable condition, we reserve the right to refuse a refund or exchange.</li>
                        <li>Changes to the delivery address cannot be accommodated once the package has been shipped.</li>
                        <li>Any outstanding balance during an exchange must be paid in cash at the moment of delivery.</li>
                    </ul>
                </section>

                <div className="border-t pt-8">
                    <p>For any questions, contact us at <a href="mailto:info@adumculture.com" className="text-foreground underline hover:text-primary">info@adumculture.com</a> or <Link href="/contact" className="text-foreground underline hover:text-primary">visit our contact page</Link>.</p>
                </div>
            </div>
            )}
        </Container>
    );
}
