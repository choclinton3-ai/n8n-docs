'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Star, Heart, ShoppingCart, Share2, Shield, Truck,
  RefreshCw, ChevronRight, Minus, Plus, ZoomIn
} from 'lucide-react'
import { getProductBySlug, products, formatCFA } from '@/lib/data/products'
import { useCartStore, useWishlistStore } from '@/store'
import ProductCard from '@/components/product/ProductCard'
import toast from 'react-hot-toast'

interface Props {
  params: { slug: string }
}

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug)
  if (!product) notFound()

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')

  const addToCart = useCartStore(s => s.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(product.id)

  const related = products.filter(p => p.category.id === product.category.id && p.id !== product.id).slice(0, 4)

  const handleAddToCart = () => {
    addToCart(product, quantity)
    toast.success(`${product.name} added to cart!`, {
      style: { background: '#FF007F', color: '#fff' },
    })
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    window.location.href = '/shop/checkout'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-destiny-pink transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/shop" className="hover:text-destiny-pink transition-colors">Shop</Link>
            <ChevronRight size={14} />
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-destiny-pink transition-colors">
              {product.category.name}
            </Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-card aspect-square mb-4 group cursor-zoom-in">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white transition-colors shadow">
                <ZoomIn size={18} className="text-gray-600" />
              </button>
              {product.discount && product.discount > 0 && (
                <div className="absolute top-4 left-4 badge-sale text-base px-3 py-1.5">
                  -{product.discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-destiny-pink shadow-destiny' : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {/* Brand */}
            <Link href={`/shop?brand=${product.brand.slug}`} className="inline-flex items-center gap-2 text-sm text-destiny-pink font-semibold hover:underline mb-2">
              {product.brand.name}
            </Link>

            <h1 className="text-2xl md:text-3xl font-black font-display text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} className={i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                  ))}
                </div>
                <span className="font-semibold text-gray-900">{product.rating}</span>
              </div>
              <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
              <span className="text-sm text-gray-500">{product.soldCount.toLocaleString()} sold</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 p-4 bg-destiny-50 rounded-2xl">
              <span className="text-3xl font-black text-destiny-pink">{formatCFA(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through">{formatCFA(product.originalPrice)}</span>
              )}
              {product.discount && product.discount > 0 && (
                <span className="bg-destiny-pink text-white text-sm font-bold px-2.5 py-1 rounded-lg">
                  Save {product.discount}%
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">{product.shortDescription}</p>

            {/* Stock & Warranty */}
            <div className="flex flex-wrap gap-3 mb-6">
              {product.inStock ? (
                <span className="inline-flex items-center gap-1.5 text-green-700 bg-green-50 px-3 py-1.5 rounded-xl text-sm font-semibold">
                  ✓ In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-red-700 bg-red-50 px-3 py-1.5 rounded-xl text-sm font-semibold">
                  ✗ Out of Stock
                </span>
              )}
              {product.warranty && (
                <span className="inline-flex items-center gap-1.5 text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl text-sm font-semibold">
                  🛡️ {product.warranty}
                </span>
              )}
            </div>

            {/* Quantity & Actions */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center hover:text-destiny-pink transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 rounded-lg bg-destiny-pink text-white flex items-center justify-center hover:bg-destiny-deep-pink transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => toggleItem(product)}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                  inWishlist ? 'border-destiny-pink bg-destiny-pink text-white' : 'border-gray-200 text-gray-500 hover:border-destiny-pink hover:text-destiny-pink'
                }`}
              >
                <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
              <button
                className="w-12 h-12 rounded-xl border-2 border-gray-200 text-gray-500 hover:border-destiny-pink hover:text-destiny-pink flex items-center justify-center transition-all"
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }}
              >
                <Share2 size={20} />
              </button>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-destiny-pink text-white rounded-2xl font-bold text-base hover:bg-destiny-deep-pink transition-all shadow-destiny hover:shadow-destiny-lg disabled:opacity-40 active:scale-95"
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-2xl font-bold text-base hover:bg-gray-800 transition-all disabled:opacity-40 active:scale-95"
              >
                Buy Now
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Truck, text: 'Fast Delivery', sub: '1-3 days' },
                { icon: Shield, text: 'Authentic', sub: '100% Genuine' },
                { icon: RefreshCw, text: 'Easy Returns', sub: '30 days' },
              ].map(({ icon: Icon, text, sub }) => (
                <div key={text} className="flex flex-col items-center p-3 bg-gray-50 rounded-xl text-center">
                  <Icon size={20} className="text-destiny-pink mb-1" />
                  <span className="text-xs font-semibold text-gray-900">{text}</span>
                  <span className="text-xs text-gray-500">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-card overflow-hidden mb-12">
          <div className="flex border-b border-gray-100">
            {['description', 'specifications', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? 'text-destiny-pink border-b-2 border-destiny-pink bg-destiny-50'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-6 md:p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed text-base">{product.description}</p>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specifications.map(spec => (
                  <div key={spec.label} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <span className="text-sm font-bold text-gray-900 min-w-36">{spec.label}</span>
                    <span className="text-sm text-gray-600">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center gap-6 mb-8 p-6 bg-gray-50 rounded-2xl">
                  <div className="text-center">
                    <div className="text-5xl font-black text-destiny-pink">{product.rating}</div>
                    <div className="flex justify-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">{product.reviewCount} reviews</div>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map(star => (
                      <div key={star} className="flex items-center gap-3 mb-1">
                        <span className="text-xs text-gray-500 w-4">{star}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-amber-400 h-2 rounded-full"
                            style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 w-8">{star === 5 ? '70%' : star === 4 ? '20%' : star === 3 ? '7%' : star === 2 ? '2%' : '1%'}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-center text-gray-500 text-sm">Reviews are coming soon. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="section-title mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
