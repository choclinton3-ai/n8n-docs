'use client'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '@/store'
import api from '@/lib/api/client'
import toast from 'react-hot-toast'
import { Search, RefreshCw, User, Ban, CheckCircle } from 'lucide-react'

export default function AdminCustomersPage() {
  const { token } = useAuthStore()
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => { if (token) load() }, [token, page, search])

  async function load() {
    setLoading(true)
    try {
      const qs = `?page=${page}&limit=15&role=CUSTOMER${search ? `&search=${encodeURIComponent(search)}` : ''}`
      const res = await api.get<any>(`/admin/customers${qs}`, token!)
      setCustomers(res.data || res)
      setTotalPages(res.totalPages || 1)
      setTotal(res.total || 0)
    } catch { toast.error('Failed to load customers') }
    finally { setLoading(false) }
  }

  async function toggleBan(id: string, active: boolean) {
    try {
      await api.put(`/admin/customers/${id}`, { isActive: !active }, token!)
      toast.success(active ? 'Customer banned' : 'Customer reactivated')
      load()
    } catch (err: any) { toast.error(err.message) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black font-display">Customer Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} total customers</p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search by name or email..." className="input-destiny pl-9 text-sm" />
          </div>
          <button onClick={load} className="flex items-center gap-2 text-sm text-gray-500 hover:text-destiny-pink px-3"><RefreshCw size={16} /></button>
        </div>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
              <tr>
                <th className="text-left px-5 py-3">Customer</th>
                <th className="text-left px-5 py-3">Phone</th>
                <th className="text-left px-5 py-3">Orders</th>
                <th className="text-left px-5 py-3">Spent</th>
                <th className="text-left px-5 py-3">Joined</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">Loading...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">No customers found</td></tr>
              ) : customers.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-destiny-50 flex items-center justify-center flex-shrink-0">
                        {c.avatar ? <img src={c.avatar} alt="" className="w-9 h-9 rounded-full object-cover" /> : <User size={16} className="text-destiny-pink" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{c.firstName} {c.lastName}</p>
                        <p className="text-xs text-gray-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{c.phone || '—'}</td>
                  <td className="px-5 py-3 font-bold text-gray-900">{c._count?.orders ?? 0}</td>
                  <td className="px-5 py-3 font-bold">{Number(c.totalSpent || 0).toLocaleString()} FCFA</td>
                  <td className="px-5 py-3 text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${c.isActive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                      {c.isActive ? 'Active' : 'Banned'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => toggleBan(c.id, c.isActive)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500" title={c.isActive ? 'Ban customer' : 'Reactivate'}>
                      {c.isActive ? <Ban size={15} /> : <CheckCircle size={15} />}
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
