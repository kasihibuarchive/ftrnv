'use client'

import React, { useEffect, useState } from 'react'
import { ShoppingBag, Eye, Box, Package, X, ExternalLink } from 'lucide-react'
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
  modelType: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

const categoryLabels: Record<string, string> = {
  tshirt: 'T-Shirt',
  stiker: 'Stiker',
  totebag: 'Totebag',
  topi: 'Topi',
  custom: 'Custom',
}

const modelTypeLabels: Record<string, string> = {
  embed: '3D Viewer',
  sketchfab: 'Sketchfab',
  spline: 'Spline 3D',
  video: 'Video Preview',
  ar: 'AR Link',
}

const WA_NUMBER = '6285173371536' // Ghani
const WA_LABEL = 'Ghani'

function formatPrice(price: number) {
  return `Rp ${price.toLocaleString('id-ID')}`
}

export default function MerchAdboard() {
  const [merch, setMerch] = useState<MerchItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMerch, setSelectedMerch] = useState<MerchItem | null>(null)

  useEffect(() => {
    fetchMerch()
  }, [])

  const fetchMerch = async () => {
    try {
      const res = await fetch('/api/merch')
      if (res.ok) {
        const data = await res.json()
        setMerch(data.slice(0, 8))
      }
    } catch {
      /* */
    } finally {
      setLoading(false)
    }
  }

  const closeDetail = () => {
    setSelectedMerch(null)
  }

  const handle3DAction = (item: MerchItem) => {
    if (!item.modelUrl) return
    const type = item.modelType || 'embed'
    if (type === 'spline') {
      return
    }
    switch (type) {
      case 'sketchfab':
      case 'ar':
      case 'video':
        window.open(item.modelUrl, '_blank')
        break
      default:
        break
    }
  }

  const openWhatsApp = (item: MerchItem) => {
    const msg = encodeURIComponent(`Halo ${WA_LABEL}, saya tertarik dengan merchandise "${item.name}" (${formatPrice(item.price)}) dari FTRN #5. Apakah masih tersedia?`)
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank')
  }

  if (loading || merch.length === 0) return null

  return (
    <>
      <div className="px-6 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag className="w-3.5 h-3.5 text-primary/40" />
          <span className="text-[10px] font-semibold text-foreground/30 tracking-wider uppercase">
            Merchandise
          </span>
        </div>

        {/* Horizontal scrollable row */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {merch.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedMerch(item)}
              className="shrink-0 w-[110px] group text-left"
            >
              <div className="relative w-full h-[90px] overflow-hidden rounded-lg bg-foreground/[0.02] mb-2">
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
                {/* 3D Badge */}
                {item.is3D && item.modelUrl && (
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-1 bg-white/15 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
                    <Box className="w-2 h-2 text-white/80" />
                    <span className="text-[7px] font-bold text-white/80 tracking-wider">
                      3D
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[10px] font-semibold text-foreground/55 line-clamp-1 leading-tight mb-0.5">
                {item.name}
              </p>
              <p className="text-[10px] font-bold text-primary/60">
                {formatPrice(item.price)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedMerch && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center"
          onClick={closeDetail}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Modal Sheet */}
          <div
            className="relative w-full max-w-2xl max-h-[85vh] glass-zen-strong rounded-t-2xl overflow-y-auto no-scrollbar animate-in slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close handle */}
            <div className="sticky top-0 z-10 flex justify-center pt-3 pb-2" style={{ background: 'var(--popover)' }}>
              <div className="w-10 h-1 rounded-full bg-foreground/15" />
            </div>

            {/* Close button */}
            <button
              onClick={closeDetail}
              className="absolute top-3 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-foreground/5 hover:bg-foreground/10 transition-colors duration-200"
            >
              <X className="w-4 h-4 text-foreground/40" />
            </button>

            <div className="px-6 pb-8">
              {/* Image */}
              {selectedMerch.imageUrl && (
                <div className="relative w-full aspect-square max-h-[40vh] overflow-hidden rounded-lg mb-6">
                  <img
                    src={proxyImageUrl(selectedMerch.imageUrl)}
                    alt={selectedMerch.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedMerch.is3D && selectedMerch.modelUrl && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/15 backdrop-blur-sm text-white/90 px-2.5 py-1 text-[9px] font-bold tracking-wider rounded-full flex items-center gap-1.5">
                        <Box className="w-3 h-3" />
                        {modelTypeLabels[selectedMerch.modelType || 'embed'] || '3D'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* 3D Viewer — Spline / Embed */}
              {selectedMerch.is3D && selectedMerch.modelUrl && (
                <div className="mb-5">
                  {selectedMerch.modelType === 'spline' ? (
                    <div className="rounded-lg overflow-hidden border border-border bg-foreground/[0.02]" style={{ height: '320px' }}>
                      <iframe
                        src={selectedMerch.modelUrl}
                        frameBorder="0"
                        width="100%"
                        height="100%"
                        allow="autoplay"
                        title="3D Preview"
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                  ) : selectedMerch.modelType === 'embed' ? (
                    <div className="rounded-lg overflow-hidden border border-border bg-foreground/[0.02]">
                      <model-viewer
                        src={selectedMerch.modelUrl}
                        auto-rotate
                        camera-controls
                        style={{ width: '100%', height: '300px' }}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => handle3DAction(selectedMerch)}
                      className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary border border-primary/15 rounded-lg py-3 text-xs font-semibold tracking-wider hover:bg-primary/18 transition-colors duration-300"
                    >
                      {selectedMerch.modelType === 'video' ? (
                        <>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          Tonton Video Preview
                        </>
                      ) : selectedMerch.modelType === 'ar' ? (
                        <>
                          <Box className="w-4 h-4" />
                          Buka AR Experience
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4" />
                          Lihat di {modelTypeLabels[selectedMerch.modelType || 'sketchfab']}
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Category badge */}
              <span className="badge-matcha px-2.5 py-1 text-[9px] font-bold tracking-wider uppercase mb-3 inline-block">
                {categoryLabels[selectedMerch.category] || selectedMerch.category}
              </span>

              {/* Name */}
              <h2 className="text-xl font-bold text-foreground leading-snug mb-2">
                {selectedMerch.name}
              </h2>

              {/* Price */}
              <p className="text-lg font-bold text-primary mb-4">
                {formatPrice(selectedMerch.price)}
              </p>

              {/* Description */}
              {selectedMerch.description && (
                <p className="text-sm text-foreground/55 leading-relaxed font-medium mb-6">
                  {selectedMerch.description}
                </p>
              )}

              {/* CTA — WhatsApp */}
              <button
                onClick={() => openWhatsApp(selectedMerch)}
                className="cta-button w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Hubungi via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
