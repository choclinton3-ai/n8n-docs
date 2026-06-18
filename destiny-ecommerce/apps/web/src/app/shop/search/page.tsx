'use client'
import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api/client'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'

function SearchResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [engine, setEngine] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState('relevance')
  const [inputValue, setInputValue] = useState(query)

  useEffect(() => {
    setInputValue(query)
    setPage(1)
  }, [query])

  useEffect(() => {
    if (query) search()
    else { setResults([]); setTotal(0) }
  }, [query, page, sortBy, minPrice, maxPrice])

  async function search() {
    setLoading(true)
    try {
      const qs = new URLSearchParams({
        q: query,
        page: String(page),
        limit: '20',
        ...(sortBy !== 'relevance' && { sortBy }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
      })
      const res = await api.get<any>(`/search?${qs}`)
      setResults(res.data || [])
      setTotal(res.total || 0)
      setTotalPages(res.totalPages || 1)
      setEngine(res.engine || '')
    } catch { setResults([]) }
    finally { setLoading(false) }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (inputValue.trim()) router.push(`/shop/search?q=${encodeURIComponent(inputValue.trim())}`)
  }

  function clearFilters() {
    setMinPrice('')
    setMaxPrice('')
    setSortBy('relevance')
  }

  const hasFilters = minPrice || maxPrice || sortBy !== 'relevance'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="bg-white border-b py-5">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Search products..."
                className="input-destiny pl-11 text-base"
              />
            </div>
            <button type="submit" className="btn-destiny px-6">Search</button>
          </form>
          {query && (
            <p className="text-center text-sm text-gray-500 mt-2">
              {loading ? 'Searching...' : `${total.toLocaleString()} result${total !== 1 ? 's' : ''} for "${query}"`}
              {engine === 'elasticsearch' && <span className="ml-2 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Powered by Search</span>}
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filter Bar */}
        {query && (
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:border-destiny-pink transition-colors">
              <SlidersHorizontal size={15} /> Filters
              {hasFilters && <span className="w-2 h-2 bg-destiny-pink rounded-full" />}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort:</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-destiny-pink">
                <option value="relevance">Relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 px-3 py-2 bg-red-50 rounded-xl">
                <X size={13} /> Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && query && (
          <div className="bg-white rounded-2xl shadow-card p-5 mb-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">Min Price (FCFA)</label>
                <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="input-destiny" placeholder="0" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">Max Price (FCFA)</label>
                <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="input-destiny" placeholder="Any" />
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {!query ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Search for Products</h2>
            <p className="text-gray-400">Enter a search term to find phones, accessories, and more</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">No results found</h2>
            <p className="text-gray-400 mb-6">We couldn't find anything for "{query}". Try different keywords.</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Samsung', 'iPhone', 'Headphones', 'Laptop', 'Accessories'].map(s => (
                <Link key={s} href={`/shop/search?q=${s}`} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:border-destiny-pink hover:text-destiny-pink transition-colors">{s}</Link>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:border-destiny-pink">
                  Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  const p = page <= 4 ? i + 1 : page - 3 + i
                  if (p < 1 || p > totalPages) return null
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-sm font-bold ${p === page ? 'bg-destiny-pink text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
                      {p}
                    </button>
                  )
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:border-destiny-pink">
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading search...</div>}>
      <SearchResults />
    </Suspense>
  )
}
