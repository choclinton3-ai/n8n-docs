'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { authApi } from '@/lib/api/auth.api'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await authApi.forgotPassword(email)
      setSent(true)
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-destiny-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {sent ? <CheckCircle size={32} className="text-green-500" /> : <Mail size={32} className="text-destiny-pink" />}
          </div>
          <h1 className="text-2xl font-black text-gray-900 font-display">
            {sent ? 'Check Your Email' : 'Forgot Password?'}
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {sent
              ? `We sent a reset link to ${email}. Check your inbox and spam folder.`
              : 'Enter your email and we\'ll send you a reset link.'}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-destiny"
              />
            </div>
            <button type="submit" disabled={loading} className="btn-destiny w-full">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700 text-center">
              Password reset link sent! It expires in 2 hours.
            </div>
            <button
              onClick={() => { setSent(false); setEmail('') }}
              className="w-full py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-destiny-pink hover:text-destiny-pink transition-colors"
            >
              Try a different email
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/auth/login" className="text-sm text-destiny-pink font-medium hover:underline flex items-center justify-center gap-1">
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
