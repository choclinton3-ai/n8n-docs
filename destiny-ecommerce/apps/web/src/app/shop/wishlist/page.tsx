'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react'
import { useWishlistStore, useCartStore } from '@/store'
import { formatCFA } from '@/lib/data/products'
import toast from 'react-hot-toast'

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore()
  const addToCart = useCartStore(s => s.addItem)

  const handleAddToCart = (product: typeof items[0]) => {
    addToCart(product, 1)
    toast.success(`${product.name} added to cart!`, { style: { background: '#FF007F', color: '#fff' } })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold font-display flex items-center gap-2">
            <Heart className="text-destiny-pink" size={26} /> My Wishlist ({items.length})
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-destiny-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-destiny-pink" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Wishlist is Empty</h2>
            <p className="text-gray-500 mb-8">Save items you love to come back to them later</p>
            <Link href="/shop" className="btn-destiny">Explore Products</Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <Link href="/shop" className="flex items-center gap-2 text-destiny-pink font-medium text-sm hover:underline">
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
              <p className="text-sm text-gray-500">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl shadow-card overflow-hidden group"
                >
                  <Link href={`/shop/products/${product.slug}`}>
                    <div className="relative aspect-square bg-gray-50 overflow-hidden">
                      <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      {product.discount && (
                        <span className="absolute top-2 left-2 badge-sale">-{product.discount}%</span>
                      )}
                    </div>
                  </Link>
                  <div className="p-3">
                    <p className="text-xs text-gray-400 mb-0.5">{product.brand.name}</p>
                    <Link href={`/shop/products/${product.slug}`}>
                      <h3 className="font-semibold text-gray-900 text-xs line-clamp-2 mb-2 hover:text-destiny-pink transition-colors">{product.name}</h3>
                    </Link>
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-sm font-bold text-destiny-pink">{formatCFA(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">{formatCFA(product.originalPrice)}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 py-2 bg-destiny-pink text-white rounded-xl text-xs font-semibold hover:bg-destiny-deep-pink transition-colors flex items-center justify-center gap-1"
                      >
                        <ShoppingCart size={12} /> Add
                      </button>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="w-8 h-8 bg-red-50 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
