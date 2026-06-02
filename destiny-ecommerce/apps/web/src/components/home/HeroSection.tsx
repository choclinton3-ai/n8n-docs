'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ShoppingBag, Zap } from 'lucide-react'
import { banners } from '@/lib/data/products'

const slides = [
  {
    id: 1,
    badge: 'New Arrivals 2024',
    title: 'Discover the Latest',
    highlight: 'Tech Trends',
    description: 'Explore premium smartphones, laptops, and electronics at unbeatable prices. Delivered fast across Cameroon.',
    cta: 'Shop Now',
    ctaLink: '/shop?filter=new',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=80',
    bg: 'from-[#FF007F] to-[#E60073]',
    accent: '#FFD6EA',
  },
  {
    id: 2,
    badge: '⚡ Flash Sale — Up to 50% OFF',
    title: 'Biggest Tech',
    highlight: 'Flash Sale',
    description: 'Limited-time deals on Samsung, Apple, Tecno, and more. Grab yours before stocks run out!',
    cta: 'Grab Deals',
    ctaLink: '/shop?filter=flash-sale',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=700&q=80',
    bg: 'from-[#C60062] to-[#FF007F]',
    accent: '#FFB3D9',
  },
  {
    id: 3,
    badge: '🏆 Best Sellers',
    title: 'Top-Rated',
    highlight: 'Electronics',
    description: 'Shop what Cameroon loves most. Authentic products with official warranties and fast delivery.',
    cta: 'View Best Sellers',
    ctaLink: '/shop?filter=best-sellers',
    image: 'https://images.unsplash.com/photo-1611186871525-18547cdacd4f?w=700&q=80',
    bg: 'from-[#FF4DA6] to-[#FF007F]',
    accent: '#FFE0F0',
  },
]

export default function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1)
      setCurrent(prev => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }

  const slide = slides[current]

  return (
    <section className="relative overflow-hidden">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, x: direction * 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -50 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className={`relative min-h-[500px] md:min-h-[600px] bg-gradient-to-r ${slide.bg} overflow-hidden`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-4 border-white" />
            <div className="absolute top-32 left-32 w-24 h-24 rounded-full border-2 border-white" />
            <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full border-4 border-white" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/20" />
          </div>

          <div className="container mx-auto px-4 py-12 md:py-0 md:h-[600px] flex items-center relative z-10">
            <div className="grid md:grid-cols-2 gap-8 items-center w-full">
              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-white"
              >
                <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full mb-4 border border-white/30">
                  {slide.badge}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-display leading-tight mb-4">
                  {slide.title}<br />
                  <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">{slide.highlight}</span>
                </h1>
                <p className="text-white/90 text-lg mb-8 max-w-lg leading-relaxed">
                  {slide.description}
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <Link
                    href={slide.ctaLink}
                    className="flex items-center gap-2 bg-white text-destiny-pink px-8 py-4 rounded-2xl font-bold text-base hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl active:scale-95"
                  >
                    <ShoppingBag size={20} />
                    {slide.cta}
                  </Link>
                  <Link
                    href="/shop"
                    className="flex items-center gap-2 border-2 border-white/50 text-white px-6 py-4 rounded-2xl font-semibold text-base hover:bg-white/10 transition-colors"
                  >
                    Browse All
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-8 mt-8 pt-6 border-t border-white/20">
                  {[
                    { value: '10,000+', label: 'Products' },
                    { value: '50,000+', label: 'Happy Customers' },
                    { value: '100%', label: 'Authentic' },
                  ].map(stat => (
                    <div key={stat.label}>
                      <div className="text-2xl font-black text-white">{stat.value}</div>
                      <div className="text-white/70 text-xs font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Product Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.6, type: 'spring' }}
                className="hidden md:flex justify-center items-center"
              >
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-3xl blur-3xl opacity-30"
                    style={{ background: slide.accent }}
                  />
                  <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                    <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                      <img
                        src={slide.image}
                        alt="Featured Product"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Floating Badge */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-4 -right-4 bg-white text-destiny-pink rounded-2xl p-3 shadow-xl"
                  >
                    <Zap size={20} fill="currentColor" />
                    <div className="text-xs font-black mt-1">HOT</div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
                    className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-2 shadow-xl"
                  >
                    <div className="text-destiny-pink font-black text-sm">FREE</div>
                    <div className="text-gray-600 text-xs">Delivery</div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <button
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => goTo((current + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
