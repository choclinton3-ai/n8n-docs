'use client'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/store'
import api from '@/lib/api/client'
import toast from 'react-hot-toast'
import { Plus, Search, RefreshCw, Edit2, Eye, EyeOff } from 'lucide-react'

export default function AdminProductsPage() {
  const { token } = useAuthStore()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [form, setForm] = useState({ name: '', sku: '', price: '', stock: '', categoryId: '', brandId: '', description: '', isFeatured: false, isNew: true })
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (token) { load(); loadMeta() } }, [token, page, search])

  async function load() {
    setLoading(true)
    try {
      const qs = `?page=${page}&limit=15${search ? `&search=${encodeURIComponent(search)}` : ''}`
      const res = await api.get<any>(`/products${qs}`, token!)
      setProducts(res.data)
      setTotalPages(res.totalPages)
    } catch { toast.error('Failed to load products') }
    finally { setLoading(false) }
  }

  async function loadMeta() {
    const [cats, brs] = await Promise.all([
      api.get<any[]>('/categories', token!).catch(() => []),
      api.get<any[]>('/brands', token!).catch(() => []),
    ])
    setCategories(cats)
    setBrands(brs)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/products', { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) }, token!)
      toast.success('Product created!')
      setShowForm(false)
      setForm({ name: '', sku: '', price: '', stock: '', categoryId: '', brandId: '', description: '', isFeatured: false, isNew: true })
      load()
    } catch (err: any) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  async function toggleActive(id: string, current: boolean) {
    try {
      await api.put(`/products/${id}`, { isActive: !current }, token!)
      toast.success(current ? 'Product hidden' : 'Product visible')
      load()
    } catch (err: any) { toast.error(err.message) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-black font-display">Product Management</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-destiny text-sm px-4 py-2 flex items-center gap-2">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="p-6 border-b bg-white">
          <form onSubmit={handleSave} className="grid grid-cols-2 gap-4 max-w-3xl">
            <div className="col-span-2"><h3 className="font-bold text-gray-900 mb-2">New Product</h3></div>
            <div><label className="text-xs font-semibold text-gray-500 uppercase">Product Name *</label><input required value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} className="input-destiny mt-1" /></div>
            <div><label className="text-xs font-semibold text-gray-500 uppercase">SKU *</label><input required value={form.sku} onChange={e => setForm(p => ({...p, sku: e.target.value}))} className="input-destiny mt-1" placeholder="e.g. SAMS-S24U-256" /></div>
            <div><label className="text-xs font-semibold text-gray-500 uppercase">Price (FCFA) *</label><input required type="number" value={form.price} onChange={e => setForm(p => ({...p, price: e.target.value}))} className="input-destiny mt-1" /></div>
            <div><label className="text-xs font-semibold text-gray-500 uppercase">Stock *</label><input required type="number" value={form.stock} onChange={e => setForm(p => ({...p, stock: e.target.value}))} className="input-destiny mt-1" /></div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Category *</label>
              <select required value={form.categoryId} onChange={e => setForm(p => ({...p, categoryId: e.target.value}))} className="input-destiny mt-1">
                <option value="">Select category</option>
                {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase">Brand *</label>
              <select required value={form.brandId} onChange={e => setForm(p => ({...p, brandId: e.target.value}))} className="input-destiny mt-1">
                <option value="">Select brand</option>
                {brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div className="col-span-2"><label className="text-xs font-semibold text-gray-500 uppercase">Description *</label><textarea required rows={3} value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} className="input-destiny mt-1 resize-none" /></div>
            <div className="col-span-2 flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isFeatured} onChange={e => setForm(p => ({...p, isFeatured: e.target.checked}))} className="accent-destiny-pink" /><span className="text-sm font-medium">Featured</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isNew} onChange={e => setForm(p => ({...p, isNew: e.target.checked}))} className="accent-destiny-pink" /><span className="text-sm font-medium">New Arrival</span></label>
            </div>
            <div className="col-span-2 flex gap-3">
              <button type="submit" disabled={saving} className="btn-destiny px-6">{saving ? 'Saving...' : 'Create Product'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-gray-300">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="p-6">
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search products..." className="input-destiny pl-9 text-sm" />
          </div>
          <button onClick={load} className="flex items-center gap-2 text-sm text-gray-500 hover:text-destiny-pink px-3"><RefreshCw size={16} /></button>
        </div>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="text-left px-5 py-3">Product</th>
                <th className="text-left px-5 py-3">SKU</th>
                <th className="text-left px-5 py-3">Price</th>
                <th className="text-left px-5 py-3">Stock</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">No products found</td></tr>
              ) : products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {p.thumbnail && <img src={p.thumbnail} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />}
                      <div>
                        <p className="font-medium text-gray-900 max-w-[200px] truncate">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.category?.name} · {p.brand?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">{p.sku}</td>
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
                    <button onClick={() => toggleActive(p.id, p.isActive)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title={p.isActive ? 'Hide' : 'Show'}>
                      {p.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-xl text-sm font-bold ${p === page ? 'bg-destiny-pink text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
