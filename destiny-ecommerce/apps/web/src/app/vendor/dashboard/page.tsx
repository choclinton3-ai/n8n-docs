'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store'
import api from '@/lib/api/client'
import toast from 'react-hot-toast'
import {
  Store, Package, ShoppingCart, DollarSign, TrendingUp,
  Star, RefreshCw, Plus, Eye, EyeOff, AlertTriangle, Clock
} from 'lucide-react'

function StatCard({ icon: Icon, label, value, sub, color = 'text-destiny-pink' }: {
  icon: any; label: string; value: string; sub?: string; color?: string
}) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5">
      <div className="w-11 h-11 bg-destiny-50 rounded-xl flex items-center justify-center mb-3">
        <Icon size={20} className={color} />
      </div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-yellow-600 bg-yellow-50',
  CONFIRMED: 'text-blue-600 bg-blue-50',
  PROCESSING: 'text-indigo-600 bg-indigo-50',
  SHIPPED: 'text-purple-600 bg-purple-50',
  DELIVERED: 'text-green-600 bg-green-50',
  CANCELLED: 'text-red-600 bg-red-50',
}

export default function VendorDashboardPage() {
  const { token, user } = useAuthStore()
  const router = useRouter()
  const [dashboard, setDashboard] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'overview' | 'products' | 'orders' | 'settings'>('overview')
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [registerForm, setRegisterForm] = useState({ shopName: '', description: '', phone: '', email: '', city: '', region: '' })
  const [registering, setRegistering] = useState(false)

  useEffect(() => {
    if (!token) return
    loadDashboard()
  }, [token])

  useEffect(() => {
    if (dashboard?.vendor && tab === 'products') loadProducts()
    if (dashboard?.vendor && tab === 'orders') loadOrders()
  }, [tab, dashboard])

  async function loadDashboard() {
    setLoading(true)
    try {
      const res = await api.get<any>('/vendors/me/dashboard', token!)
      setDashboard(res)
    } catch (err: any) {
      if (err.message?.includes('404') || err.message?.includes('not found')) {
        setDashboard(null)
        setShowRegisterForm(true)
      } else {
        toast.error(err.message || 'Failed to load vendor dashboard')
      }
    } finally { setLoading(false) }
  }

  async function loadProducts() {
    try {
      const res = await api.get<any>(`/products?vendorId=${dashboard.vendor.id}&limit=20`, token!)
      setProducts(res.data || [])
    } catch { setProducts([]) }
  }

  async function loadOrders() {
    try {
      const res = await api.get<any>(`/orders?vendorId=${dashboard.vendor.id}&limit=10`, token!)
      setRecentOrders(res.data || [])
    } catch { setRecentOrders([]) }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setRegistering(true)
    try {
      await api.post('/vendors/register', registerForm, token!)
      toast.success('Vendor account created! Awaiting admin approval.')
      setShowRegisterForm(false)
      loadDashboard()
    } catch (err: any) { toast.error(err.message) }
    finally { setRegistering(false) }
  }

  async function toggleProduct(id: string, isActive: boolean) {
    try {
      await api.put(`/products/${id}`, { isActive: !isActive }, token!)
      toast.success(isActive ? 'Product hidden' : 'Product visible')
      loadProducts()
    } catch (err: any) { toast.error(err.message) }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-center">
          <RefreshCw size={32} className="animate-spin mx-auto mb-3" />
          <p>Loading vendor portal...</p>
        </div>
      </div>
    )
  }

  if (showRegisterForm || !dashboard) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-destiny-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-destiny">
              <Store size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-black font-display text-gray-900">Open Your Store</h1>
            <p className="text-gray-500 text-sm mt-1">Sell your products on Destiny E-Commerce</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">Shop Name *</label>
              <input required value={registerForm.shopName} onChange={e => setRegisterForm(p => ({...p, shopName: e.target.value}))}
                className="input-destiny" placeholder="e.g. Tech Galaxy Store" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">Description</label>
              <textarea rows={3} value={registerForm.description} onChange={e => setRegisterForm(p => ({...p, description: e.target.value}))}
                className="input-destiny resize-none" placeholder="Tell customers about your store..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">Phone</label>
                <input value={registerForm.phone} onChange={e => setRegisterForm(p => ({...p, phone: e.target.value}))}
                  className="input-destiny" placeholder="+237 6XX XXX XXX" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">City</label>
                <input value={registerForm.city} onChange={e => setRegisterForm(p => ({...p, city: e.target.value}))}
                  className="input-destiny" placeholder="Douala" />
              </div>
            </div>
            <button type="submit" disabled={registering} className="w-full btn-destiny">
              {registering ? 'Submitting...' : 'Register as Vendor'}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4">
            Your application will be reviewed within 24–48 hours
          </p>
        </div>
      </div>
    )
  }

  const { vendor, stats } = dashboard

  if (vendor.status === 'PENDING') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md">
          <Clock size={48} className="mx-auto mb-4 text-yellow-400" />
          <h2 className="text-2xl font-black font-display text-gray-900 mb-2">Application Under Review</h2>
          <p className="text-gray-500">Your vendor application for <strong>{vendor.shopName}</strong> is being reviewed. You'll be notified within 24–48 hours.</p>
          <Link href="/" className="btn-destiny mt-6 inline-block px-8">Back to Shop</Link>
        </div>
      </div>
    )
  }

  if (vendor.status === 'REJECTED' || vendor.status === 'SUSPENDED') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md">
          <AlertTriangle size={48} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-black font-display text-gray-900 mb-2">Account {vendor.status === 'REJECTED' ? 'Rejected' : 'Suspended'}</h2>
          <p className="text-gray-500">Please contact support for assistance with your vendor account.</p>
          <Link href="/shop/support" className="btn-destiny mt-6 inline-block px-8">Contact Support</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {vendor.logo ? (
              <img src={vendor.logo} alt={vendor.shopName} className="w-12 h-12 rounded-2xl object-cover" />
            ) : (
              <div className="w-12 h-12 bg-destiny-gradient rounded-2xl flex items-center justify-center shadow-destiny">
                <Store size={22} className="text-white" />
              </div>
            )}
            <div>
              <h1 className="text-xl font-black font-display">{vendor.shopName}</h1>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-600">Active</span>
                <span className="text-xs text-gray-400">Commission: {Number(vendor.commission)}%</span>
              </div>
            </div>
          </div>
          <button onClick={loadDashboard} className="p-2 text-gray-400 hover:text-destiny-pink">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 flex gap-1">
          {(['overview', 'products', 'orders', 'settings'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-semibold capitalize border-b-2 transition-colors ${tab === t ? 'border-destiny-pink text-destiny-pink' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Overview Tab */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Package} label="Total Products" value={String(stats.totalProducts)} color="text-blue-500" />
              <StatCard icon={ShoppingCart} label="Total Orders" value={String(stats.totalOrders)} color="text-purple-500" />
              <StatCard icon={DollarSign} label="Total Revenue" value={`${Number(stats.totalRevenue).toLocaleString()} F`} color="text-green-500" />
              <StatCard icon={Star} label="Store Rating" value={`${Number(vendor.rating).toFixed(1)} / 5`} color="text-yellow-500" />
            </div>

            {/* Store Info Card */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-bold text-gray-900 mb-4">Store Overview</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                {[
                  { label: 'Shop Name', value: vendor.shopName },
                  { label: 'City', value: vendor.city || '—' },
                  { label: 'Email', value: vendor.email || '—' },
                  { label: 'Phone', value: vendor.phone || '—' },
                  { label: 'Commission Rate', value: `${Number(vendor.commission)}%` },
                  { label: 'Member Since', value: new Date(vendor.createdAt).toLocaleDateString() },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
              {vendor.description && (
                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Description</p>
                  <p className="text-sm text-gray-700">{vendor.description}</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'View My Products', href: '#', icon: Package, action: () => setTab('products') },
                  { label: 'View Orders', href: '#', icon: ShoppingCart, action: () => setTab('orders') },
                  { label: 'Store Settings', href: '#', icon: Store, action: () => setTab('settings') },
                ].map(item => (
                  <button key={item.label} onClick={item.action}
                    className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl hover:bg-destiny-50 hover:text-destiny-pink transition-colors group">
                    <item.icon size={22} className="text-gray-400 group-hover:text-destiny-pink" />
                    <span className="text-xs font-semibold text-gray-600 group-hover:text-destiny-pink text-center">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">My Products</h2>
              <Link href="/vendor/products/new" className="btn-destiny text-sm px-4 py-2 flex items-center gap-2">
                <Plus size={15} /> Add Product
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="text-left px-5 py-3">Product</th>
                    <th className="text-left px-5 py-3">Price</th>
                    <th className="text-left px-5 py-3">Stock</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-left px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-10 text-gray-400">
                      No products yet. <button onClick={() => router.push('/vendor/products/new')} className="text-destiny-pink hover:underline">Add your first product</button>
                    </td></tr>
                  ) : products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {p.thumbnail && <img src={p.thumbnail} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />}
                          <div>
                            <p className="font-medium text-gray-900 max-w-[180px] truncate">{p.name}</p>
                            <p className="text-xs text-gray-400 font-mono">{p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-bold">{Number(p.price).toLocaleString()} FCFA</td>
                      <td className="px-5 py-3">
                        <span className={`font-bold ${p.stock <= 10 ? 'text-red-500' : p.stock <= 30 ? 'text-yellow-600' : 'text-green-600'}`}>{p.stock}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.isActive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                          {p.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <button onClick={() => toggleProduct(p.id, p.isActive)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title={p.isActive ? 'Hide' : 'Show'}>
                          {p.isActive ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div>
            <h2 className="font-bold text-gray-900 mb-4">Recent Orders</h2>
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="text-left px-5 py-3">Order</th>
                    <th className="text-left px-5 py-3">Customer</th>
                    <th className="text-left px-5 py-3">Total</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-left px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-10 text-gray-400">No orders yet</td></tr>
                  ) : recentOrders.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-mono font-bold text-destiny-pink text-xs">{o.orderNumber}</td>
                      <td className="px-5 py-3 text-gray-700">{o.user?.firstName} {o.user?.lastName}</td>
                      <td className="px-5 py-3 font-bold">{Number(o.total).toLocaleString()} FCFA</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-600'}`}>
                          {o.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {tab === 'settings' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-bold text-gray-900 mb-5">Store Settings</h2>
              <div className="space-y-4">
                {[
                  { label: 'Shop Name', value: vendor.shopName },
                  { label: 'Email', value: vendor.email || '' },
                  { label: 'Phone', value: vendor.phone || '' },
                  { label: 'City', value: vendor.city || '' },
                  { label: 'Region', value: vendor.region || '' },
                ].map(field => (
                  <div key={field.label}>
                    <label className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">{field.label}</label>
                    <input defaultValue={field.value} className="input-destiny" />
                  </div>
                ))}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">Description</label>
                  <textarea rows={4} defaultValue={vendor.description || ''} className="input-destiny resize-none" />
                </div>
                <button className="btn-destiny px-6">Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
