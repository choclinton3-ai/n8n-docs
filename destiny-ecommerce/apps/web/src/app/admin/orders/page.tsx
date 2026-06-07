'use client'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/store'
import api from '@/lib/api/client'
import toast from 'react-hot-toast'
import { RefreshCw, Check, X } from 'lucide-react'

const STATUS_BADGE: Record<string, string> = {
  PENDING: 'text-yellow-600 bg-yellow-50', CONFIRMED: 'text-blue-600 bg-blue-50',
  PROCESSING: 'text-indigo-600 bg-indigo-50', SHIPPED: 'text-purple-600 bg-purple-50',
  DELIVERED: 'text-green-600 bg-green-50', CANCELLED: 'text-red-600 bg-red-50',
}

export default function AdminOrdersPage() {
  const { token } = useAuthStore()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => { if (token) load() }, [token, page, statusFilter])

  async function load() {
    setLoading(true)
    try {
      const qs = `?page=${page}&limit=15${statusFilter ? `&status=${statusFilter}` : ''}`
      const res = await api.get<any>(`/orders${qs}`, token!)
      setOrders(res.data)
      setTotalPages(res.totalPages)
    } catch { toast.error('Failed to load orders') }
    finally { setLoading(false) }
  }

  async function updateStatus(id: string, status: string, note?: string) {
    try {
      await api.patch(`/orders/${id}/status`, { status, note }, token!)
      toast.success('Status updated')
      load()
    } catch (err: any) { toast.error(err.message) }
  }

  async function verifyPayment(id: string, approved: boolean) {
    try {
      await api.post(`/orders/${id}/verify-payment`, { approved }, token!)
      toast.success(approved ? 'Payment approved!' : 'Payment rejected')
      load()
    } catch (err: any) { toast.error(err.message) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-black font-display">Orders Management</h1>
        <button onClick={load} className="flex items-center gap-2 text-sm text-gray-500 hover:text-destiny-pink">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>
      <div className="p-6">
        <div className="flex gap-2 mb-4 flex-wrap">
          {['','PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${statusFilter === s ? 'bg-destiny-pink text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-destiny-pink'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="text-left px-5 py-3">Order</th>
                <th className="text-left px-5 py-3">Customer</th>
                <th className="text-left px-5 py-3">Total</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Payment</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-mono font-bold text-destiny-pink text-xs">{order.orderNumber}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium">{order.user?.firstName} {order.user?.lastName}</p>
                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                  </td>
                  <td className="px-5 py-3 font-bold">{Number(order.total).toLocaleString()} FCFA</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${STATUS_BADGE[order.status] || 'text-gray-600 bg-gray-50'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.paymentStatus === 'PAID' ? 'text-green-600 bg-green-50' : order.paymentStatus === 'PENDING' ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      {order.status === 'CONFIRMED' && order.paymentStatus === 'PENDING' && (
                        <>
                          <button onClick={() => verifyPayment(order.id, true)} className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200" title="Approve payment"><Check size={14} /></button>
                          <button onClick={() => verifyPayment(order.id, false)} className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200" title="Reject payment"><X size={14} /></button>
                        </>
                      )}
                      {order.status === 'PROCESSING' && (
                        <button onClick={() => updateStatus(order.id, 'SHIPPED', 'Order shipped')} className="px-2 py-1 rounded-lg bg-purple-100 text-purple-600 text-xs font-bold hover:bg-purple-200">Mark Shipped</button>
                      )}
                      {order.status === 'SHIPPED' && (
                        <button onClick={() => updateStatus(order.id, 'DELIVERED', 'Order delivered')} className="px-2 py-1 rounded-lg bg-green-100 text-green-600 text-xs font-bold hover:bg-green-200">Mark Delivered</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-bold ${p === page ? 'bg-destiny-pink text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
