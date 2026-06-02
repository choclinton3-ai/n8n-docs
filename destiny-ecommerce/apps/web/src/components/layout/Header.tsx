'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ShoppingCart, Heart, User, Menu, X, Bell,
  ChevronDown, Phone, Mail, MapPin, Truck, Shield, Headphones
} from 'lucide-react'
import { useCartStore, useWishlistStore, useUIStore, useAuthStore } from '@/store'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop', hasDropdown: true },
  { label: 'Categories', href: '/shop/categories' },
  { label: 'Deals', href: '/shop?filter=flash-sale' },
  { label: 'Brands', href: '/shop?view=brands' },
  { label: 'Contact', href: '/contact' },
]

const shopDropdown = [
  { label: 'New Arrivals', href: '/shop?filter=new', icon: '✨' },
  { label: 'Best Sellers', href: '/shop?filter=best-sellers', icon: '🏆' },
  { label: 'Flash Sales', href: '/shop?filter=flash-sale', icon: '⚡' },
  { label: 'Smartphones', href: '/shop?category=smartphones', icon: '📱' },
  { label: 'Laptops', href: '/shop?category=laptops', icon: '💻' },
  { label: 'Headphones', href: '/shop?category=headphones', icon: '🎧' },
  { label: 'Smart Watches', href: '/shop?category=smart-watches', icon: '⌚' },
  { label: 'Gaming', href: '/shop?category=gaming', icon: '🎮' },
]

export default function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const cartCount = useCartStore(s => s.getItemCount())
  const wishlistCount = useWishlistStore(s => s.items.length)
  const { cartOpen, setCartOpen, searchOpen, setSearchOpen, menuOpen, setMenuOpen } = useUIStore()
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Top Bar */}
      <div className="bg-destiny-pink text-white text-xs py-2 hidden md:block">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="tel:+237650000000" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <Phone size={12} /> +237 650 000 000
            </a>
            <a href="mailto:hello@destinyecommerce.cm" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              <Mail size={12} /> hello@destinyecommerce.cm
            </a>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1"><Truck size={12} /> Free delivery over 50,000 FCFA</span>
            <span className="flex items-center gap-1"><Shield size={12} /> Secure payments</span>
            <span className="flex items-center gap-1"><Headphones size={12} /> 24/7 Support</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 bg-white transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-sm'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-destiny-gradient rounded-full flex items-center justify-center shadow-destiny">
                <span className="text-white font-black text-lg md:text-xl font-display">D</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-black text-lg md:text-xl leading-tight font-display">
                  <span className="text-destiny-pink">DESTINY</span>
                </div>
                <div className="text-gray-500 text-xs leading-tight font-semibold tracking-widest">
                  E-COMMERCE
                </div>
              </div>
            </Link>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-xl mx-6">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border-2 border-destiny-100 focus:border-destiny-pink focus:outline-none text-sm transition-all"
                />
                <button className="absolute right-0 top-0 h-full px-4 bg-destiny-pink text-white rounded-r-xl hover:bg-destiny-deep-pink transition-colors">
                  <Search size={18} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Search (Mobile) */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-destiny-pink transition-colors"
              >
                <Search size={22} />
              </button>

              {/* Wishlist */}
              <Link href="/shop/wishlist" className="hidden sm:flex p-2 text-gray-600 hover:text-destiny-pink transition-colors relative">
                <Heart size={22} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destiny-pink text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="flex p-2 text-gray-600 hover:text-destiny-pink transition-colors relative"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-destiny-pink text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>

              {/* User */}
              {isAuthenticated ? (
                <Link href="/shop/account" className="hidden sm:flex items-center gap-2 p-2 text-gray-600 hover:text-destiny-pink transition-colors">
                  <div className="w-8 h-8 bg-destiny-pink rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user?.firstName?.[0]?.toUpperCase() || 'U'}
                  </div>
                </Link>
              ) : (
                <Link href="/auth/login" className="hidden sm:flex items-center gap-2 bg-destiny-pink text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-destiny-deep-pink transition-colors">
                  <User size={16} />
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-destiny-pink transition-colors"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 pb-3">
            {navLinks.map(link => (
              <div key={link.href} className="relative group">
                {link.hasDropdown ? (
                  <button
                    onMouseEnter={() => setShopDropdownOpen(true)}
                    onMouseLeave={() => setShopDropdownOpen(false)}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      pathname === link.href
                        ? 'text-destiny-pink bg-destiny-50'
                        : 'text-gray-600 hover:text-destiny-pink hover:bg-destiny-50'
                    }`}
                  >
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform ${shopDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link
                    href={link.href}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      pathname === link.href
                        ? 'text-destiny-pink bg-destiny-50'
                        : 'text-gray-600 hover:text-destiny-pink hover:bg-destiny-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                )}

                {/* Shop Dropdown */}
                {link.hasDropdown && (
                  <div
                    onMouseEnter={() => setShopDropdownOpen(true)}
                    onMouseLeave={() => setShopDropdownOpen(false)}
                    className={`absolute top-full left-0 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 transition-all duration-200 ${
                      shopDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}
                  >
                    {shopDropdown.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-destiny-pink hover:bg-destiny-50 transition-colors"
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-gray-100 overflow-hidden"
            >
              <div className="p-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    autoFocus
                    className="w-full pl-4 pr-12 py-3 rounded-xl border-2 border-destiny-100 focus:border-destiny-pink focus:outline-none text-sm"
                  />
                  <button className="absolute right-0 top-0 h-full px-4 bg-destiny-pink text-white rounded-r-xl">
                    <Search size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="font-black text-xl text-destiny-pink font-display">DESTINY</div>
                <button onClick={() => setMenuOpen(false)} className="p-2 text-gray-500 hover:text-destiny-pink">
                  <X size={24} />
                </button>
              </div>

              {isAuthenticated ? (
                <div className="flex items-center gap-3 p-4 bg-destiny-50 rounded-2xl mb-6">
                  <div className="w-12 h-12 bg-destiny-pink rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user?.firstName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 mb-6">
                  <Link
                    href="/auth/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 bg-destiny-pink text-white text-center py-3 rounded-xl font-semibold text-sm hover:bg-destiny-deep-pink transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 border-2 border-destiny-pink text-destiny-pink text-center py-3 rounded-xl font-semibold text-sm hover:bg-destiny-50 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}

              <nav className="space-y-1">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      pathname === link.href
                        ? 'text-destiny-pink bg-destiny-50'
                        : 'text-gray-700 hover:text-destiny-pink hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                <Link href="/shop/wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-destiny-pink">
                  <Heart size={20} /> Wishlist ({wishlistCount})
                </Link>
                <Link href="/shop/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-destiny-pink">
                  <Truck size={20} /> My Orders
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  )
}
