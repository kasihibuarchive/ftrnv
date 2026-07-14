'use client'

import React, { useEffect, useState } from 'react'
import { ShoppingBag, Eye, Box, Package } from 'lucide-react'
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

const categories = ['Semua', 'tshirt', 'stiker', 'totebag', 'topi', 'custom']

const categoryLabels: Record<string, string> = {
  tshirt: 'T-Shirt',
  stiker: 'Stiker',
  totebag: 'Totebag',
  topi: 'Topi',
  custom: 'Custom',
}

function formatPrice(price: number) {
  return `Rp ${price.toLocaleString('id-ID')}`
}

export default function MerchPage() {
  const [merch, setMerch] = useState<MerchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('Semua')

  useEffect(() => {
    fetchMerch()
  }, [])

  const fetchMerch = async () => {
    try {
      const res = await fetch('/api/merch')
      if (res.ok) setMerch(await res.json())
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }

  const filtered = merch.filter((m) => {
    const matchCat = activeCategory === 'Semua' || m.category === activeCategory
    return matchCat
  })

  return (
    <div className="px-6 pt-8 pb-6">
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-kinari">
          Merch
          <span className="green-gradient ml-2 text-lg">Official</span>
        </h2>
        <p className="text-xs text-kinari/30 mt-1 font-medium">
          Koleksi merchandise resmi FTRN #5
        </p>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wide whitespace-nowrap transition-all duration-300 ${
              activeCategory === cat
                ? 'badge-matcha'
                : 'text-kinari/25 border border-kinari/[0.06] hover:border-matcha/20 hover:text-kinari/40'
            }`}
          >
            {cat === 'Semua' ? 'Semua' : categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* Merch grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-zen-card p-4 animate-pulse">
              <div className="aspect-square bg-kinari/[0.04] rounded-lg mb-3" />
              <div className="h-3 bg-kinari/[0.04] rounded w-2/3 mb-2" />
              <div className="h-3 bg-kinari/[0.02] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <div className="icon-circle w-14 h-14 mx-auto mb-3 flex items-center justify-center">
            <Package className="w-5 h-5 text-matcha-light/30" />
          </div>
          <p className="text-kinari/30 text-sm font-semibold">
            Merchandise belum tersedia
          </p>
          <p className="text-kinari/15 text-xs mt-1 font-medium">
            Nantikan koleksi merchandise FTRN #5
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="glass-zen-card overflow-hidden group"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-kinari/[0.02]">
                {item.imageUrl ? (
                  <img
                    src={proxyImageUrl(item.imageUrl)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-kinari/[0.06]" />
                  </div>
                )}
                {/* 3D Badge */}
                {item.is3D && item.modelUrl && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-matcha/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                    <Box className="w-2.5 h-2.5 text-matcha-light" />
                    <span className="text-[8px] font-bold text-matcha-light tracking-wider">
                      3D
                    </span>
                  </div>
                )}
                {/* Category badge */}
                <div className="absolute top-2 left-2">
                  <span className="badge-matcha px-2 py-0.5 text-[8px] font-bold tracking-wider uppercase">
                    {categoryLabels[item.category] || item.category}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="text-xs font-semibold text-kinari/70 leading-snug line-clamp-2 mb-1.5">
                  {item.name}
                </h3>
                <p className="text-sm font-bold text-matcha-light/70 mb-2.5">
                  {formatPrice(item.price)}
                </p>
                <button className="w-full flex items-center justify-center gap-1.5 bg-matcha/10 hover:bg-matcha/20 text-matcha-light/60 hover:text-matcha-light text-[10px] font-semibold tracking-wider py-2 rounded-lg transition-all duration-300">
                  <Eye className="w-3 h-3" />
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
