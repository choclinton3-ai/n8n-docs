import api from './client'

export const productsApi = {
  getAll: (params?: Record<string, any>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return api.get<any>(`/products${qs}`)
  },
  getBySlug: (slug: string) => api.get<any>(`/products/${slug}`),
  getFeatured: () => api.get<any[]>('/products/featured'),
  getNewArrivals: () => api.get<any[]>('/products/new-arrivals'),
  getBestSellers: () => api.get<any[]>('/products/best-sellers'),
  getFlashSale: () => api.get<any[]>('/products/flash-sale'),
  getRelated: (id: string) => api.get<any[]>(`/products/${id}/related`),
  create: (data: any, token: string) => api.post<any>('/products', data, token),
  update: (id: string, data: any, token: string) => api.put<any>(`/products/${id}`, data, token),
  remove: (id: string, token: string) => api.delete<any>(`/products/${id}`, token),
  search: (q: string, filters?: any) => {
    const params = { q, ...filters }
    const qs = '?' + new URLSearchParams(params).toString()
    return api.get<any>(`/search${qs}`)
  },
  suggestions: (q: string) => api.get<any[]>(`/search/suggestions?q=${encodeURIComponent(q)}`),
  getCategories: () => api.get<any[]>('/categories'),
  getBrands: () => api.get<any[]>('/brands'),
}
