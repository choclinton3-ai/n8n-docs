'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Truck, Shield, RefreshCw, Headphones, CreditCard, Award } from 'lucide-react'

const features = [
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Delivery across all major cities in Cameroon. Same-day delivery in Douala & Yaoundé.',
    color: '#FF007F',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Your payments are protected. We support MTN MoMo, Orange Money, Visa, Mastercard & PayPal.',
    color: '#10b981',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '30-day hassle-free return policy. Not satisfied? We\'ll make it right.',
    color: '#f59e0b',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our support team is available 24/7 via WhatsApp, phone, email, and live chat.',
    color: '#6366f1',
  },
  {
    icon: Award,
    title: '100% Authentic',
    description: 'All products are sourced directly from official distributors with full warranty coverage.',
    color: '#ec4899',
  },
  {
    icon: CreditCard,
    title: 'Pay on Delivery',
    description: 'Cash on delivery available for all orders within Douala and Yaoundé.',
    color: '#14b8a6',
  },
]

export default function TrustSection() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-destiny-pink font-semibold text-sm uppercase tracking-wider mb-2">Why Shop With Us</p>
          <h2 className="section-title">Your Success, Our Destiny</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-card transition-all duration-300 group"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${feat.color}15` }}
              >
                <feat.icon size={26} style={{ color: feat.color }} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">{feat.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
