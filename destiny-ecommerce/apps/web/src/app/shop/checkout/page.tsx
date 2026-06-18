'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronRight, ShieldCheck, Smartphone, CreditCard, Truck, CheckCircle, AlertCircle } from 'lucide-react'
import CopyButton from '@/components/ui/CopyButton'
import { useCartStore, useAuthStore } from '@/store'
import { formatCFA } from '@/lib/data/products'
import { ordersApi } from '@/lib/api/orders.api'
import toast from 'react-hot-toast'

const PAYMENT_METHODS = [
  { id: 'MTN_MOBILE_MONEY', name: 'MTN Mobile Money', icon: '📱', color: '#FFCC00', description: 'Pay with MTN MoMo — 653526767' },
  { id: 'ORANGE_MONEY', name: 'Orange Money', icon: '🟠', color: '#FF6600', description: 'Pay with Orange Money — 640638536' },
  { id: 'VISA', name: 'Visa / Mastercard', icon: '💳', color: '#1A1F71', description: 'International cards (coming soon)' },
  { id: 'PAYPAL', name: 'PayPal', icon: '🅿️', color: '#003087', description: 'Pay via PayPal (coming soon)' },
  { id: 'CASH_ON_DELIVERY', name: 'Cash on Delivery', icon: '💵', color: '#10b981', description: 'Pay when delivered' },
]

