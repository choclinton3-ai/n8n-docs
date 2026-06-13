'use client'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/store'
import api from '@/lib/api/client'
import toast from 'react-hot-toast'
import { Plus, RefreshCw, Trash2, Tag, Image as ImageIcon } from 'lucide-react'
import CopyButton from '@/components/ui/CopyButton'

export default function AdminMarketingPage() {
  const { token } = useAuthStore()
  const [tab, setTab] = useState<'coupons' | 'banners'>('coupons')
  const [coupons, setCoupons] = useState<any[]>([])
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCouponForm, setShowCouponForm] = useState(false)
  const [couponForm, setCouponForm] = useState({ code: '', discountType: 'PERCENTAGE', discountValue: '', minOrderAmount: '', maxUses: '', expiresAt: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { if (token) { loadCoupons(); loadBanners() } }, [token])

  async function loadCoupons() {
    setLoading(true)
    try {
      const res = await api.get<any>('/admin/coupons', token!)
      setCoupons(res.data || res)
    } catch { toast.error('Failed to load coupons') }
    finally { setLoading(false) }
  }

  async function loadBanners() {
    try {
      const res = await api.get<any>('/admin/banners', token!)
      setBanners(res.data || res)
    } catch { }
  }

  async function createCoupon(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/admin/coupons', {
        ...couponForm,
        discountValue: parseFloat(couponForm.discountValue),
        minOrderAmount: couponForm.minOrderAmount ? parseFloat(couponForm.minOrderAmount) : undefined,
        maxUses: couponForm.maxUses ? parseInt(couponForm.maxUses) : undefined,
        expiresAt: couponForm.expiresAt || undefined,
      }, token!)
      toast.success('Coupon created!')
      setShowCouponForm(false)
      setCouponForm({ code: '', discountType: 'PERCENTAGE', discountValue: '', minOrderAmount: '', maxUses: '', expiresAt: '' })
      loadCoupons()
    } catch (err: any) { toast.error(err.message) }
    finally { setSaving(false) }
  }

  async function deleteCoupon(id: string) {
    if (!confirm('Delete this coupon?')) return
    try {
      await api.delete(`/admin/coupons/${id}`, token!)
      toast.success('Coupon deleted')
      loadCoupons()
    } catch (err: any) { toast.error(err.message) }
  }

  async function toggleBanner(id: string, active: boolean) {
    try {
      await api.put(`/admin/banners/${id}`, { isActive: !active }, token!)
      toast.success(active ? 'Banner hidden' : 'Banner activated')
      loadBanners()
    } catch (err: any) { toast.error(err.message) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-black font-display">Marketing</h1>
      </div>

      <div className="p-6">
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('coupons')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${tab === 'coupons' ? 'bg-destiny-pink text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
            <Tag size={15} /> Coupons
          </button>
          <button onClick={() => setTab('banners')} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors ${tab === 'banners' ? 'bg-destiny-pink text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
            <ImageIcon size={15} /> Banners
          </button>
        </div>

        {tab === 'coupons' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Discount Coupons</h2>
              <button onClick={() => setShowCouponForm(!showCouponForm)} className="btn-destiny text-sm px-4 py-2 flex items-center gap-2"><Plus size={15} /> Create Coupon</button>
            </div>

            {showCouponForm && (
              <div className="bg-white rounded-2xl shadow-card p-5 mb-4">
                <form onSubmit={createCoupon} className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Coupon Code *</label>
                    <input required value={couponForm.code} onChange={e => setCouponForm(p => ({...p, code: e.target.value.toUpperCase()}))} className="input-destiny mt-1" placeholder="e.g. SAVE20" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Type *</label>
                    <select required value={couponForm.discountType} onChange={e => setCouponForm(p => ({...p, discountType: e.target.value}))} className="input-destiny mt-1">
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED">Fixed Amount (FCFA)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Discount Value *</label>
                    <input required type="number" value={couponForm.discountValue} onChange={e => setCouponForm(p => ({...p, discountValue: e.target.value}))} className="input-destiny mt-1" placeholder={couponForm.discountType === 'PERCENTAGE' ? '20' : '5000'} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Min. Order (FCFA)</label>
                    <input type="number" value={couponForm.minOrderAmount} onChange={e => setCouponForm(p => ({...p, minOrderAmount: e.target.value}))} className="input-destiny mt-1" placeholder="Optional" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Max Uses</label>
                    <input type="number" value={couponForm.maxUses} onChange={e => setCouponForm(p => ({...p, maxUses: e.target.value}))} className="input-destiny mt-1" placeholder="Unlimited" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Expires At</label>
                    <input type="date" value={couponForm.expiresAt} onChange={e => setCouponForm(p => ({...p, expiresAt: e.target.value}))} className="input-destiny mt-1" />
                  </div>
                  <div className="col-span-2 flex gap-3">
                    <button type="submit" disabled={saving} className="btn-destiny px-6">{saving ? 'Creating...' : 'Create Coupon'}</button>
                    <button type="button" onClick={() => setShowCouponForm(false)} className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="text-left px-5 py-3">Code</th>
                    <th className="text-left px-5 py-3">Discount</th>
                    <th className="text-left px-5 py-3">Min Order</th>
                    <th className="text-left px-5 py-3">Uses</th>
                    <th className="text-left px-5 py-3">Expires</th>
                    <th className="text-left px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
                  ) : coupons.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-gray-400">No coupons yet</td></tr>
                  ) : coupons.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-destiny-pink">{c.code}</span>
                          <CopyButton text={c.code} label="coupon code" />
                        </div>
                      </td>
                      <td className="px-5 py-3 font-bold">
                        {c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `${Number(c.discountValue).toLocaleString()} FCFA`}
                      </td>
                      <td className="px-5 py-3 text-gray-600">{c.minOrderAmount ? `${Number(c.minOrderAmount).toLocaleString()} FCFA` : '—'}</td>
                      <td className="px-5 py-3">{c.usedCount ?? 0}{c.maxUses ? ` / ${c.maxUses}` : ' / ∞'}</td>
                      <td className="px-5 py-3 text-gray-600">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : 'Never'}</td>
                      <td className="px-5 py-3">
                        <button onClick={() => deleteCoupon(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={15} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'banners' && (
          <div>
            <h2 className="font-bold text-gray-900 mb-4">Homepage Banners</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {banners.length === 0 ? (
                <div className="col-span-2 bg-white rounded-2xl shadow-card p-10 text-center text-gray-400">
                  No banners configured. Banners are managed via the database.
                </div>
              ) : banners.map(b => (
                <div key={b.id} className="bg-white rounded-2xl shadow-card overflow-hidden">
                  {b.imageUrl && <img src={b.imageUrl} alt={b.title} className="w-full h-40 object-cover" />}
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{b.title}</p>
                      <p className="text-xs text-gray-400">Order: {b.sortOrder}</p>
                    </div>
                    <button onClick={() => toggleBanner(b.id, b.isActive)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${b.isActive ? 'bg-green-50 text-green-600 hover:bg-red-50 hover:text-red-500' : 'bg-red-50 text-red-500 hover:bg-green-50 hover:text-green-600'}`}>
                      {b.isActive ? 'Active' : 'Hidden'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
