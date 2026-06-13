'use client'

import React, { useState, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyButtonProps {
  text: string
  label?: string
  size?: 'sm' | 'md'
  variant?: 'icon' | 'pill' | 'inline'
  className?: string
}

export default function CopyButton({ text, label, size = 'sm', variant = 'icon', className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text)
      } else {
        const el = document.createElement('textarea')
        el.value = text
        el.style.position = 'fixed'
        el.style.opacity = '0'
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // silently fail
    }
  }, [text])

  const icon = copied
    ? <Check size={size === 'sm' ? 13 : 15} className="text-green-500" />
    : <Copy size={size === 'sm' ? 13 : 15} />

  if (variant === 'pill') {
    return (
      <button
        onClick={copy}
        title={copied ? 'Copied!' : `Copy ${label || 'text'}`}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
          ${copied
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-destiny-pink hover:text-destiny-pink'
          } ${className}`}
      >
        {icon}
        {copied ? 'Copied!' : (label || 'Copy')}
      </button>
    )
  }

  if (variant === 'inline') {
    return (
      <button
        onClick={copy}
        title={copied ? 'Copied!' : 'Click to copy'}
        className={`inline-flex items-center gap-1 text-xs transition-colors
          ${copied ? 'text-green-600' : 'text-gray-400 hover:text-destiny-pink'}
          ${className}`}
      >
        {icon}
        <span>{copied ? 'Copied!' : 'Copy'}</span>
      </button>
    )
  }

  // default: icon only
  return (
    <button
      onClick={copy}
      title={copied ? 'Copied!' : `Copy ${label || 'text'}`}
      className={`p-1.5 rounded-lg transition-all
        ${copied
          ? 'bg-green-50 text-green-500'
          : 'text-gray-400 hover:bg-gray-100 hover:text-destiny-pink'
        } ${className}`}
    >
      {icon}
    </button>
  )
}
