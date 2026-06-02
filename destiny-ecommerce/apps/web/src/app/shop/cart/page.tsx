'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, Trash2, Plus, Minus, Tag, Truck, ArrowLeft, ShieldCheck } from 'lucide-react'
import { useCartStore } from '@/store'
import { formatCFA } from '@/lib/data/products'

export default function CartPage() {
  const {
    items, removeItem, updateQuantity, getSubtotal, getTotal,
    couponCode, discount, applyCoupon, removeCoupon, clearCart
  } = useCartStore()
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState(false)

  const subtotal = getSubtotal()
  const total = getTotal()
  const shipping = subtotal > 50000 ? 0 : 2500
  const discountAmount = subtotal * (discount / 100)

  const handleCoupon = () => {
    const result = applyCoupon(couponInput)
    if (result) {
      setCouponSuccess(true)
      setCouponError('')
      setCouponInput('')
    } else {
      setCouponError('Invalid coupon code. Try DESTINY10, WELCOME20, FLASH15')
      setCouponSuccess(false)
    }
    setTimeout(() => { setCouponError(''); setCouponSuccess(false) }, 4000)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-destiny-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-destiny-pink" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8">Add some products to your cart to continue shopping</p>
          <Link href="/shop" className="btn-destiny">Start Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold font-display">Shopping Cart ({items.reduce((s, i) => s + i.quantity, 0)} items)</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Clear Cart */}
            <div className="flex items-center justify-between">
              <Link href="/shop" className="flex items-center gap-2 text-sm text-destiny-pink font-medium hover:underline">
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
              <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
                Clear all items
              </button>
            </div>

            {items.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl shadow-card p-5 flex gap-5"
              >
                <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.product.thumbnail} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-destiny-pink font-semibold mb-1">{item.product.brand.name}</p>
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{item.product.name}</h3>
                      {item.variant && (
                        <p className="text-xs text-gray-500 mt-1">{item.variant.name}: {item.variant.value}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:border-destiny-pink hover:text-destiny-pink transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-destiny-pink text-white flex items-center justify-center hover:bg-destiny-deep-pink transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-destiny-pink">{formatCFA(item.price * item.quantity)}</div>
                      {item.quantity > 1 && (
                        <div className="text-xs text-gray-400">{formatCFA(item.price)} each</div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="text-destiny-pink" size={18} /> Promo Code
              </h3>
              {couponCode ? (
                <div className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-3">
                  <span className="text-green-700 font-semibold text-sm">
                    🎉 {couponCode} — {discount}% OFF applied!
                  </span>
                  <button onClick={removeCoupon} className="text-gray-400 hover:text-red-500 text-sm">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. DESTINY10)"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCoupon()}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-destiny-pink"
                  />
                  <button
                    onClick={handleCoupon}
                    className="px-4 py-3 bg-destiny-pink text-white rounded-xl font-semibold text-sm hover:bg-destiny-deep-pink transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
              {couponSuccess && <p className="text-green-600 text-xs mt-2">Coupon applied successfully!</p>}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h3 className="font-bold text-gray-900 mb-5">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span><span className="font-medium">{formatCFA(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount ({discount}%)</span>
                    <span className="font-medium">-{formatCFA(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? <span className="text-green-600 font-semibold">Free 🎉</span> : formatCFA(shipping)}
                  </span>
                </div>
                {subtotal < 50000 && (
                  <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-2">
                    Add {formatCFA(50000 - subtotal)} more to get free shipping!
                  </p>
                )}
                <div className="flex justify-between font-bold text-gray-900 text-base pt-3 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-destiny-pink text-lg">{formatCFA(total)}</span>
                </div>
              </div>

              <Link
                href="/shop/checkout"
                className="w-full btn-destiny text-center block mt-6"
              >
                Proceed to Checkout
              </Link>

              {/* Security */}
              <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 justify-center">
                <ShieldCheck size={14} className="text-green-500" />
                Secure SSL encrypted checkout
              </div>

              {/* Payment Methods */}
              <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                {['MTN', 'OM', 'VISA', 'MC', 'PP'].map(m => (
                  <span key={m} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded">{m}</span>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-destiny-50 rounded-2xl p-4 flex items-start gap-3">
              <Truck className="text-destiny-pink flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-gray-900 text-sm">Estimated Delivery</p>
                <p className="text-gray-600 text-xs mt-1">Douala & Yaoundé: 24–48 hours<br />Other cities: 2–5 business days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
