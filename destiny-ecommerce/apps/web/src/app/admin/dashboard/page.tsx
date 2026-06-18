'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TrendingUp, ShoppingBag, Users, Package, CreditCard, Store, AlertTriangle, ArrowUpRight, ArrowDownRight, Clock, Truck, RefreshCw } from 'lucide-react'
import { useAuthStore } from '@/store'
import api from '@/lib/api/client'

function StatCard({ title, value, sub, icon: Icon, color, trend }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={22} className="text-white" />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-bold ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="text-sm font-semibold text-gray-700 mt-1">{title}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </motion.div>
  )
}

export default function AdminDashboardPage() {
  const { token, user } = useAuthStore()
  const [stats, setStats] = useState<any>(null)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => { if (token) loadData() }, [token])

  async function loadData() {
    setRefreshing(true)
    try {
      const [s, orders] = await Promise.all([
        api.get<any>('/admin/dashboard', token!),
        api.get<any[]>('/admin/recent-orders?limit=5', token!),
      ])
      setStats(s)
      setRecentOrders(orders)
    } catch { /* API not connected yet — shows empty state */ }
    finally { setLoading(false); setRefreshing(false) }
  }

  const STATUS_BADGE: Record<string, string> = {
    PENDING: 'text-yellow-600 bg-yellow-50', CONFIRMED: 'text-blue-600 bg-blue-50',
    PROCESSING: 'text-indigo-600 bg-indigo-50', SHIPPED: 'text-purple-600 bg-purple-50',
    DELIVERED: 'text-green-600 bg-green-50', CANCELLED: 'text-red-600 bg-red-50',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black font-display">Admin Dashboard</h1>
          <p className="text-xs text-gray-400">Welcome, {user?.firstName}. Live data from your database.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="flex items-center gap-2 text-sm text-gray-500 hover:text-destiny-pink">
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} /> Refresh
          </button>
          <Link href="/admin/orders" className="btn-destiny text-sm px-4 py-2">View Orders</Link>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
          </div>
        ) : stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Revenue" value={`${(stats.revenue.total/1000).toFixed(0)}K FCFA`} sub={`${(stats.revenue.thisMonth/1000).toFixed(0)}K this month`} icon={TrendingUp} color="bg-destiny-gradient" trend={stats.revenue.growth} />
            <StatCard title="Orders" value={stats.orders.total.toLocaleString()} sub={`${stats.orders.pending} pending`} icon={ShoppingBag} color="bg-blue-500" />
            <StatCard title="Customers" value={stats.users.total.toLocaleString()} sub={`+${stats.users.newThisMonth} this month`} icon={Users} color="bg-purple-500" />
            <StatCard title="Products" value={stats.products.total.toLocaleString()} sub={stats.products.lowStock > 0 ? `⚠ ${stats.products.lowStock} low stock` : 'All stocked'} icon={Package} color={stats.products.lowStock > 0 ? 'bg-orange-500' : 'bg-green-500'} />
          </div>
        )}

        {stats?.payments?.pending > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center gap-3">
            <AlertTriangle size={20} className="text-yellow-600" />
            <div className="flex-1">
              <p className="font-bold text-yellow-800">{stats.payments.pending} payment{stats.payments.pending !== 1 ? 's' : ''} awaiting verification</p>
              <p className="text-sm text-yellow-600">Customers have submitted payment proofs — please verify</p>
            </div>
            <Link href="/admin/orders" className="btn-destiny text-sm px-4 py-2">Review Now</Link>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm text-destiny-pink font-medium hover:underline">View all</Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="p-10 text-center text-gray-400">No orders yet</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentOrders.map(order => (
                  <Link key={order.id} href={`/admin/orders`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-sm font-bold text-destiny-pink">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">{order.user?.firstName} {order.user?.lastName} · {order.user?.email}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold">{Number(order.total).toLocaleString()} FCFA</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_BADGE[order.status] || 'text-gray-600 bg-gray-50'}`}>{order.status}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-1">
              {[
                { href: '/admin/products', label: 'Add New Product', icon: Package, color: 'text-destiny-pink' },
                { href: '/admin/orders', label: 'Verify Payments', icon: CreditCard, color: 'text-yellow-600' },
                { href: '/admin/orders', label: 'Process Orders', icon: Clock, color: 'text-blue-600' },
                { href: '/admin/vendors', label: 'Approve Vendors', icon: Store, color: 'text-green-600' },
                { href: '/admin/analytics', label: 'View Analytics', icon: TrendingUp, color: 'text-indigo-600' },
              ].map(a => (
                <Link key={a.href} href={a.href} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <a.icon size={18} className={a.color} />
                  <span className="text-sm font-medium text-gray-700">{a.label}</span>
                  <ArrowUpRight size={14} className="ml-auto text-gray-300 group-hover:text-destiny-pink" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
