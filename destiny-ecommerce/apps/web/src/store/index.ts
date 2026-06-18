import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CartItem, Product, ProductVariant, User, Notification } from '@/types'

interface CartStore {
  items: CartItem[]
  couponCode: string
  discount: number
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  applyCoupon: (code: string) => boolean
  removeCoupon: () => void
  getSubtotal: () => number
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: '',
      discount: 0,

      addItem: (product, quantity = 1, variant) => {
        const items = get().items
        const existingIndex = items.findIndex(
          item => item.product.id === product.id && item.variant?.id === variant?.id
        )
        if (existingIndex >= 0) {
          const updated = [...items]
          updated[existingIndex].quantity += quantity
          set({ items: updated })
        } else {
          const newItem: CartItem = {
            id: `${product.id}-${variant?.id || 'default'}-${Date.now()}`,
            product,
            quantity,
            variant,
            price: variant?.price || product.price,
          }
          set({ items: [...items, newItem] })
        }
      },

      removeItem: (id) => set(state => ({ items: state.items.filter(i => i.id !== id) })),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set(state => ({
          items: state.items.map(i => i.id === id ? { ...i, quantity } : i)
        }))
      },

      clearCart: () => set({ items: [], couponCode: '', discount: 0 }),

      applyCoupon: (code) => {
        const validCoupons: Record<string, number> = {
          'DESTINY10': 10,
          'WELCOME20': 20,
          'FLASH15': 15,
          'AFRICA25': 25,
        }
        const discountPct = validCoupons[code.toUpperCase()]
        if (discountPct) {
          set({ couponCode: code.toUpperCase(), discount: discountPct })
          return true
        }
        return false
      },

      removeCoupon: () => set({ couponCode: '', discount: 0 }),

      getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const discount = get().discount
        const discountAmount = subtotal * (discount / 100)
        const shipping = subtotal > 50000 ? 0 : 2500
        return subtotal - discountAmount + shipping
      },

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'destiny-cart', storage: createJSONStorage(() => localStorage) }
  )
)

interface WishlistStore {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  toggleItem: (product: Product) => void
  isInWishlist: (id: string) => boolean
  clear: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        if (!get().isInWishlist(product.id)) {
          set(state => ({ items: [...state.items, product] }))
        }
      },
      removeItem: (id) => set(state => ({ items: state.items.filter(i => i.id !== id) })),
      toggleItem: (product) => {
        if (get().isInWishlist(product.id)) {
          get().removeItem(product.id)
        } else {
          get().addItem(product)
        }
      },
      isInWishlist: (id) => get().items.some(i => i.id === id),
      clear: () => set({ items: [] }),
    }),
    { name: 'destiny-wishlist', storage: createJSONStorage(() => localStorage) }
  )
)

interface UIStore {
  cartOpen: boolean
  searchOpen: boolean
  menuOpen: boolean
  compareItems: Product[]
  setCartOpen: (v: boolean) => void
  setSearchOpen: (v: boolean) => void
  setMenuOpen: (v: boolean) => void
  addToCompare: (product: Product) => void
  removeFromCompare: (id: string) => void
  clearCompare: () => void
}

export const useUIStore = create<UIStore>((set, get) => ({
  cartOpen: false,
  searchOpen: false,
  menuOpen: false,
  compareItems: [],
  setCartOpen: (v) => set({ cartOpen: v }),
  setSearchOpen: (v) => set({ searchOpen: v }),
  setMenuOpen: (v) => set({ menuOpen: v }),
  addToCompare: (product) => {
    const items = get().compareItems
    if (items.length < 3 && !items.find(i => i.id === product.id)) {
      set({ compareItems: [...items, product] })
    }
  },
  removeFromCompare: (id) => set(state => ({ compareItems: state.compareItems.filter(i => i.id !== id) })),
  clearCompare: () => set({ compareItems: [] }),
}))

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'destiny-auth', storage: createJSONStorage(() => localStorage) }
  )
)

interface NotificationStore {
  notifications: Notification[]
  unreadCount: number
  addNotification: (n: Notification) => void
  markAsRead: (id: string) => void
  markAllRead: () => void
  clear: () => void
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      addNotification: (n) => set(state => ({
        notifications: [n, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      })),
      markAsRead: (id) => set(state => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
        unreadCount: Math.max(0, state.unreadCount - 1),
      })),
      markAllRead: () => set(state => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
      })),
      clear: () => set({ notifications: [], unreadCount: 0 }),
    }),
    { name: 'destiny-notifications', storage: createJSONStorage(() => localStorage) }
  )
)
