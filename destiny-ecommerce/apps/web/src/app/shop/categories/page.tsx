'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Search, ArrowRight, Tag } from 'lucide-react'
import { categories, products } from '@/lib/data/products'

const FEATURED = ['smartphones', 'laptops', 'headphones', 'gaming']

export default function CategoriesPage() {
  const [q, setQ] = useState('')

  const filtered = categories.filter(c =>
    !q || c.name.toLowerCase().includes(q.toLowerCase())
  )

  const featured = filtered.filter(c => FEATURED.includes(c.slug))
  const rest = filtered.filter(c => !FEATURED.includes(c.slug))

  const getCount = (slug: string) =>
    products.filter(p => p.category.slug === slug).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-destiny-pink via-destiny-purple to-purple-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-4">
              <Tag size={14} /> Browse all categories
            </div>
            <h1 className="text-3xl md:text-5xl font-bold font-display mb-3">
              Shop by Category
            </h1>
            <p className="text-white/70 text-lg mb-8">
              {categories.length} categories · {products.length} products
            </p>
            <div className="relative max-w-md mx-auto">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={q}
                onChange={e => setQ(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Categories */}
        {featured.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Featured Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="group relative overflow-hidden rounded-2xl bg-white shadow-card block h-52"
                  >
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-2xl mb-0.5">{cat.icon}</p>
                          <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                          <p className="text-white/70 text-xs">
                            {getCount(cat.slug)} products
                          </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 group-hover:bg-destiny-pink transition-colors">
                          <ArrowRight size={16} className="text-white" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* All Categories */}
        {rest.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {q ? `Results for "${q}"` : 'All Categories'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {rest.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="group flex flex-col items-center text-center bg-white rounded-2xl shadow-card p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 block"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 group-hover:bg-destiny-pink/10 flex items-center justify-center text-4xl mb-3 transition-colors">
                      {cat.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-destiny-pink transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-gray-400">{getCount(cat.slug)} products</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-500">Try a different search term</p>
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-destiny-pink to-destiny-purple rounded-3xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Can&apos;t find what you&apos;re looking for?</h2>
          <p className="text-white/70 mb-6">Use our search to find specific products across all categories</p>
          <Link
            href="/shop/search"
            className="inline-flex items-center gap-2 bg-white text-destiny-pink font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Search size={18} /> Search Products
          </Link>
        </div>
      </div>
    </div>
  )
}
