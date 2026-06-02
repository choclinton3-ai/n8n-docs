'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  DollarSign, ShoppingBag, Users, Package, TrendingUp, TrendingDown,
  ArrowUpRight, Eye, MoreHorizontal, AlertTriangle, CheckCircle,
  Clock, Truck, Star
} from 'lucide-react'
import { products, formatCFA } from '@/lib/data/products'

const stats = [
  { title: 'Total Revenue', value: '47,823,500 FCFA', change: '+12.5%', up: true, icon: DollarSign, color: '#FF007F' },
  { title: 'Total Orders', value: '1,284', change: '+8.3%', up: true, icon: ShoppingBag, color: '#6366f1' },
  { title: 'Total Customers', value: '8,921', change: '+15.2%', up: true, icon: Users, color: '#10b981' },
  { title: 'Total Products', value: '10,482', change: '-2.1%', up: false, icon: Package, color: '#f59e0b' },
]

const recentOrders = [
  { id: '#DEC-001234', customer: 'Amara Ngoh', product: 'Samsung Galaxy S24 Ultra', amount: 390000, status: 'delivered', date: '2024-02-28' },
  { id: '#DEC-001233', customer: 'Jean-Pierre Mbarga', product: 'MacBook Air M3', amount: 720000, status: 'processing', date: '2024-02-28' },
  { id: '#DEC-001232', customer: 'Fatima Diallo', product: 'Sony WH-1000XM5', amount: 185000, status: 'shipped', date: '2024-02-27' },
  { id: '#DEC-001231', customer: 'Emmanuel Tchouopo', product: 'PS5 Console', amount: 320000, status: 'pending', date: '2024-02-27' },
  { id: '#DEC-001230', customer: 'Marie Fouda', product: 'iPhone 15 Pro Max', amount: 580000, status: 'delivered', date: '2024-02-26' },
]

const statusConfig = {
  delivered: { label: 'Delivered', color: 'text-green-700 bg-green-100', icon: CheckCircle },
  processing: { label: 'Processing', color: 'text-blue-700 bg-blue-100', icon: Clock },
  shipped: { label: 'Shipped', color: 'text-purple-700 bg-purple-100', icon: Truck },
  pending: { label: 'Pending', color: 'text-orange-700 bg-orange-100', icon: Clock },
}

const adminNav = [
  { label: 'Dashboard', href: '/admin/dashboard', emoji: '📊' },
  { label: 'Products', href: '/admin/products', emoji: '📦' },
  { label: 'Orders', href: '/admin/orders', emoji: '🛍️' },
  { label: 'Customers', href: '/admin/customers', emoji: '👥' },
  { label: 'Vendors', href: '/admin/vendors', emoji: '🏪' },
  { label: 'Analytics', href: '/admin/analytics', emoji: '📈' },
  { label: 'Marketing', href: '/admin/marketing', emoji: '📣' },
  { label: 'Settings', href: '/admin/settings', emoji: '⚙️' },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white min-h-screen flex-shrink-0 sticky top-0 overflow-y-auto">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-destiny-gradient rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-lg font-display">D</span>
            </div>
            <div>
              <div className="font-black text-destiny-pink text-base font-display">DESTINY</div>
              <div className="text-gray-400 text-xs">Admin Panel</div>
            </div>
          </Link>

          <div className="space-y-1">
            {adminNav.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors first:bg-destiny-pink first:text-white"
              >
                <span>{item.emoji}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Admin User */}
        <div className="p-6 border-t border-gray-800 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-destiny-gradient rounded-full flex items-center justify-center text-white font-bold">A</div>
            <div>
              <div className="text-sm font-semibold">Admin User</div>
              <div className="text-xs text-gray-400">Super Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black font-display text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-xl shadow-sm">
            {new Date().toLocaleDateString('en-CM', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                  <stat.icon size={22} style={{ color: stat.color }} />
                </div>
                <span className={`flex items-center gap-1 text-sm font-semibold ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
                  {stat.up ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-black text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.title}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart Placeholder */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900">Revenue Overview</h3>
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            <div className="h-48 bg-gradient-to-br from-destiny-50 to-white rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <TrendingUp size={40} className="text-destiny-pink mx-auto mb-2" />
                <p className="text-sm text-gray-500">Revenue chart (Chart.js integration)</p>
                <p className="text-2xl font-black text-destiny-pink mt-2">+12.5% This Month</p>
              </div>
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h3 className="font-bold text-gray-900 mb-4">Top Categories</h3>
            <div className="space-y-4">
              {[
                { name: 'Smartphones', pct: 35, color: '#FF007F' },
                { name: 'Laptops', pct: 22, color: '#6366f1' },
                { name: 'Smart TVs', pct: 18, color: '#10b981' },
                { name: 'Accessories', pct: 15, color: '#f59e0b' },
                { name: 'Others', pct: 10, color: '#6b7280' },
              ].map(cat => (
                <div key={cat.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{cat.name}</span>
                    <span className="font-semibold text-gray-900">{cat.pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: `${cat.pct}%`, backgroundColor: cat.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-8">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Recent Orders</h3>
            <Link href="/admin/orders" className="text-destiny-pink text-sm font-medium hover:underline flex items-center gap-1">
              View all <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date', 'Action'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map(order => {
                  const status = statusConfig[order.status as keyof typeof statusConfig]
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono font-semibold text-destiny-pink">{order.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.customer}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-40 truncate">{order.product}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">{formatCFA(order.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                          <status.icon size={12} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                      <td className="px-6 py-4">
                        <button className="text-gray-400 hover:text-destiny-pink transition-colors">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle size={18} className="text-orange-500" /> Low Stock Alerts
            </h3>
            <Link href="/admin/products?filter=low-stock" className="text-destiny-pink text-sm font-medium hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {products.filter(p => p.stock <= 30).slice(0, 5).map(product => (
              <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <img src={product.thumbnail} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900 line-clamp-1">{product.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">SKU: {product.sku}</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${product.stock <= 10 ? 'text-red-600' : 'text-orange-600'}`}>
                    {product.stock} left
                  </span>
                  <div className={`w-20 bg-gray-200 rounded-full h-1.5 mt-1`}>
                    <div
                      className={`h-1.5 rounded-full ${product.stock <= 10 ? 'bg-red-500' : 'bg-orange-500'}`}
                      style={{ width: `${(product.stock / 50) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
