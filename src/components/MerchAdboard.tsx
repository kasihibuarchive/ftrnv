'use client'

import React, { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { proxyImageUrl } from '@/lib/image-proxy'

interface MerchItem {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  imageUrl: string | null
  category: string
  is3D: boolean
  modelUrl: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

function formatPrice(price: number) {
  return `Rp ${price.toLocaleString('id-ID')}`
}

export default function MerchAdboard() {
  const [merch, setMerch] = useState<MerchItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMerch()
  }, [])

  const fetchMerch = async () => {
    try {
      const res = await fetch('/api/merch')
      if (res.ok) {
        const data = await res.json()
        setMerch(data.slice(0, 8)) // Show max 8 items
      }
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }

  // Don't render if no merch or still loading
  if (loading || merch.length === 0) return null

  return (
    <div className="px-6 pb-6">
      <div className="flex items-center gap-2 mb-3">
        <ShoppingBag className="w-3.5 h-3.5 text-primary/40" />
        <span className="text-[10px] font-semibold text-foreground/30 tracking-wider uppercase">
          Merchandise
        </span>
      </div>

      {/* Horizontal scrollable row */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {merch.map((item) => (
          <a
            key={item.id}
            href="/"
            onClick={(e) => {
              e.preventDefault()
              // For now, just scroll to top — in the future this would navigate to merch tab
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="shrink-0 w-[120px] group"
          >
            <div className="glass-zen-card overflow-hidden">
              {/* Thumbnail */}
              <div className="relative w-full h-[90px] overflow-hidden bg-foreground/[0.02]">
                {item.imageUrl ? (
                  <img
                    src={proxyImageUrl(item.imageUrl)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-foreground/[0.06]" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-2">
                <p className="text-[10px] font-semibold text-foreground/55 line-clamp-1 leading-tight mb-0.5">
                  {item.name}
                </p>
                <p className="text-[10px] font-bold text-primary/60">
                  {formatPrice(item.price)}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
