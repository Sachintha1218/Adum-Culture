import { Metadata } from "next";
import Container from "@/components/shared/Container";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: "Adum Culture Privacy Policy — how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
    return (
        <Container className="pt-24 pb-16 md:pt-32 md:pb-24 max-w-3xl">
            <h1 className="mb-2 text-3xl font-bold uppercase tracking-widest md:text-4xl">Privacy Policy</h1>
            <p className="mb-12 text-sm text-muted-foreground">Last updated: April 2, 2026</p>

            <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">

                <section className="space-y-3">
                    <p>At Adum Culture, we are committed to protecting your personal information and your right to privacy. This Privacy Policy describes how we collect, use, and disclose information about you when you visit our website <strong className="text-foreground">www.adumculture.com</strong> or make a purchase from us.</p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">Personal Information We Collect or Process</h2>
                    <p>When you visit or use our site, we may collect the following types of personal information:</p>
                    <ul className="list-disc list-outside ml-5 space-y-2">
                        <li><strong className="text-foreground">Contact information:</strong> Name, email address, phone number, and postal address.</li>
                        <li><strong className="text-foreground">Order information:</strong> Billing and shipping address, payment details (processed securely by payment providers), and purchase history.</li>
                        <li><strong className="text-foreground">Device and usage information:</strong> IP address, browser type, referring URLs, and pages visited on our site.</li>
                        <li><strong className="text-foreground">Communications:</strong> Messages you send us via email, WhatsApp, or our contact form.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">Personal Information Sources</h2>
                    <p>We collect personal information directly from you when you place an order, create an account, contact us, or subscribe to our newsletter. We may also collect information automatically via cookies and analytics tools when you browse our website.</p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">How We Use Your Personal Information</h2>
                    <ul className="list-disc list-outside ml-5 space-y-2">
                        <li>To process and fulfil your orders and arrange delivery.</li>
                        <li>To communicate with you about your orders, returns, and enquiries.</li>
                        <li>To send promotional emails and updates (you may opt out at any time).</li>
                        <li>To improve our website, products, and customer experience.</li>
                        <li>To comply with legal obligations.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">How We Disclose Personal Information</h2>
                    <p>We do not sell your personal information. We may share your information with:</p>
                    <ul className="list-disc list-outside ml-5 space-y-2">
                        <li><strong className="text-foreground">Delivery and logistics partners</strong> to fulfil your orders.</li>
                        <li><strong className="text-foreground">Payment processors</strong> to complete transactions securely.</li>
                        <li><strong className="text-foreground">Service providers</strong> who assist us in operating our website and business (e.g., email platforms, analytics).</li>
                        <li><strong className="text-foreground">Legal authorities</strong> if required by law or to protect our rights.</li>
                    </ul>
                </section>

                <section className="space-y-3">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">Third Party Websites and Links</h2>
                    <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies.</p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">Children&apos;s Data</h2>
                    <p>Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately.</p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">Security and Retention of Your Information</h2>
                    <p>We implement appropriate technical and organisational security measures to protect your personal information. We retain your data only for as long as necessary to fulfil the purposes outlined in this policy, or as required by law.</p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">Your Rights and Choices</h2>
                    <p>Depending on your location, you may have the right to access, correct, delete, or restrict the processing of your personal data. To exercise any of these rights, please contact us using the details below.</p>
                    <p>You may unsubscribe from marketing emails at any time by clicking &quot;unsubscribe&quot; in any email we send, or by contacting us directly.</p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">Complaints</h2>
                    <p>If you have concerns about how we handle your personal information, please contact us. You also have the right to lodge a complaint with the relevant data protection authority in your country.</p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">International Transfers</h2>
                    <p>Your data may be processed in countries outside of Sri Lanka where our service providers operate. We ensure appropriate safeguards are in place for such transfers.</p>
                </section>

                <section className="space-y-3">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">Changes to This Privacy Policy</h2>
                    <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated &quot;Last updated&quot; date. We encourage you to review this policy periodically.</p>
                </section>

                <div className="border-t pt-8 space-y-1">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground mb-3">Contact Us</h2>
                    <p>Adum Culture, Kiribathgoda, Sri Lanka 11600</p>
                    <p>Email: <a href="mailto:info@adumculture.com" className="text-foreground underline hover:text-primary">info@adumculture.com</a></p>
                    <p>WhatsApp: <a href="https://wa.me/94760613070" target="_blank" rel="noopener noreferrer" className="text-foreground underline hover:text-primary">+94 76 061 3070</a></p>
                </div>
            </div>
        </Container>
    );
}
