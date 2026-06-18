'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Package, CreditCard, MapPin, Clock, CheckCircle, Truck, AlertCircle } from 'lucide-react'
import CopyButton from '@/components/ui/CopyButton'
import { useAuthStore } from '@/store'
import { ordersApi } from '@/lib/api/orders.api'
import toast from 'react-hot-toast'

const STEPS = ['PENDING','CONFIRMED','PROCESSING','SHIPPED','OUT_FOR_DELIVERY','DELIVERED']
const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b', CONFIRMED: '#3b82f6', PROCESSING: '#6366f1',
  SHIPPED: '#8b5cf6', OUT_FOR_DELIVERY: '#f97316', DELIVERED: '#10b981',
  CANCELLED: '#ef4444', REFUNDED: '#6b7280',
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { token, user } = useAuthStore()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentProof, setPaymentProof] = useState({ transactionId: '', senderNumber: '', amount: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (id && token) loadOrder()
  }, [id, token])

  async function loadOrder() {
    setLoading(true)
    try {
      const data = await ordersApi.getOne(id!, token!)
      setOrder(data)
    } catch {
      toast.error('Order not found')
    } finally {
      setLoading(false)
    }
  }

  async function submitPaymentProof(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await ordersApi.submitPaymentProof({
        orderId: id!,
        transactionId: paymentProof.transactionId,
        senderNumber: paymentProof.senderNumber,
        amount: parseFloat(paymentProof.amount),
      }, token!)
      toast.success('Payment proof submitted! Admin will verify within 30 minutes.')
      setShowPaymentForm(false)
      loadOrder()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center"><Link href="/auth/login" className="btn-destiny">Sign In</Link></div>
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="skeleton w-32 h-8 rounded-xl" /></div>
  if (!order) return <div className="min-h-screen flex items-center justify-center text-gray-500">Order not found</div>

  const stepIndex = STEPS.indexOf(order.status)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <Link href="/shop/orders" className="flex items-center gap-2 text-sm text-gray-500 hover:text-destiny-pink mb-3">
            <ArrowLeft size={16} /> My Orders
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-display">Order {order.orderNumber}</h1>
              <CopyButton text={order.orderNumber} label="order number" />
            </div>
            <span className="px-3 py-1.5 rounded-full text-sm font-bold" style={{ color: STATUS_COLORS[order.status], background: STATUS_COLORS[order.status] + '20' }}>
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        {/* Progress bar */}
        {!['CANCELLED','REFUNDED'].includes(order.status) && (
          <div className="bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-100 mx-6" />
              <div
                className="absolute left-0 top-4 h-0.5 bg-destiny-pink mx-6 transition-all duration-500"
                style={{ width: `${Math.max(0, (stepIndex / (STEPS.length - 1))) * 100}%` }}
              />
              {STEPS.map((step, i) => (
                <div key={step} className="flex flex-col items-center relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i <= stepIndex ? 'bg-destiny-pink text-white' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                    {i < stepIndex ? <CheckCircle size={16} /> : i + 1}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">{step.replace(/_/g, ' ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment proof section */}
        {order.status === 'PENDING' && order.paymentStatus === 'PENDING' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-yellow-800 mb-1">Payment Required</h3>
                <p className="text-sm text-yellow-700 mb-3">
                  Send <strong>{Number(order.total).toLocaleString()} FCFA</strong> via {order.paymentMethod.replace(/_/g, ' ')} and submit your transaction ID below.
                </p>
                {order.paymentMethod === 'MTN_MOBILE_MONEY' && (
                  <div className="bg-white rounded-xl p-3 text-sm mb-3 space-y-1">
                    <p className="font-bold">MTN Mobile Money</p>
                    <p>Number: <strong>653526767</strong></p>
                    <p className="text-xs text-gray-500">Dial: <code>*126*4*1*653526767*{Math.round(Number(order.total))}#</code></p>
                  </div>
                )}
                {order.paymentMethod === 'ORANGE_MONEY' && (
                  <div className="bg-white rounded-xl p-3 text-sm mb-3 space-y-1">
                    <p className="font-bold">Orange Money</p>
                    <p>Number: <strong>640638536</strong></p>
                    <p>Account: <strong>Cho Clinton Teneng</strong></p>
                  </div>
                )}
                <button onClick={() => setShowPaymentForm(!showPaymentForm)} className="btn-destiny text-sm px-4 py-2">
                  Submit Payment Proof
                </button>
              </div>
            </div>

            {showPaymentForm && (
              <form onSubmit={submitPaymentProof} className="mt-4 space-y-3 bg-white rounded-xl p-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Transaction ID *</label>
                  <input value={paymentProof.transactionId} onChange={e => setPaymentProof(p => ({ ...p, transactionId: e.target.value }))} className="input-destiny mt-1" placeholder="e.g. MP211234567890" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Sender Number *</label>
                  <input value={paymentProof.senderNumber} onChange={e => setPaymentProof(p => ({ ...p, senderNumber: e.target.value }))} className="input-destiny mt-1" placeholder="e.g. 6XXXXXXXX" required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Amount Sent (FCFA) *</label>
                  <input type="number" value={paymentProof.amount} onChange={e => setPaymentProof(p => ({ ...p, amount: e.target.value }))} className="input-destiny mt-1" placeholder={String(Math.round(Number(order.total)))} required />
                </div>
                <button type="submit" disabled={submitting} className="btn-destiny w-full text-sm py-2.5">
                  {submitting ? 'Submitting...' : 'Submit Proof'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Order items */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="p-5 border-b border-gray-50">
            <h2 className="font-bold text-gray-900 flex items-center gap-2"><Package size={18} /> Items ({order.items?.length})</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {order.items?.map((item: any) => (
              <div key={item.id} className="p-5 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                  {item.product?.thumbnail && <img src={item.product.thumbnail} alt={item.product.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.product?.name}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity} × {Number(item.price).toLocaleString()} FCFA</p>
                </div>
                <p className="font-bold text-gray-900">{Number(item.total).toLocaleString()} FCFA</p>
              </div>
            ))}
          </div>
          <div className="p-5 bg-gray-50 space-y-2">
            <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>{Number(order.subtotal).toLocaleString()} FCFA</span></div>
            {Number(order.discount) > 0 && <div className="flex justify-between text-sm text-green-600"><span>Coupon Discount</span><span>-{Number(order.discount).toLocaleString()} FCFA</span></div>}
            <div className="flex justify-between text-sm text-gray-600"><span>Shipping</span><span>{Number(order.shipping) === 0 ? 'Free' : `${Number(order.shipping).toLocaleString()} FCFA`}</span></div>
            <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200"><span>Total</span><span>{Number(order.total).toLocaleString()} FCFA</span></div>
          </div>
        </div>

        {/* Delivery updates */}
        {order.deliveryUpdates?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-4"><Truck size={18} /> Delivery Tracking</h2>
            <div className="space-y-3">
              {order.deliveryUpdates.map((upd: any, i: number) => (
                <div key={upd.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-destiny-pink' : 'bg-gray-200'}`} />
                    {i < order.deliveryUpdates.length - 1 && <div className="w-0.5 h-8 bg-gray-100" />}
                  </div>
                  <div className="pb-3">
                    <p className="text-sm font-medium text-gray-900">{upd.status}</p>
                    {upd.location && <p className="text-xs text-gray-500">{upd.location}</p>}
                    {upd.description && <p className="text-xs text-gray-500">{upd.description}</p>}
                    <p className="text-xs text-gray-400 mt-1">{new Date(upd.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shipping address */}
        {order.shippingAddress && (
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-bold text-gray-900 flex items-center gap-2 mb-3"><MapPin size={18} /> Delivery Address</h2>
            <p className="text-sm text-gray-700">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
            <p className="text-sm text-gray-500">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.region}</p>
            <p className="text-sm text-gray-500">{order.shippingAddress.phone}</p>
          </div>
        )}
      </div>
    </div>
  )
}
