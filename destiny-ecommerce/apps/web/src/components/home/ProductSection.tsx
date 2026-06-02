'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { Product } from '@/types'

interface ProductSectionProps {
  title: string
  subtitle?: string
  products: Product[]
  viewAllLink?: string
  viewAllLabel?: string
  accent?: boolean
  columns?: 2 | 3 | 4 | 5
}

export default function ProductSection({
  title,
  subtitle,
  products,
  viewAllLink = '/shop',
  viewAllLabel = 'View All',
  accent = false,
  columns = 4,
}: ProductSectionProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  }[columns]

  return (
    <section className={`py-12 md:py-16 ${accent ? 'bg-destiny-50' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            {subtitle && (
              <p className="text-destiny-pink font-semibold text-sm uppercase tracking-wider mb-1">{subtitle}</p>
            )}
            <h2 className="section-title">{title}</h2>
          </div>
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="flex items-center gap-2 text-destiny-pink font-semibold text-sm hover:gap-3 transition-all"
            >
              {viewAllLabel}
              <ArrowRight size={18} />
            </Link>
          )}
        </div>

        {/* Products Grid */}
        <motion.div
          className={`grid ${gridCols} gap-4 md:gap-6`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.05 }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
