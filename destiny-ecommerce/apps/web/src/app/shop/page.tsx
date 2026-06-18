'use client'

import React, { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  SlidersHorizontal, Grid3X3, List, Search, X, ChevronDown, Filter
} from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { products, categories, brands } from '@/lib/data/products'
import { FilterState } from '@/types'

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
]

export default function ShopPage() {
  const searchParams = useSearchParams()
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get('category') || '',
    brand: [],
    priceMin: 0,
    priceMax: 1000000,
    rating: 0,
    availability: 'all',
    sortBy: 'newest',
    search: searchParams.get('q') || '',
  })

  const filtered = useMemo(() => {
    let result = [...products]

    if (searchParams.get('filter') === 'new') result = result.filter(p => p.isNew)
    if (searchParams.get('filter') === 'best-sellers') result = result.filter(p => p.isBestSeller)
    if (searchParams.get('filter') === 'flash-sale') result = result.filter(p => p.isFlashSale)
    if (searchParams.get('filter') === 'featured') result = result.filter(p => p.isFeatured)

    if (filters.category) result = result.filter(p => p.category.slug === filters.category)
    if (filters.brand?.length) result = result.filter(p => filters.brand!.includes(p.brand.slug))
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.name.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q)
      )
    }
    if (filters.availability === 'in_stock') result = result.filter(p => p.inStock)
    result = result.filter(p => p.price >= (filters.priceMin || 0) && p.price <= (filters.priceMax || 9999999))
    if (filters.rating) result = result.filter(p => p.rating >= filters.rating!)

    switch (filters.sortBy) {
      case 'price_asc': return result.sort((a, b) => a.price - b.price)
      case 'price_desc': return result.sort((a, b) => b.price - a.price)
      case 'rating': return result.sort((a, b) => b.rating - a.rating)
      case 'popular': return result.sort((a, b) => b.soldCount - a.soldCount)
      default: return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  }, [filters, searchParams])

  const toggleBrand = (slug: string) => {
    setFilters(prev => ({
      ...prev,
      brand: prev.brand?.includes(slug)
        ? prev.brand.filter(b => b !== slug)
        : [...(prev.brand || []), slug],
    }))
  }

  const clearFilters = () => setFilters({
    category: '', brand: [], priceMin: 0, priceMax: 1000000,
    rating: 0, availability: 'all', sortBy: 'newest', search: '',
  })

  const pageTitle = searchParams.get('filter') === 'new' ? 'New Arrivals'
    : searchParams.get('filter') === 'best-sellers' ? 'Best Sellers'
    : searchParams.get('filter') === 'flash-sale' ? 'Flash Sale'
    : searchParams.get('filter') === 'featured' ? 'Featured Products'
    : filters.category ? categories.find(c => c.slug === filters.category)?.name || 'All Products'
    : 'All Products'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold font-display text-gray-900">{pageTitle}</h1>
              <p className="text-gray-500 text-sm mt-1">{filtered.length} products found</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 md:flex-none">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.search}
                  onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-destiny-pink w-full md:w-60"
                />
                {filters.search && (
                  <button onClick={() => setFilters(prev => ({ ...prev, search: '' }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={filters.sortBy}
                  onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
                  className="pl-4 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-destiny-pink appearance-none bg-white cursor-pointer"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2.5 transition-colors ${view === 'grid' ? 'bg-destiny-pink text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2.5 transition-colors ${view === 'list' ? 'bg-destiny-pink text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                >
                  <List size={18} />
                </button>
              </div>

              {/* Filter Toggle (Mobile) */}
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="md:hidden flex items-center gap-2 px-4 py-2.5 bg-destiny-pink text-white rounded-xl text-sm font-medium"
              >
                <Filter size={16} /> Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`w-64 flex-shrink-0 ${filterOpen ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-2xl shadow-card p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-destiny-pink" /> Filters
                </h3>
                <button onClick={clearFilters} className="text-xs text-destiny-pink hover:underline">Clear all</button>
              </div>

              {/* Category */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 text-sm mb-3">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={!filters.category}
                      onChange={() => setFilters(prev => ({ ...prev, category: '' }))}
                      className="accent-destiny-pink"
                    />
                    <span className="text-sm text-gray-600">All Categories</span>
                  </label>
                  {categories.slice(0, 8).map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat.slug}
                        onChange={() => setFilters(prev => ({ ...prev, category: cat.slug }))}
                        className="accent-destiny-pink"
                      />
                      <span className="text-sm text-gray-600">{cat.icon} {cat.name}</span>
                      <span className="ml-auto text-xs text-gray-400">{cat.productCount}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 text-sm mb-3">Brand</h4>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.brand?.includes(brand.slug)}
                        onChange={() => toggleBrand(brand.slug)}
                        className="accent-destiny-pink rounded"
                      />
                      <span className="text-sm text-gray-600">{brand.name}</span>
                      <span className="ml-auto text-xs text-gray-400">{brand.productCount}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 text-sm mb-3">Price Range (FCFA)</h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin || ''}
                    onChange={e => setFilters(prev => ({ ...prev, priceMin: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-destiny-pink"
                  />
                  <span className="text-gray-400">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax === 1000000 ? '' : filters.priceMax}
                    onChange={e => setFilters(prev => ({ ...prev, priceMax: Number(e.target.value) || 1000000 }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-destiny-pink"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    { label: 'Under 50K', min: 0, max: 50000 },
                    { label: '50K–150K', min: 50000, max: 150000 },
                    { label: '150K–500K', min: 150000, max: 500000 },
                    { label: 'Over 500K', min: 500000, max: 9999999 },
                  ].map(range => (
                    <button
                      key={range.label}
                      onClick={() => setFilters(prev => ({ ...prev, priceMin: range.min, priceMax: range.max }))}
                      className="px-3 py-1 text-xs border border-gray-200 rounded-full hover:border-destiny-pink hover:text-destiny-pink transition-colors"
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 text-sm mb-3">Min Rating</h4>
                <div className="space-y-2">
                  {[4.5, 4, 3.5, 3].map(r => (
                    <label key={r} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === r}
                        onChange={() => setFilters(prev => ({ ...prev, rating: r }))}
                        className="accent-destiny-pink"
                      />
                      <span className="text-amber-400 text-sm">{'★'.repeat(Math.floor(r))}</span>
                      <span className="text-sm text-gray-600">{r}+ stars</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-3">Availability</h4>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Products' },
                    { value: 'in_stock', label: 'In Stock Only' },
                  ].map(opt => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="availability"
                        checked={filters.availability === opt.value}
                        onChange={() => setFilters(prev => ({ ...prev, availability: opt.value as any }))}
                        className="accent-destiny-pink"
                      />
                      <span className="text-sm text-gray-600">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search term</p>
                <button onClick={clearFilters} className="btn-destiny">Clear Filters</button>
              </div>
            ) : (
              <div className={
                view === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5'
                  : 'flex flex-col gap-4'
              }>
                {filtered.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                  >
                    <ProductCard product={product} variant={view === 'list' ? 'horizontal' : 'default'} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
