import React from 'react'
import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | Destiny E-Commerce',
  description: 'Terms and conditions for using Destiny E-Commerce platform.',
}

const LAST_UPDATED = 'January 1, 2025'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-destiny-pink mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="bg-white rounded-3xl shadow-card p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-destiny-pink/10 rounded-2xl flex items-center justify-center">
                <FileText size={24} className="text-destiny-pink" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-display text-gray-900">Terms of Service</h1>
                <p className="text-gray-500 text-sm">Last updated: {LAST_UPDATED}</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Welcome to Destiny E-Commerce. By accessing or using our platform, you agree to be bound by these Terms of Service.
              Please read them carefully before making a purchase or creating an account.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-card p-8 space-y-8">
          <Section title="1. Acceptance of Terms">
            <p>By accessing and using Destiny E-Commerce (&quot;Platform,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you accept and agree to be bound
              by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our Platform.</p>
          </Section>

          <Section title="2. Account Registration">
            <ul className="list-disc pl-5 space-y-2">
              <li>You must be at least 18 years old to create an account and make purchases.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You must provide accurate, current, and complete information during registration.</li>
              <li>You agree to notify us immediately of any unauthorized use of your account.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
            </ul>
          </Section>

          <Section title="3. Products and Pricing">
            <ul className="list-disc pl-5 space-y-2">
              <li>All prices are displayed in CFA Francs (FCFA) unless otherwise stated.</li>
              <li>We reserve the right to change prices at any time without prior notice.</li>
              <li>Product images are for illustration purposes; actual products may vary slightly.</li>
              <li>We do not guarantee availability of any product listed on the Platform.</li>
              <li>In the event of a pricing error, we reserve the right to cancel orders at the incorrect price.</li>
            </ul>
          </Section>

          <Section title="4. Orders and Payment">
            <p className="mb-3">By placing an order, you are making an offer to purchase the selected products. All orders are subject to acceptance and availability.</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>MTN Mobile Money:</strong> Send payment to <strong>653526767</strong> then submit your transaction ID for verification.</li>
              <li><strong>Orange Money:</strong> Send payment to <strong>640638536</strong> (Cho Clinton Teneng) then submit your transaction ID.</li>
              <li>Payment must be verified by our team before your order is confirmed and shipped.</li>
              <li>We reserve the right to refuse any order for any reason.</li>
              <li>You will receive an order confirmation email once payment is verified.</li>
            </ul>
          </Section>

          <Section title="5. Shipping and Delivery">
            <ul className="list-disc pl-5 space-y-2">
              <li>Delivery times are estimates and not guaranteed.</li>
              <li>Shipping fees are calculated at checkout based on your location.</li>
              <li>Orders above 50,000 FCFA qualify for free shipping within covered areas.</li>
              <li>We are not responsible for delays caused by customs, natural disasters, or events beyond our control.</li>
              <li>Risk of loss and title for products passes to you upon delivery.</li>
            </ul>
          </Section>

          <Section title="6. Returns and Refunds">
            <ul className="list-disc pl-5 space-y-2">
              <li>Items may be returned within 7 days of delivery if unused, in original packaging.</li>
              <li>Defective products may be returned or exchanged within 30 days.</li>
              <li>Refunds are processed via the original payment method within 5–10 business days after we receive the returned item.</li>
              <li>Shipping costs for returns are the customer&apos;s responsibility unless the return is due to our error.</li>
              <li>Sale items and digital products are non-refundable.</li>
            </ul>
          </Section>

          <Section title="7. Vendor Marketplace">
            <p className="mb-3">Our Platform allows approved third-party vendors to sell products. For vendor-sold items:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Each vendor is responsible for the accuracy of their product listings.</li>
              <li>Destiny E-Commerce acts as a marketplace facilitator, not a party to vendor transactions.</li>
              <li>Disputes with vendors should first be raised through our Platform support system.</li>
              <li>We reserve the right to remove vendors or products at any time.</li>
            </ul>
          </Section>

          <Section title="8. Prohibited Activities">
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use the Platform for any unlawful purpose or in violation of these terms.</li>
              <li>Submit false or fraudulent payment information or transaction IDs.</li>
              <li>Attempt to gain unauthorized access to any part of the Platform.</li>
              <li>Post false, defamatory, or misleading reviews.</li>
              <li>Use automated tools to scrape, crawl, or interact with the Platform.</li>
              <li>Resell products purchased at promotional prices without our written consent.</li>
            </ul>
          </Section>

          <Section title="9. Intellectual Property">
            <p>All content on this Platform, including logos, images, text, and software, is the property of Destiny E-Commerce
              or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute,
              or create derivative works without our express written permission.</p>
          </Section>

          <Section title="10. Limitation of Liability">
            <p className="mb-3">To the maximum extent permitted by law, Destiny E-Commerce shall not be liable for:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Any indirect, incidental, special, or consequential damages.</li>
              <li>Loss of profits, data, or business opportunities.</li>
              <li>Damages exceeding the total amount paid by you in the three months preceding the claim.</li>
              <li>Issues arising from third-party services, including payment processors or delivery partners.</li>
            </ul>
          </Section>

          <Section title="11. Governing Law">
            <p>These Terms are governed by the laws of the Republic of Cameroon. Any disputes shall be subject to
              the exclusive jurisdiction of the courts of Yaoundé, Cameroon. We will endeavor to resolve disputes
              through good-faith negotiation before resorting to litigation.</p>
          </Section>

          <Section title="12. Changes to Terms">
            <p>We may update these Terms at any time. We will notify registered users of material changes via email or
              a prominent notice on the Platform. Your continued use of the Platform after changes take effect constitutes
              acceptance of the revised Terms.</p>
          </Section>

          <Section title="13. Contact Us">
            <p className="mb-2">If you have questions about these Terms, contact us at:</p>
            <div className="bg-gray-50 rounded-2xl p-4 text-sm space-y-1">
              <p><strong>Destiny E-Commerce</strong></p>
              <p>Email: hello@destiny-ecommerce.com</p>
              <p>Phone: +237 653 526 767</p>
              <p>Location: Cameroon</p>
            </div>
          </Section>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            See also:{' '}
            <Link href="/privacy" className="text-destiny-pink hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">{title}</h2>
      <div className="text-gray-600 leading-relaxed text-sm space-y-2">{children}</div>
    </div>
  )
}
