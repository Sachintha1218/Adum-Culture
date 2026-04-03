import { Metadata } from "next";
import Container from "@/components/shared/Container";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Adum Culture Terms of Service — general conditions, terms of sale, and terms of use for www.adumculture.com.",
};

export default function TermsOfServicePage() {
    return (
        <Container className="pt-24 pb-16 md:pt-32 md:pb-24 max-w-3xl">
            <h1 className="mb-2 text-3xl font-bold uppercase tracking-widest md:text-4xl">Terms of Service</h1>
            <p className="mb-12 text-sm text-muted-foreground">ADUM CULTURE — Kiribathgoda, Sri Lanka 11600 | www.adumculture.com</p>

            <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">

                <section className="space-y-3">
                    <p>By accessing or using our website and purchasing our products, you agree to be bound by these Terms of Service. Please read them carefully before using our site.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">General Conditions</h2>
                    <ul className="list-disc list-outside ml-5 space-y-2">
                        <li>We reserve the right to refuse service to anyone for any reason at any time.</li>
                        <li>You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of our site or its content without express written permission.</li>
                        <li>We may update these terms at any time. Continued use of the site constitutes acceptance of the updated terms.</li>
                        <li>These terms are governed by the laws of Sri Lanka.</li>
                    </ul>
                </section>

                <section className="space-y-6">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">Terms of Sale</h2>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">Product Information</h3>
                        <p>We endeavour to display our products as accurately as possible. However, we cannot guarantee that your device&apos;s display of colours will be accurate. Product descriptions may be updated without notice.</p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">Placing an Order</h3>
                        <p>By placing an order on our website, you are making an offer to purchase a product. We reserve the right to refuse or cancel any order for any reason, including stock unavailability or pricing errors. You will be notified if your order is cancelled and any payment will be refunded.</p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">Exchanges</h3>
                        <p>Please refer to our <a href="/policies/exchange-refund" className="text-foreground underline hover:text-primary">Exchange &amp; Refund Policy</a> for full details on how to request an exchange or refund.</p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">Risk and Title</h3>
                        <p>Risk of loss and title for items purchased from our site pass to you upon delivery to the carrier.</p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">Price and Payment</h3>
                        <p>All prices are listed in Sri Lankan Rupees (LKR) unless otherwise stated. We accept Visa, Mastercard, and Koko (BNPL). We reserve the right to change prices at any time without prior notice.</p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">Warranties &amp; Limitation of Liability</h3>
                        <p>Our products are provided &quot;as is.&quot; To the maximum extent permitted by law, ADUM CULTURE shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our products or website.</p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">Indemnification</h3>
                        <p>You agree to indemnify and hold harmless ADUM CULTURE and its affiliates from any claims, damages, or expenses arising out of your violation of these terms or your use of our products or services.</p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">Force Majeure</h3>
                        <p>ADUM CULTURE shall not be liable for delays or failures in performance resulting from causes beyond our reasonable control, including natural disasters, pandemics, government restrictions, or supply chain disruptions.</p>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-base font-bold uppercase tracking-wider text-foreground">Terms of Use of the Website</h2>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">Accessing Our Site</h3>
                        <p>Access to our website is permitted on a temporary basis. We reserve the right to withdraw or amend our site without notice. We will not be liable if our site is unavailable at any time.</p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">Intellectual Property</h3>
                        <p>All content on this website, including text, images, logos, and design, is the property of ADUM CULTURE and is protected by copyright and other intellectual property laws. You may not use our content without written permission.</p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">Information About You</h3>
                        <p>We process information about you in accordance with our <a href="/policies/privacy-policy" className="text-foreground underline hover:text-primary">Privacy Policy</a>.</p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">Viruses &amp; Hacking</h3>
                        <p>You must not misuse our site by knowingly introducing viruses or other harmful material. You must not attempt to gain unauthorised access to our site, servers, or databases. We will report any such breach to law enforcement authorities.</p>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-semibold text-foreground">Jurisdiction</h3>
                        <p>These terms and any disputes arising from your use of our website shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.</p>
                    </div>
                </section>

                <div className="border-t pt-8 space-y-1">
                    <p>ADUM CULTURE, Kiribathgoda, Sri Lanka 11600</p>
                    <p>Email: <a href="mailto:info@adumculture.com" className="text-foreground underline hover:text-primary">info@adumculture.com</a></p>
                    <p>Website: <a href="https://www.adumculture.com" className="text-foreground underline hover:text-primary">www.adumculture.com</a></p>
                </div>
            </div>
        </Container>
    );
}
