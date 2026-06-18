'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Smartphone, Monitor, Headphones } from 'lucide-react'

const promos = [
  {
    title: 'Smartphones',
    subtitle: 'Explore the latest',
    description: 'Samsung, Apple, Tecno & more',
    cta: 'Shop Phones',
    href: '/shop?category=smartphones',
    bg: 'from-[#FF007F] to-[#C60062]',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
    icon: Smartphone,
  },
  {
    title: 'Up to 50% Off',
    subtitle: 'Flash Sale',
    description: 'Limited time deals on premium electronics',
    cta: 'Grab Deals',
    href: '/shop?filter=flash-sale',
    bg: 'from-[#6366f1] to-[#8b5cf6]',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    icon: Headphones,
  },
  {
    title: 'Smart TVs',
    subtitle: 'Home Entertainment',
    description: '4K QLED & OLED Smart TVs',
    cta: 'Shop TVs',
    href: '/shop?category=smart-tvs',
    bg: 'from-[#10b981] to-[#059669]',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400',
    icon: Monitor,
  },
]

export default function PromoSection() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promos.map((promo, i) => (
            <motion.div
              key={promo.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${promo.bg} p-6 text-white min-h-[200px] flex flex-col justify-between`}
            >
              {/* Background image */}
              <div className="absolute inset-0 opacity-15">
                <img src={promo.image} alt="" className="w-full h-full object-cover" />
              </div>

              {/* Pattern */}
              <div className="absolute top-4 right-4 w-24 h-24 rounded-full border-4 border-white/20" />
              <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/10" />

              <div className="relative">
                <p className="text-white/80 text-sm font-medium mb-1">{promo.subtitle}</p>
                <h3 className="text-2xl font-black font-display mb-1">{promo.title}</h3>
                <p className="text-white/80 text-sm">{promo.description}</p>
              </div>

              <Link
                href={promo.href}
                className="relative inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all w-fit mt-4 border border-white/30"
              >
                {promo.cta} <ArrowRight size={16} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
