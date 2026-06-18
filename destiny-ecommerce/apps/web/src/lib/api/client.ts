const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

async function request<T>(method: Method, path: string, data?: any, token?: string): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  })

  const json = await res.json().catch(() => ({}))

  if (!res.ok) {
    const message = json?.message || `HTTP ${res.status}`
    throw new Error(Array.isArray(message) ? message.join(', ') : message)
  }

  return json
}

export const api = {
  get: <T>(path: string, token?: string) => request<T>('GET', path, undefined, token),
  post: <T>(path: string, data?: any, token?: string) => request<T>('POST', path, data, token),
  patch: <T>(path: string, data?: any, token?: string) => request<T>('PATCH', path, data, token),
  put: <T>(path: string, data?: any, token?: string) => request<T>('PUT', path, data, token),
  delete: <T>(path: string, token?: string) => request<T>('DELETE', path, undefined, token),
}

export default api
