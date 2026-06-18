import api from './client'

export interface CreateOrderPayload {
  items: Array<{ productId: string; variantId?: string; quantity: number }>
  paymentMethod: string
  shippingAddressId?: string
  shippingAddress?: any
  couponCode?: string
  notes?: string
}

export const ordersApi = {
  create: (data: CreateOrderPayload, token: string) => api.post<any>('/orders', data, token),
  getAll: (token: string, params?: Record<string, any>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return api.get<any>(`/orders${qs}`, token)
  },
  getOne: (id: string, token: string) => api.get<any>(`/orders/${id}`, token),
  cancel: (id: string, reason: string, token: string) => api.post<any>(`/orders/${id}/cancel`, { reason }, token),
  submitPaymentProof: (data: { orderId: string; transactionId: string; senderNumber: string; amount: number; screenshotUrl?: string }, token: string) =>
    api.post<any>('/orders/submit-payment', data, token),
  getPaymentInstructions: (method: string, amount: number, orderNumber: string) =>
    api.get<any>(`/payments/instructions/${method}?amount=${amount}&orderNumber=${orderNumber}`),
  validateCoupon: (code: string, subtotal: number, token: string) =>
    api.post<any>('/coupons/validate', { code, subtotal }, token),
}
