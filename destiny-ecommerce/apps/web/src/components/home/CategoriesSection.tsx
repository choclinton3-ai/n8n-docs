'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { categories } from '@/lib/data/products'

export default function CategoriesSection() {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-destiny-pink font-semibold text-sm uppercase tracking-wider mb-2">Browse by Category</p>
          <h2 className="section-title">Shop by Category</h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">Find exactly what you're looking for. We carry the largest selection of electronics in Cameroon.</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                href={`/shop?category=${cat.slug}`}
                className="flex flex-col items-center p-4 bg-white rounded-2xl shadow-card hover:shadow-card-hover hover:border-destiny-pink border-2 border-transparent transition-all duration-300 group text-center"
              >
                <div className="w-14 h-14 bg-destiny-50 group-hover:bg-destiny-pink rounded-2xl flex items-center justify-center text-2xl mb-3 transition-all duration-300">
                  {cat.icon}
                </div>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-destiny-pink transition-colors line-clamp-1">
                  {cat.name}
                </span>
                <span className="text-xs text-gray-400 mt-0.5">{cat.productCount}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
