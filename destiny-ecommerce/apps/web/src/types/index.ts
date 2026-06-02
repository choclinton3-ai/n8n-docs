export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  originalPrice?: number
  discount?: number
  currency: 'FCFA' | 'USD'
  images: string[]
  thumbnail: string
  category: Category
  brand: Brand
  rating: number
  reviewCount: number
  stock: number
  sku: string
  tags: string[]
  specifications: Specification[]
  variants?: ProductVariant[]
  isNew?: boolean
  isFeatured?: boolean
  isBestSeller?: boolean
  isFlashSale?: boolean
  flashSaleEnd?: string
  warranty?: string
  colors?: string[]
  inStock: boolean
  soldCount: number
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  name: string
  value: string
  price?: number
  stock: number
  image?: string
}

export interface Specification {
  label: string
  value: string
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  image: string
  productCount: number
  parentId?: string
  children?: Category[]
  description?: string
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo: string
  description?: string
  productCount: number
  country?: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  variant?: ProductVariant
  price: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  discount: number
  tax: number
  shipping: number
  total: number
  coupon?: Coupon
}

export interface Coupon {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrder?: number
  maxDiscount?: number
  expiresAt: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  role: 'customer' | 'admin' | 'vendor' | 'delivery'
  emailVerified: boolean
  addresses: Address[]
  createdAt: string
}

export interface Address {
  id: string
  label: string
  firstName: string
  lastName: string
  phone: string
  street: string
  city: string
  region: string
  country: string
  isDefault: boolean
}

export interface Order {
  id: string
  orderNumber: string
  user: User
  items: OrderItem[]
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentMethod: string
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  shippingAddress: Address
  billingAddress: Address
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
  estimatedDelivery?: string
}

export interface OrderItem {
  id: string
  product: Product
  quantity: number
  price: number
  variant?: ProductVariant
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Review {
  id: string
  user: User
  product: Product
  rating: number
  title: string
  comment: string
  images?: string[]
  verified: boolean
  helpful: number
  createdAt: string
}

export interface Banner {
  id: string
  title: string
  subtitle: string
  description?: string
  image: string
  link: string
  buttonText: string
  position: 'hero' | 'mid' | 'side'
  isActive: boolean
}

export interface FilterState {
  category?: string
  brand?: string[]
  priceMin?: number
  priceMax?: number
  rating?: number
  availability?: 'all' | 'in_stock' | 'out_of_stock'
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular'
  search?: string
  page?: number
  limit?: number
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'order' | 'promo' | 'system' | 'delivery'
  read: boolean
  link?: string
  createdAt: string
}