type Step = 'info' | 'shipping' | 'payment' | 'review' | 'success'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, getTotal, discount, couponCode, clearCart } = useCartStore()
  const { token, user } = useAuthStore()
  const [step, setStep] = useState<Step>('info')
  const [selectedPayment, setSelectedPayment] = useState('MTN_MOBILE_MONEY')
  const [placedOrder, setPlacedOrder] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    firstName: user?.firstName || '', lastName: user?.lastName || '',
    email: user?.email || '', phone: user?.phone || '',
    street: '', city: '', region: '', country: 'Cameroon', notes: '',
  })

  const subtotal = getSubtotal()
  const total = getTotal()
  const shipping = subtotal > 50000 ? 0 : 2500
  const discountAmount = subtotal * (discount / 100)

  const handleField = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 'info') { setStep('shipping'); return }
    if (step === 'shipping') { setStep('payment'); return }
    if (step === 'payment') { setStep('review'); return }
    if (step === 'review') {
      if (!token) { toast.error('Please sign in to place an order'); router.push('/auth/login'); return }
      setSubmitting(true)
      try {
        const order = await ordersApi.create({
          items: items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
          paymentMethod: selectedPayment,
          shippingAddress: { firstName: form.firstName, lastName: form.lastName, phone: form.phone, street: form.street, city: form.city, region: form.region, country: form.country },
          couponCode: couponCode || undefined,
          notes: form.notes || undefined,
        }, token)
        setPlacedOrder(order)
        clearCart()
        setStep('success')
      } catch (err: any) {
        toast.error(err.message || 'Failed to place order. Please try again.')
      } finally {
        setSubmitting(false)
      }
    }
  }

  const steps = [
    { id: 'info', label: 'Your Info', number: 1 },
    { id: 'shipping', label: 'Delivery', number: 2 },
    { id: 'payment', label: 'Payment', number: 3 },
    { id: 'review', label: 'Review', number: 4 },
  ]

  if (step === 'success' && placedOrder) {
    const isMoMo = ['MTN_MOBILE_MONEY', 'ORANGE_MONEY'].includes(selectedPayment)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-lg w-full">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-black font-display text-gray-900 mb-2">Order Placed!</h2>
          <div className="flex items-center justify-center gap-2 mb-1">
            <p className="font-mono text-destiny-pink font-bold text-lg">{placedOrder.orderNumber}</p>
            <CopyButton text={placedOrder.orderNumber} label="order number" />
          </div>
          <p className="text-gray-500 text-sm mb-6">Your order has been received. Now complete payment below.</p>

          {isMoMo && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-6 text-left">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={18} className="text-yellow-600" />
                <p className="font-bold text-yellow-800">Complete Your Payment</p>
              </div>
              {selectedPayment === 'MTN_MOBILE_MONEY' ? (
                <div className="space-y-1.5 text-sm text-yellow-800">
                  <p className="flex items-center gap-2 flex-wrap">
                    1. Dial{' '}
                    <code className="bg-yellow-100 px-1.5 py-0.5 rounded font-mono">
                      *126*4*1*653526767*{Math.round(Number(placedOrder.total))}#
                    </code>
                    <CopyButton text={`*126*4*1*653526767*${Math.round(Number(placedOrder.total))}#`} label="USSD code" variant="pill" />
                  </p>
                  <p>2. OR: MTN MoMo app → Send Money → <strong>653526767</strong></p>
                  <p>3. Amount: <strong>{Number(placedOrder.total).toLocaleString()} FCFA</strong></p>
                  <p className="flex items-center gap-2">
                    4. Note:{' '}<strong>{placedOrder.orderNumber}</strong>
                    <CopyButton text={placedOrder.orderNumber} label="order number" variant="inline" />
                  </p>
                  <p>5. After payment, go to <Link href={`/shop/orders/${placedOrder.id}`} className="underline font-bold">My Orders</Link> → Submit transaction ID</p>
                </div>
              ) : (
                <div className="space-y-1.5 text-sm text-yellow-800">
                  <p className="flex items-center gap-2 flex-wrap">
                    1. Dial{' '}
                    <code className="bg-yellow-100 px-1.5 py-0.5 rounded font-mono">#150*1#</code>
                    <CopyButton text="#150*1#" label="USSD code" variant="pill" />
                    or open Orange Money app
                  </p>
                  <p>2. Send to: <strong>640638536</strong> (Cho Clinton Teneng)</p>
                  <p>3. Amount: <strong>{Number(placedOrder.total).toLocaleString()} FCFA</strong></p>
                  <p className="flex items-center gap-2">
                    4. Note:{' '}<strong>{placedOrder.orderNumber}</strong>
                    <CopyButton text={placedOrder.orderNumber} label="order number" variant="inline" />
                  </p>
                  <p>5. After payment, go to <Link href={`/shop/orders/${placedOrder.id}`} className="underline font-bold">My Orders</Link> → Submit transaction ID</p>
                </div>
              )}
            </div>
          )}

          <div className="bg-destiny-50 rounded-2xl p-4 mb-6 text-sm">
            <p className="font-semibold text-gray-900 mb-1">Estimated Delivery</p>
            <p className="text-gray-600">Douala/Yaoundé: 24–48 hours · Other cities: 2–5 business days</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={`/shop/orders/${placedOrder.id}`} className="flex-1 btn-destiny text-center">Track Order</Link>
            <Link href="/shop" className="flex-1 py-3 border-2 border-destiny-pink text-destiny-pink rounded-xl font-semibold text-center hover:bg-destiny-50">Continue Shopping</Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold font-display mb-4">Secure Checkout</h1>

          {/* Progress Steps */}
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <React.Fragment key={s.id}>
                <div className={`flex items-center gap-2 text-sm font-medium ${
                  s.id === step ? 'text-destiny-pink' : steps.findIndex(x => x.id === step) > i ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                    s.id === step ? 'border-destiny-pink bg-destiny-pink text-white' :
                    steps.findIndex(x => x.id === step) > i ? 'border-green-500 bg-green-500 text-white' :
                    'border-gray-300 text-gray-400'
                  }`}>
                    {steps.findIndex(x => x.id === step) > i ? '✓' : s.number}
                  </div>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 ${steps.findIndex(x => x.id === step) > i ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            {/* Step: Customer Info */}
            {step === 'info' && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Customer Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'firstName', label: 'First Name', type: 'text', required: true },
                    { key: 'lastName', label: 'Last Name', type: 'text', required: true },
                    { key: 'email', label: 'Email Address', type: 'email', required: true, full: true },
                    { key: 'phone', label: 'Phone Number (+237)', type: 'tel', required: true, full: true },
                  ].map(field => (
                    <div key={field.key} className={field.full ? 'col-span-2' : 'col-span-1'}>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{field.label} {field.required && '*'}</label>
                      <input
                        type={field.type}
                        required={field.required}
                        value={form[field.key as keyof typeof form]}
                        onChange={e => handleField(field.key, e.target.value)}
                        className="input-destiny"
                        placeholder={field.label}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step: Shipping */}
            {step === 'shipping' && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Delivery Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'street', label: 'Street Address', type: 'text', required: true, full: true },
                    { key: 'city', label: 'City', type: 'text', required: true },
                    { key: 'region', label: 'Region', type: 'text', required: true },
                  ].map(field => (
                    <div key={field.key} className={field.full ? 'col-span-2' : 'col-span-1'}>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{field.label} *</label>
                      <input
                        type={field.type}
                        required={field.required}
                        value={form[field.key as keyof typeof form]}
                        onChange={e => handleField(field.key, e.target.value)}
                        className="input-destiny"
                        placeholder={field.label}
                      />
                    </div>
                  ))}
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Country</label>
                    <input type="text" value="Cameroon" readOnly className="input-destiny bg-gray-50 cursor-not-allowed" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Order Notes (optional)</label>
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={e => handleField('notes', e.target.value)}
                      placeholder="Any special instructions for your order..."
                      className="input-destiny resize-none"
                    />
                  </div>
                </div>

                {/* Delivery Options */}
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Delivery Option</h3>
                  <div className="space-y-3">
                    {[
                      { id: 'standard', label: 'Standard Delivery', sub: '2–5 business days', price: shipping, icon: Truck },
                      { id: 'express', label: 'Express Delivery (Douala/Yaoundé)', sub: '24–48 hours', price: 5000, icon: Truck },
                    ].map(opt => (
                      <label key={opt.id} className="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-xl cursor-pointer hover:border-destiny-pink transition-colors has-[:checked]:border-destiny-pink has-[:checked]:bg-destiny-50">
                        <input type="radio" name="delivery" defaultChecked={opt.id === 'standard'} className="accent-destiny-pink" />
                        <opt.icon size={20} className="text-destiny-pink" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-900">{opt.label}</p>
                          <p className="text-xs text-gray-500">{opt.sub}</p>
                        </div>
                        <span className="font-bold text-destiny-pink">
                          {opt.price === 0 ? 'Free' : formatCFA(opt.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step: Payment */}
            {step === 'payment' && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Payment Method</h2>
                <div className="space-y-3">
                  {paymentMethods.map(method => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedPayment === method.id ? 'border-destiny-pink bg-destiny-50' : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={() => setSelectedPayment(method.id)}
                        className="accent-destiny-pink"
                      />
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{method.name}</p>
                        <p className="text-xs text-gray-500">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {selectedPayment === 'mtn' && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-xl text-sm text-yellow-800">
                    📱 You'll receive a push notification on your MTN number to confirm payment.
                  </div>
                )}
                {selectedPayment === 'orange' && (
                  <div className="mt-4 p-4 bg-orange-50 rounded-xl text-sm text-orange-800">
                    🟠 You'll receive an USSD prompt on your Orange number to confirm payment.
                  </div>
                )}
                <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                  <ShieldCheck size={16} className="text-green-500" />
                  Your payment information is encrypted and secure
                </div>
              </motion.div>
            )}

            {/* Step: Review */}
            {step === 'review' && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Order Review</h2>
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4 py-3 border-b border-gray-50 last:border-0">
                      <img src={item.product.thumbnail} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover bg-gray-50" />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900 line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-destiny-pink">{formatCFA(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Delivery to</span><span className="font-medium">{form.city}, {form.region}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Payment</span><span className="font-medium">{paymentMethods.find(m => m.id === selectedPayment)?.name}</span></div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                    <span>Total</span><span className="text-destiny-pink">{formatCFA(total)}</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex gap-4">
              {step !== 'info' && (
                <button
                  type="button"
                  onClick={() => {
                    const idx = steps.findIndex(s => s.id === step)
                    setStep(steps[idx - 1].id as Step)
                  }}
                  className="px-6 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:border-gray-300 transition-colors"
                >
                  Back
                </button>
              )}
              <button type="submit" disabled={submitting} className="flex-1 btn-destiny flex items-center justify-center gap-2">
                {submitting ? 'Placing Order...' : step === 'review' ? 'Place Order' : 'Continue'} {!submitting && <ChevronRight size={20} />}
              </button>
            </div>
          </form>

          {/* Order Summary Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3 mb-5 max-h-52 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <img src={item.product.thumbnail} alt={item.product.name} className="w-12 h-12 rounded-xl object-cover bg-gray-50 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-xs line-clamp-2">{item.product.name}</p>
                      <p className="text-gray-400 text-xs mt-0.5">× {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-destiny-pink text-xs whitespace-nowrap">{formatCFA(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatCFA(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatCFA(discountAmount)}</span></div>}
                <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatCFA(shipping)}</span></div>
                <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                  <span>Total</span><span className="text-destiny-pink">{formatCFA(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
