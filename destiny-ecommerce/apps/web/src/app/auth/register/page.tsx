'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Phone, Eye, EyeOff, CheckCircle } from 'lucide-react'

const requirements = [
  { label: 'At least 8 characters', test: (v: string) => v.length >= 8 },
  { label: 'Contains uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'Contains a number', test: (v: string) => /[0-9]/.test(v) },
]

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', agree: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { alert('Passwords do not match'); return }
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-destiny-50 to-white flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-destiny-gradient rounded-2xl flex items-center justify-center shadow-destiny">
                <span className="text-white font-black text-xl font-display">D</span>
              </div>
              <div className="text-left">
                <div className="font-black text-lg text-destiny-pink font-display">DESTINY</div>
                <div className="text-gray-400 text-xs tracking-widest">E-COMMERCE</div>
              </div>
            </Link>
            <h1 className="text-2xl font-black font-display text-gray-900">Create Account</h1>
            <p className="text-gray-500 mt-1 text-sm">Join thousands of happy shoppers in Cameroon</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'firstName', label: 'First Name', icon: User },
                { key: 'lastName', label: 'Last Name', icon: User },
              ].map(({ key, label, icon: Icon }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label} *</label>
                  <div className="relative">
                    <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={form[key as keyof typeof form] as string}
                      onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                      className="input-destiny pl-10 text-sm"
                      placeholder={label}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="input-destiny pl-10" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="tel" required value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className="input-destiny pl-10" placeholder="+237 6XX XXX XXX" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="input-destiny pl-10 pr-11" placeholder="Create a strong password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 space-y-1">
                  {requirements.map(req => (
                    <div key={req.label} className={`flex items-center gap-2 text-xs ${req.test(form.password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <CheckCircle size={12} className={req.test(form.password) ? 'text-green-500' : 'text-gray-300'} />
                      {req.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password *</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" required value={form.confirmPassword}
                  onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  className={`input-destiny pl-10 ${form.confirmPassword && form.confirmPassword !== form.password ? 'border-red-400 focus:border-red-500' : ''}`}
                  placeholder="Confirm your password" />
              </div>
              {form.confirmPassword && form.confirmPassword !== form.password && (
                <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required checked={form.agree} onChange={e => setForm(p => ({ ...p, agree: e.target.checked }))}
                className="accent-destiny-pink mt-0.5 w-4 h-4" />
              <span className="text-sm text-gray-600">
                I agree to Destiny E-Commerce's{' '}
                <Link href="/terms" className="text-destiny-pink font-medium hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-destiny-pink font-medium hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <button type="submit" className="w-full btn-destiny">Create Account</button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-destiny-pink font-semibold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
