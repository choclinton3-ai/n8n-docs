'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Zap, ArrowRight } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { getFlashSaleProducts } from '@/lib/data/products'

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) return setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
      setTimeLeft({
        hours: Math.floor(diff / 3600000) % 24,
        minutes: Math.floor(diff / 60000) % 60,
        seconds: Math.floor(diff / 1000) % 60,
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return timeLeft
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-gray-900 text-white text-xl md:text-2xl font-black w-14 h-14 rounded-xl flex items-center justify-center font-mono">
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-gray-500 text-xs mt-1 font-medium">{label}</span>
    </div>
  )
}

export default function FlashSaleSection() {
  const products = getFlashSaleProducts()
  const { hours, minutes, seconds } = useCountdown('2024-03-10T23:59:59Z')

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
              <Zap size={24} className="text-white" fill="white" />
            </div>
            <div>
              <p className="text-orange-500 font-bold text-sm uppercase tracking-wider">Limited Time</p>
              <h2 className="section-title">Flash Sale</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm font-medium">Ends in:</span>
            <div className="flex items-center gap-2">
              <TimeBlock value={hours} label="HRS" />
              <span className="text-2xl font-black text-gray-900 -mt-5">:</span>
              <TimeBlock value={minutes} label="MIN" />
              <span className="text-2xl font-black text-gray-900 -mt-5">:</span>
              <TimeBlock value={seconds} label="SEC" />
            </div>
          </div>

          <Link href="/shop?filter=flash-sale" className="flex items-center gap-2 text-destiny-pink font-semibold text-sm hover:gap-3 transition-all whitespace-nowrap">
            View All Deals <ArrowRight size={18} />
          </Link>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 text-white text-center">
          <h3 className="text-2xl font-black font-display mb-2">Don't Miss Out!</h3>
          <p className="text-white/90 mb-4">Flash sale prices are limited. Shop now before stocks run out.</p>
          <Link
            href="/shop?filter=flash-sale"
            className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors"
          >
            <Zap size={18} fill="currentColor" /> Shop Flash Sale
          </Link>
        </div>
      </div>
    </section>
  )
}
