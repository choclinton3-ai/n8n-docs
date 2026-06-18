'use client'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/store'
import api from '@/lib/api/client'
import toast from 'react-hot-toast'
import { Search, RefreshCw, CheckCircle, XCircle, Store } from 'lucide-react'

export default function AdminVendorsPage() {
  const { token } = useAuthStore()
  const [vendors, setVendors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'ACTIVE' | 'SUSPENDED'>('ALL')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => { if (token) load() }, [token, page, filter])

  async function load() {
    setLoading(true)
    try {
      const qs = `?page=${page}&limit=15${filter !== 'ALL' ? `&status=${filter}` : ''}`
      const res = await api.get<any>(`/admin/vendors${qs}`, token!)
      setVendors(res.data || res)
      setTotalPages(res.totalPages || 1)
    } catch { toast.error('Failed to load vendors') }
    finally { setLoading(false) }
  }

  async function approve(id: string) {
    try {
      await api.put(`/admin/vendors/${id}/approve`, {}, token!)
      toast.success('Vendor approved!')
      load()
    } catch (err: any) { toast.error(err.message) }
  }

  async function suspend(id: string) {
    try {
      await api.put(`/admin/vendors/${id}/suspend`, {}, token!)
      toast.success('Vendor suspended')
      load()
    } catch (err: any) { toast.error(err.message) }
  }

  const statusColors: Record<string, string> = {
    PENDING: 'text-yellow-600 bg-yellow-50',
    ACTIVE: 'text-green-600 bg-green-50',
    SUSPENDED: 'text-red-600 bg-red-50',
    REJECTED: 'text-gray-600 bg-gray-100',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-xl font-black font-display">Vendor Management</h1>
      </div>

      <div className="p-6">
        <div className="flex gap-2 mb-4 flex-wrap">
          {(['ALL', 'PENDING', 'ACTIVE', 'SUSPENDED'] as const).map(s => (
            <button key={s} onClick={() => { setFilter(s); setPage(1) }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${filter === s ? 'bg-destiny-pink text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-destiny-pink'}`}>
              {s}
            </button>
          ))}
          <button onClick={load} className="ml-auto flex items-center gap-2 text-sm text-gray-500 hover:text-destiny-pink px-3"><RefreshCw size={16} /></button>
        </div>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="text-left px-5 py-3">Vendor</th>
                <th className="text-left px-5 py-3">Contact</th>
                <th className="text-left px-5 py-3">Products</th>
                <th className="text-left px-5 py-3">Revenue</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : vendors.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">No vendors found</td></tr>
              ) : vendors.map(v => (
                <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        {v.logo ? <img src={v.logo} alt="" className="w-10 h-10 rounded-xl object-cover" /> : <Store size={18} className="text-gray-400" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{v.storeName}</p>
                        <p className="text-xs text-gray-400">{v.user?.firstName} {v.user?.lastName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-gray-700">{v.user?.email}</p>
                    <p className="text-xs text-gray-400">{v.user?.phone}</p>
                  </td>
                  <td className="px-5 py-3 font-bold">{v._count?.products ?? 0}</td>
                  <td className="px-5 py-3 font-bold">{Number(v.totalRevenue || 0).toLocaleString()} FCFA</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColors[v.status] || 'text-gray-600 bg-gray-100'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 flex items-center gap-1">
                    {v.status === 'PENDING' && (
                      <button onClick={() => approve(v.id)} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600" title="Approve">
                        <CheckCircle size={16} />
                      </button>
                    )}
                    {v.status === 'ACTIVE' && (
                      <button onClick={() => suspend(v.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="Suspend">
                        <XCircle size={16} />
                      </button>
                    )}
                    {v.status === 'SUSPENDED' && (
                      <button onClick={() => approve(v.id)} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600" title="Reactivate">
                        <CheckCircle size={16} />
                      </button>
                    )}
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
