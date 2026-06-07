'use client'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/store'
import api from '@/lib/api/client'
import toast from 'react-hot-toast'
import { TrendingUp, TrendingDown, RefreshCw, ShoppingCart, Users, Package, DollarSign } from 'lucide-react'

interface Stats {
  revenue: { total: number; thisMonth: number; lastMonth: number; growth: number }
  orders: { total: number; thisMonth: number; pending: number; delivered: number }
  users: { total: number; thisMonth: number; growth: number }
  products: { total: number; lowStock: number; outOfStock: number }
  topProducts: Array<{ id: string; name: string; thumbnail: string; totalSold: number; revenue: number }>
  revenueByDay: Array<{ date: string; revenue: number; orders: number }>
}

function StatCard({ icon: Icon, label, value, sub, trend }: { icon: any; label: string; value: string; sub?: string; trend?: number }) {
  const up = trend !== undefined && trend >= 0
  return (
    <div className="bg-white rounded-2xl shadow-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 bg-destiny-50 rounded-xl flex items-center justify-center">
          <Icon size={20} className="text-destiny-pink" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-bold ${up ? 'text-green-600' : 'text-red-500'}`}>
            {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-black text-gray-900 font-display">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

function SimpleBar({ value, max, color = 'bg-destiny-pink' }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} /></div>
}

export default function AdminAnalyticsPage() {
  const { token } = useAuthStore()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => { if (token) load() }, [token, period])

  async function load() {
    setLoading(true)
    try {
      const res = await api.get<Stats>(`/admin/analytics?period=${period}`, token!)
      setStats(res)
    } catch { toast.error('Failed to load analytics') }
    finally { setLoading(false) }
  }

  const fmt = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-black font-display">Analytics</h1>
        <div className="flex items-center gap-3">
          {(['7d', '30d', '90d'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${period === p ? 'bg-destiny-pink text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
          <button onClick={load} className="p-2 text-gray-400 hover:text-destiny-pink"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} /></button>
        </div>
      </div>

      <div className="p-6">
        {loading && !stats ? (
          <div className="text-center py-20 text-gray-400">Loading analytics...</div>
        ) : stats ? (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={DollarSign} label="Total Revenue" value={`${fmt(stats.revenue.total)} FCFA`} sub={`${fmt(stats.revenue.thisMonth)} FCFA this month`} trend={stats.revenue.growth} />
              <StatCard icon={ShoppingCart} label="Total Orders" value={String(stats.orders.total)} sub={`${stats.orders.thisMonth} this month · ${stats.orders.pending} pending`} />
              <StatCard icon={Users} label="Customers" value={String(stats.users.total)} sub={`${stats.users.thisMonth} new this month`} trend={stats.users.growth} />
              <StatCard icon={Package} label="Products" value={String(stats.products.total)} sub={`${stats.products.lowStock} low stock · ${stats.products.outOfStock} out`} />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Revenue Chart — simple bar chart using divs */}
              <div className="bg-white rounded-2xl shadow-card p-5">
                <h3 className="font-bold text-gray-900 mb-4">Revenue by Day</h3>
                {stats.revenueByDay?.length > 0 ? (
                  <div className="space-y-2">
                    {(() => {
                      const maxRev = Math.max(...stats.revenueByDay.map(d => d.revenue))
                      return stats.revenueByDay.slice(-14).map(d => (
                        <div key={d.date} className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 w-16 flex-shrink-0">{new Date(d.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
                          <div className="flex-1"><SimpleBar value={d.revenue} max={maxRev} /></div>
                          <span className="text-xs font-bold text-gray-700 w-20 text-right">{fmt(d.revenue)} F</span>
                        </div>
                      ))
                    })()}
                  </div>
                ) : <p className="text-gray-400 text-sm">No data available</p>}
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-2xl shadow-card p-5">
                <h3 className="font-bold text-gray-900 mb-4">Top Products</h3>
                {stats.topProducts?.length > 0 ? (
                  <div className="space-y-3">
                    {(() => {
                      const maxSold = Math.max(...stats.topProducts.map(p => p.totalSold))
                      return stats.topProducts.slice(0, 8).map((p, i) => (
                        <div key={p.id}>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xs font-black text-gray-400 w-4">#{i + 1}</span>
                            {p.thumbnail && <img src={p.thumbnail} alt="" className="w-7 h-7 rounded-lg object-cover" />}
                            <span className="text-sm font-medium text-gray-800 flex-1 truncate">{p.name}</span>
                            <span className="text-xs font-bold text-gray-600">{p.totalSold} sold</span>
                          </div>
                          <SimpleBar value={p.totalSold} max={maxSold} color={i === 0 ? 'bg-destiny-pink' : i === 1 ? 'bg-purple-400' : 'bg-blue-400'} />
                        </div>
                      ))
                    })()}
                  </div>
                ) : <p className="text-gray-400 text-sm">No data available</p>}
              </div>
            </div>

            {/* Order Status Breakdown */}
            <div className="bg-white rounded-2xl shadow-card p-5">
              <h3 className="font-bold text-gray-900 mb-4">Order Status Breakdown</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Pending', value: stats.orders.pending, color: 'bg-yellow-400' },
                  { label: 'Delivered', value: stats.orders.delivered, color: 'bg-green-400' },
                  { label: 'Processing', value: stats.orders.total - stats.orders.pending - stats.orders.delivered, color: 'bg-blue-400' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl font-black text-gray-900">{s.value}</div>
                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                      <span className="text-sm text-gray-500">{s.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
