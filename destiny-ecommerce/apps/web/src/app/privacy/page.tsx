import React from 'react'
import Link from 'next/link'
import { Shield, ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | Destiny E-Commerce',
  description: 'How Destiny E-Commerce collects, uses, and protects your personal information.',
}

const LAST_UPDATED = 'January 1, 2025'

export default function PrivacyPage() {
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
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                <Shield size={24} className="text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-display text-gray-900">Privacy Policy</h1>
                <p className="text-gray-500 text-sm">Last updated: {LAST_UPDATED}</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              At Destiny E-Commerce, your privacy is important to us. This Privacy Policy explains how we collect,
              use, disclose, and protect your personal information when you use our platform.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-card p-8 space-y-8">
          <Section title="1. Information We Collect">
            <p className="mb-3"><strong>Information you provide directly:</strong></p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Name, email address, and phone number when you register</li>
              <li>Delivery address and location information</li>
              <li>Payment transaction IDs (MTN MoMo or Orange Money reference numbers)</li>
              <li>Product reviews, ratings, and support messages</li>
              <li>Vendor business information if you apply as a seller</li>
            </ul>
            <p className="mb-3"><strong>Information collected automatically:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Device type, browser, and operating system</li>
              <li>IP address and approximate location</li>
              <li>Pages visited, products viewed, and search queries</li>
              <li>Cookies and similar tracking technologies</li>
              <li>Purchase history and browsing behavior on our Platform</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Order fulfillment:</strong> To process orders, verify payments, and arrange delivery.</li>
              <li><strong>Account management:</strong> To create and maintain your account, reset passwords, and send account-related notifications.</li>
              <li><strong>Customer support:</strong> To respond to your inquiries, resolve disputes, and handle returns.</li>
              <li><strong>Personalization:</strong> To recommend products based on your browsing and purchase history.</li>
              <li><strong>Marketing (with consent):</strong> To send promotional offers, new arrivals, and special discounts via email or SMS.</li>
              <li><strong>Platform improvement:</strong> To analyze usage patterns and improve our services.</li>
              <li><strong>Legal compliance:</strong> To comply with applicable laws and prevent fraud.</li>
            </ul>
          </Section>

          <Section title="3. Payment Information">
            <p className="mb-3">We use a manual payment verification system for Mobile Money transactions. Here&apos;s what we collect and how we handle it:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>We collect <strong>only the transaction reference ID</strong> you submit after sending payment.</li>
              <li>We do not collect, store, or transmit your Mobile Money PIN or full account credentials.</li>
              <li>Transaction IDs are used solely to verify payment with the respective mobile operator (MTN or Orange).</li>
              <li>Payment records are retained for 7 years for accounting and legal purposes.</li>
              <li>We partner with MTN Mobile Money and Orange Money — their privacy policies also apply to your mobile transactions.</li>
            </ul>
          </Section>

          <Section title="4. Cookies and Tracking">
            <p className="mb-3">We use cookies and similar technologies for:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Essential cookies:</strong> Required for the Platform to function (authentication sessions, shopping cart).</li>
              <li><strong>Analytics cookies:</strong> To understand how visitors use our Platform (aggregated, anonymized data).</li>
              <li><strong>Preference cookies:</strong> To remember your settings, language preferences, and wishlist.</li>
            </ul>
            <p className="mt-3">You can disable non-essential cookies in your browser settings, though this may affect Platform functionality.</p>
          </Section>

          <Section title="5. Information Sharing">
            <p className="mb-3">We do not sell your personal information. We share it only in these circumstances:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Vendors:</strong> When you order a vendor-listed product, we share your name and delivery address with the vendor to fulfill the order.</li>
              <li><strong>Delivery partners:</strong> Your name, phone number, and delivery address are shared with our delivery agents.</li>
              <li><strong>Service providers:</strong> Cloud storage (database, file hosting), email delivery, and SMS services — bound by confidentiality agreements.</li>
              <li><strong>Legal requirements:</strong> When required by law, court order, or to protect the rights and safety of our users or platform.</li>
              <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred with appropriate notice.</li>
            </ul>
          </Section>

          <Section title="6. Data Security">
            <ul className="list-disc pl-5 space-y-2">
              <li>Passwords are hashed using bcrypt (industry-standard) and never stored in plain text.</li>
              <li>All data transmission uses HTTPS/TLS encryption.</li>
              <li>Access to personal data is restricted to authorized personnel on a need-to-know basis.</li>
              <li>We perform regular security audits and keep software dependencies up to date.</li>
              <li>In the event of a data breach, we will notify affected users within 72 hours as required by applicable law.</li>
            </ul>
          </Section>

          <Section title="7. Data Retention">
            <ul className="list-disc pl-5 space-y-2">
              <li>Account data is retained for as long as your account is active.</li>
              <li>Order and payment records are retained for 7 years for financial and legal compliance.</li>
              <li>If you delete your account, personal data is deleted within 30 days, except records required for legal compliance.</li>
              <li>Anonymized analytics data may be retained indefinitely.</li>
            </ul>
          </Section>

          <Section title="8. Your Rights">
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> Update or correct inaccurate personal information via your account settings or by contacting us.</li>
              <li><strong>Deletion:</strong> Request deletion of your account and personal data, subject to legal retention requirements.</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing emails at any time via the unsubscribe link or your notification settings.</li>
              <li><strong>Data portability:</strong> Request your data in a machine-readable format.</li>
            </ul>
            <p className="mt-3">To exercise these rights, contact us at <strong>hello@destiny-ecommerce.com</strong>. We will respond within 30 days.</p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>Our Platform is not directed to children under 18. We do not knowingly collect personal information from minors.
              If you believe a child has provided us with personal information, please contact us and we will delete it promptly.</p>
          </Section>

          <Section title="10. Third-Party Links">
            <p>Our Platform may contain links to third-party websites. We are not responsible for the privacy practices
              of those sites. We encourage you to read their privacy policies before providing any personal information.</p>
          </Section>

          <Section title="11. Changes to This Policy">
            <p>We may update this Privacy Policy periodically. We will notify you of material changes by email or by posting
              a notice on the Platform. Your continued use after changes are posted constitutes acceptance of the updated policy.</p>
          </Section>

          <Section title="12. Contact Us">
            <p className="mb-2">For privacy-related questions, requests, or complaints:</p>
            <div className="bg-gray-50 rounded-2xl p-4 text-sm space-y-1">
              <p><strong>Destiny E-Commerce — Data Privacy</strong></p>
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
            <Link href="/terms" className="text-destiny-pink hover:underline">Terms of Service</Link>
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
