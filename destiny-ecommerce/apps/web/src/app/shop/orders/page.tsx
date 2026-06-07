'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Package, ChevronRight, ShoppingBag } from 'lucide-react'
import { useAuthStore } from '@/store'
import { ordersApi } from '@/lib/api/orders.api'
import toast from 'react-hot-toast'

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'text-yellow-600 bg-yellow-50',
  CONFIRMED: 'text-blue-600 bg-blue-50',
  PROCESSING: 'text-indigo-600 bg-indigo-50',
  SHIPPED: 'text-purple-600 bg-purple-50',
  OUT_FOR_DELIVERY: 'text-orange-600 bg-orange-50',
  DELIVERED: 'text-green-600 bg-green-50',
  CANCELLED: 'text-red-600 bg-red-50',
  REFUNDED: 'text-gray-600 bg-gray-50',
}

export default function OrdersPage() {
  const { user, token } = useAuthStore()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!token) return
    loadOrders()
  }, [token, page])

  async function loadOrders() {
    setLoading(true)
    try {
      const res = await ordersApi.getAll(token!, { page, limit: 10 })
      setOrders(res.data)
      setTotalPages(res.totalPages)
    } catch (err: any) {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Please sign in to view your orders</p>
          <Link href="/auth/login" className="btn-destiny">Sign In</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold font-display flex items-center gap-2">
            <Package size={24} className="text-destiny-pink" /> My Orders
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
          </div>
        ) : orders.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <ShoppingBag size={64} className="text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h3>
            <p className="text-gray-400 mb-6">Start shopping to see your orders here</p>
            <Link href="/shop" className="btn-destiny">Browse Products</Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-card overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-mono font-bold text-destiny-pink">{order.orderNumber}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' · '}{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{Number(order.total).toLocaleString()} FCFA</p>
                      <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status] || 'text-gray-600 bg-gray-50'}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    {order.items?.slice(0, 3).map((item: any) => (
                      <div key={item.id} className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.product?.thumbnail && (
                          <img src={item.product.thumbnail} alt={item.product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-bold flex-shrink-0">
                        +{order.items.length - 3}
                      </div>
                    )}
                    <Link
                      href={`/shop/orders/${order.id}`}
                      className="ml-auto flex items-center gap-1 text-sm text-destiny-pink font-medium hover:underline"
                    >
                      View Details <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-bold transition-colors ${p === page ? 'bg-destiny-pink text-white' : 'bg-white text-gray-600 hover:border-destiny-pink border border-gray-200'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
