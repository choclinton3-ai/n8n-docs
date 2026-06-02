'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star, Eye, Zap } from 'lucide-react'
import { Product } from '@/types'
import { useCartStore, useWishlistStore } from '@/store'
import { formatCFA } from '@/lib/data/products'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact' | 'horizontal'
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const addToCart = useCartStore(s => s.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    toast.success(`${product.name} added to cart!`, {
      style: { background: '#FF007F', color: '#fff' },
      iconTheme: { primary: '#fff', secondary: '#FF007F' },
    })
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleItem(product)
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!', {
      style: { background: inWishlist ? '#6b7280' : '#FF007F', color: '#fff' },
    })
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/shop/products/${product.slug}`} className="flex gap-4 p-4 bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 group">
        <div className="w-28 h-28 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
          <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{product.name}</h3>
            <button onClick={handleWishlist} className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${inWishlist ? 'text-destiny-pink' : 'text-gray-300 hover:text-destiny-pink'}`}>
              <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className={i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="font-bold text-destiny-pink">{formatCFA(product.price)}</span>
            {product.originalPrice && (
              <span className="text-gray-400 line-through text-xs">{formatCFA(product.originalPrice)}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="mt-2 px-4 py-1.5 bg-destiny-pink text-white rounded-lg text-xs font-semibold hover:bg-destiny-deep-pink transition-colors disabled:opacity-50"
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </Link>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="product-card group relative"
    >
      <Link href={`/shop/products/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-square bg-gray-50">
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="badge-sale bg-green-500">NEW</span>
            )}
            {product.discount && product.discount > 0 && (
              <span className="badge-sale">-{product.discount}%</span>
            )}
            {product.isFlashSale && (
              <span className="badge-sale bg-orange-500 flex items-center gap-0.5">
                <Zap size={10} fill="currentColor" /> SALE
              </span>
            )}
            {product.isBestSeller && (
              <span className="badge-sale bg-blue-500">🏆 TOP</span>
            )}
          </div>

          {/* Actions Overlay */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
            <button
              onClick={handleWishlist}
              className={`w-9 h-9 rounded-xl shadow-lg flex items-center justify-center transition-all ${
                inWishlist
                  ? 'bg-destiny-pink text-white'
                  : 'bg-white text-gray-600 hover:bg-destiny-pink hover:text-white'
              }`}
            >
              <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
            <Link
              href={`/shop/products/${product.slug}`}
              onClick={e => e.stopPropagation()}
              className="w-9 h-9 bg-white text-gray-600 hover:bg-destiny-pink hover:text-white rounded-xl shadow-lg flex items-center justify-center transition-all"
            >
              <Eye size={16} />
            </Link>
          </div>

          {/* Stock Badge */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg">Out of Stock</span>
            </div>
          )}

          {product.inStock && product.stock <= 10 && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-lg">Only {product.stock} left!</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-1 mb-1.5">
            <span className="text-xs text-gray-400 font-medium">{product.brand.name}</span>
          </div>

          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-destiny-pink">{formatCFA(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">{formatCFA(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full py-2.5 bg-destiny-pink text-white rounded-xl text-sm font-semibold hover:bg-destiny-deep-pink transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-destiny hover:shadow-destiny-lg active:scale-95"
        >
          <ShoppingCart size={16} />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </motion.div>
  )
}
