'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1, name: 'Amara Ngoh', location: 'Douala, Cameroon', rating: 5,
    comment: 'I ordered a Samsung Galaxy S24 and received it the next day! The packaging was perfect and the phone is genuine. Best e-commerce platform in Cameroon!',
    avatar: 'AN', product: 'Samsung Galaxy S24 Ultra',
  },
  {
    id: 2, name: 'Jean-Pierre Mbarga', location: 'Yaoundé, Cameroon', rating: 5,
    comment: 'Excellent service! The MacBook Air M3 I ordered arrived in 2 days. Customer support was very helpful when I had a question about the warranty.',
    avatar: 'JM', product: 'MacBook Air M3',
  },
  {
    id: 3, name: 'Fatima Diallo', location: 'Bafoussam, Cameroon', rating: 5,
    comment: 'Amazing prices compared to other shops. I got Sony WH-1000XM5 for a great price. Payment with MTN Mobile Money was seamless. Will shop again!',
    avatar: 'FD', product: 'Sony WH-1000XM5',
  },
  {
    id: 4, name: 'Emmanuel Tchouopo', location: 'Buea, Cameroon', rating: 4,
    comment: 'Great selection of products. Ordered PS5 for my son, it came with all accessories. Destiny E-Commerce is the real deal for electronics in Cameroon.',
    avatar: 'ET', product: 'PlayStation 5',
  },
  {
    id: 5, name: 'Marie Claire Fouda', location: 'Douala, Cameroon', rating: 5,
    comment: 'I was skeptical at first but after my first purchase I am a loyal customer. The product quality is exactly as described. Highly recommended!',
    avatar: 'MF', product: 'Samsung Galaxy Watch 7',
  },
  {
    id: 6, name: 'Patrick Nkwenti', location: 'Limbe, Cameroon', rating: 5,
    comment: 'Fast delivery even to Limbe! Ordered iPhone 15 Pro Max and got it in 3 days. The 24/7 support chat is very responsive.',
    avatar: 'PN', product: 'iPhone 15 Pro Max',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-destiny-pink font-semibold text-sm uppercase tracking-wider mb-2">What Our Customers Say</p>
          <h2 className="section-title">Customer Reviews</h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} className="text-amber-400 fill-amber-400" />)}
            </div>
            <span className="font-bold text-gray-900">4.9/5</span>
            <span className="text-gray-500">(10,000+ reviews)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-destiny-gradient rounded-full flex items-center justify-center text-white font-bold text-base">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.location}</div>
                  </div>
                </div>
                <Quote size={24} className="text-destiny-100" />
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.comment}"</p>
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">Purchased:</span>
                <span className="text-xs font-semibold text-destiny-pink">{t.product}</span>
                <span className="ml-auto text-xs text-green-600 font-medium">✓ Verified</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
