'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  User, Package, Heart, MapPin, CreditCard, Bell,
  Shield, LogOut, ChevronRight, Edit2, Check
} from 'lucide-react'
import { useAuthStore, useWishlistStore, useCartStore } from '@/store'

const menuItems = [
  { id: 'profile', label: 'My Profile', icon: User, badge: null },
  { id: 'orders', label: 'My Orders', icon: Package, badge: '3' },
  { id: 'wishlist', label: 'Wishlist', icon: Heart, badge: null },
  { id: 'addresses', label: 'Addresses', icon: MapPin, badge: null },
  { id: 'payments', label: 'Payment Methods', icon: CreditCard, badge: null },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: '5' },
  { id: 'security', label: 'Security', icon: Shield, badge: null },
]

const mockOrders = [
  { id: '#DEC-001234', date: '28 Feb 2024', total: 390000, status: 'Delivered', statusColor: 'text-green-600 bg-green-100', items: 1 },
  { id: '#DEC-001198', date: '20 Feb 2024', total: 720000, status: 'Processing', statusColor: 'text-blue-600 bg-blue-100', items: 2 },
  { id: '#DEC-001156', date: '12 Feb 2024', total: 185000, status: 'Shipped', statusColor: 'text-purple-600 bg-purple-100', items: 1 },
]

function formatCFA(n: number) {
  return `${n.toLocaleString()} FCFA`
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const { user, logout } = useAuthStore()
  const wishlistCount = useWishlistStore(s => s.items.length)
  const [editing, setEditing] = useState(false)

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-destiny-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={36} className="text-destiny-pink" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-500 mb-6">Please sign in to view your account</p>
          <Link href="/auth/login" className="btn-destiny block text-center">Sign In</Link>
          <Link href="/auth/register" className="block mt-3 text-destiny-pink font-medium text-sm hover:underline">Create account</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold font-display">My Account</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card p-6 mb-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-destiny-gradient rounded-2xl flex items-center justify-center text-white font-black text-2xl">
                  {user.firstName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{user.firstName} {user.lastName}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xl font-bold text-destiny-pink">12</div>
                  <div className="text-xs text-gray-500">Orders</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xl font-bold text-destiny-pink">{wishlistCount}</div>
                  <div className="text-xs text-gray-500">Wishlist</div>
                </div>
              </div>
            </div>

            <nav className="bg-white rounded-2xl shadow-card overflow-hidden">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 text-sm font-medium transition-colors border-b border-gray-50 last:border-0 ${
                    activeTab === item.id ? 'text-destiny-pink bg-destiny-50' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} />
                    {item.label}
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="bg-destiny-pink text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{item.badge}</span>
                    )}
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </button>
              ))}

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </nav>
          </aside>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                  <button
                    onClick={() => setEditing(!editing)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      editing ? 'bg-destiny-pink text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {editing ? <><Check size={16} /> Save</> : <><Edit2 size={16} /> Edit</>}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  {[
                    { label: 'First Name', value: user.firstName },
                    { label: 'Last Name', value: user.lastName },
                    { label: 'Email', value: user.email, full: true },
                    { label: 'Phone', value: user.phone || '+237 XXX XXX XXX' },
                  ].map(field => (
                    <div key={field.label} className={field.full ? 'col-span-2' : ''}>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{field.label}</label>
                      {editing ? (
                        <input defaultValue={field.value} className="input-destiny text-sm" />
                      ) : (
                        <p className="text-gray-900 font-medium py-2.5 px-4 bg-gray-50 rounded-xl text-sm">{field.value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">My Orders</h2>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {mockOrders.map(order => (
                      <div key={order.id} className="p-5 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-mono font-bold text-destiny-pink text-sm">{order.id}</p>
                            <p className="text-xs text-gray-500 mt-1">{order.date} · {order.items} item{order.items !== 1 ? 's' : ''}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">{formatCFA(order.total)}</p>
                            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${order.statusColor}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-3">
                          <Link
                            href={`/shop/orders/${order.id}`}
                            className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:border-destiny-pink hover:text-destiny-pink transition-colors"
                          >
                            View Details
                          </Link>
                          {order.status === 'Delivered' && (
                            <button className="px-4 py-1.5 border border-destiny-pink text-destiny-pink rounded-lg text-xs font-medium hover:bg-destiny-50 transition-colors">
                              Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Order Updates', desc: 'Receive updates on your order status', enabled: true },
                    { label: 'Promotions & Deals', desc: 'Get notified about flash sales and discounts', enabled: true },
                    { label: 'Product Restocks', desc: 'Know when wishlist items are back in stock', enabled: false },
                    { label: 'Payment Confirmations', desc: 'Confirm payments via SMS and email', enabled: true },
                    { label: 'Security Alerts', desc: 'Get alerts for unusual account activity', enabled: true },
                  ].map((pref, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{pref.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{pref.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={pref.enabled} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-destiny-pink"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {(activeTab !== 'profile' && activeTab !== 'orders' && activeTab !== 'notifications') && (
              <div className="bg-white rounded-2xl shadow-card p-10 text-center">
                <div className="text-5xl mb-4">🚧</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Coming Soon</h3>
                <p className="text-gray-500">This feature is being built. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
