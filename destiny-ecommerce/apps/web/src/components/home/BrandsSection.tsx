'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { brands } from '@/lib/data/products'

export default function BrandsSection() {
  return (
    <section className="py-12 md:py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-destiny-pink font-semibold text-sm uppercase tracking-wider mb-2">Official Distributors</p>
          <h2 className="section-title">Top Brands</h2>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-6">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/shop?brand=${brand.slug}`}
                className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-destiny-50 hover:border-destiny-pink border-2 border-transparent rounded-2xl transition-all duration-300 group h-20"
              >
                <span className="text-sm font-black text-gray-700 group-hover:text-destiny-pink transition-colors text-center leading-tight">
                  {brand.name}
                </span>
                <span className="text-xs text-gray-400 mt-1">{brand.productCount} products</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
