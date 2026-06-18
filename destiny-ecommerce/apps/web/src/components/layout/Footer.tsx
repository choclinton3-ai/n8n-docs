'use client'

import React from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Send } from 'lucide-react'

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press & Media', href: '/press' },
    { label: 'Blog', href: '/blog' },
    { label: 'Affiliate Program', href: '/affiliates' },
  ],
  shop: [
    { label: 'New Arrivals', href: '/shop?filter=new' },
    { label: 'Best Sellers', href: '/shop?filter=best-sellers' },
    { label: 'Flash Sales', href: '/shop?filter=flash-sale' },
    { label: 'All Products', href: '/shop' },
    { label: 'Brands', href: '/shop?view=brands' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Track Order', href: '/shop/orders' },
    { label: 'Returns & Refunds', href: '/returns' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Contact Us', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Warranty Policy', href: '/warranty' },
  ],
}

const paymentMethods = [
  { name: 'MTN Mobile Money', color: '#FFCC00', initial: 'MTN' },
  { name: 'Orange Money', color: '#FF6600', initial: 'OM' },
  { name: 'Visa', color: '#1A1F71', initial: 'VISA' },
  { name: 'Mastercard', color: '#EB001B', initial: 'MC' },
  { name: 'PayPal', color: '#003087', initial: 'PP' },
]

export default function Footer() {
  const [email, setEmail] = React.useState('')

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-destiny-gradient py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold font-display">Subscribe to Our Newsletter</h3>
              <p className="text-white/80 mt-1">Get exclusive deals and the latest tech updates delivered to you.</p>
            </div>
            <div className="flex w-full md:w-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 md:w-80 px-4 py-3 rounded-xl text-gray-900 focus:outline-none text-sm"
              />
              <button className="bg-white text-destiny-pink px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors flex items-center gap-2">
                <Send size={16} /> Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-destiny-gradient rounded-full flex items-center justify-center">
                <span className="text-white font-black text-xl font-display">D</span>
              </div>
              <div>
                <div className="font-black text-xl font-display text-white">DESTINY</div>
                <div className="text-gray-400 text-xs font-semibold tracking-widest">E-COMMERCE</div>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Cameroon's premier electronics marketplace. We bring you the best tech products at competitive prices with excellent customer service.
            </p>

            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-destiny-pink flex-shrink-0" />
                <span>Akwa, Douala, Cameroon</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-destiny-pink flex-shrink-0" />
                <a href="tel:+237650000000" className="hover:text-destiny-pink transition-colors">+237 650 000 000</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-destiny-pink flex-shrink-0" />
                <a href="mailto:hello@destinyecommerce.cm" className="hover:text-destiny-pink transition-colors">hello@destinyecommerce.cm</a>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { Icon: Facebook, href: '#', label: 'Facebook' },
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Twitter, href: '#', label: 'Twitter' },
                { Icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 bg-gray-800 hover:bg-destiny-pink rounded-xl flex items-center justify-center transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Company', links: footerLinks.company },
            { title: 'Shop', links: footerLinks.shop },
            { title: 'Support', links: footerLinks.support },
          ].map(section => (
            <div key={section.title}>
              <h4 className="font-bold text-white mb-5 font-display">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-gray-400 hover:text-destiny-pink text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
              <span className="text-gray-400 text-sm">We accept:</span>
              {paymentMethods.map(method => (
                <div
                  key={method.name}
                  className="px-3 py-1.5 rounded-lg text-white text-xs font-bold"
                  style={{ backgroundColor: method.color }}
                  title={method.name}
                >
                  {method.initial}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <span>🔒</span>
              <span>SSL Secured Payments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2024 Destiny E-Commerce. All rights reserved. Made with ❤️ in Cameroon.</p>
          <div className="flex items-center gap-4">
            {footerLinks.legal.slice(0, 3).map(link => (
              <Link key={link.href} href={link.href} className="hover:text-destiny-pink transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
