'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, Trash2, Tag } from 'lucide-react'
import { useCartStore, useUIStore } from '@/store'
import { formatCFA } from '@/lib/data/products'

export default function CartDrawer() {
  const { cartOpen, setCartOpen } = useUIStore()
  const {
    items, removeItem, updateQuantity, getSubtotal, getTotal,
    couponCode, discount, applyCoupon, removeCoupon, clearCart
  } = useCartStore()
  const [couponInput, setCouponInput] = React.useState('')
  const [couponError, setCouponError] = React.useState('')

  const subtotal = getSubtotal()
  const total = getTotal()
  const shipping = subtotal > 50000 ? 0 : 2500
  const discountAmount = subtotal * (discount / 100)

  const handleCoupon = () => {
    const result = applyCoupon(couponInput)
    if (!result) {
      setCouponError('Invalid coupon code')
      setTimeout(() => setCouponError(''), 3000)
    } else {
      setCouponInput('')
      setCouponError('')
    }
  }

  return (
    <>
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="text-destiny-pink" size={24} />
                  <h2 className="text-xl font-bold font-display text-gray-900">Your Cart</h2>
                  {items.length > 0 && (
                    <span className="bg-destiny-pink text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      {items.reduce((sum, i) => sum + i.quantity, 0)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {items.length > 0 && (
                    <button onClick={clearCart} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                      Clear all
                    </button>
                  )}
                  <button onClick={() => setCartOpen(false)} className="p-2 text-gray-500 hover:text-destiny-pink transition-colors">
                    <X size={22} />
                  </button>
                </div>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-20 h-20 bg-destiny-50 rounded-full flex items-center justify-center mb-4">
                      <ShoppingBag className="text-destiny-pink" size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 text-sm mb-6">Add items to your cart to get started</p>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="btn-destiny"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map(item => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex gap-4 p-4 bg-gray-50 rounded-2xl"
                      >
                        <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                          <img
                            src={item.product.thumbnail}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight mb-1">
                            {item.product.name}
                          </h4>
                          {item.variant && (
                            <p className="text-xs text-gray-500 mb-2">{item.variant.name}: {item.variant.value}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-destiny-pink font-bold text-sm">
                              {formatCFA(item.price)}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-destiny-pink hover:text-destiny-pink transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 rounded-lg bg-destiny-pink text-white flex items-center justify-center hover:bg-destiny-deep-pink transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="w-7 h-7 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors ml-1"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-gray-100 p-6 space-y-4">
                  {/* Coupon */}
                  {!couponCode ? (
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Coupon code"
                          value={couponInput}
                          onChange={e => setCouponInput(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-destiny-pink"
                        />
                      </div>
                      <button onClick={handleCoupon} className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
                        Apply
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-2.5">
                      <span className="text-green-700 text-sm font-semibold flex items-center gap-2">
                        <Tag size={14} /> {couponCode} — {discount}% OFF
                      </span>
                      <button onClick={removeCoupon} className="text-gray-400 hover:text-red-500 transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-red-500 text-xs">{couponError}</p>}

                  {/* Totals */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span><span>{formatCFA(subtotal)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({discount}%)</span><span>-{formatCFA(discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? <span className="text-green-600 font-medium">Free</span> : formatCFA(shipping)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                      <span>Total</span><span className="text-destiny-pink">{formatCFA(total)}</span>
                    </div>
                  </div>

                  <Link
                    href="/shop/checkout"
                    onClick={() => setCartOpen(false)}
                    className="w-full btn-destiny text-center block"
                  >
                    Proceed to Checkout
                  </Link>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="w-full text-center text-sm text-gray-500 hover:text-destiny-pink transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
