'use client'

import React, { useEffect, useState } from 'react'
import { ChevronRight, Sparkles, ArrowRight } from 'lucide-react'

interface Blog {
  id: string
  title: string
  excerpt?: string
  coverImage?: string
  isHighlight: boolean
  highlightType?: string
  category?: string
  createdAt: string
}

interface BerandaPageProps {
  onBlogClick: (blogId: string) => void
}

export default function BerandaPage({ onBlogClick }: BerandaPageProps) {
  const [headline, setHeadline] = useState<Blog | null>(null)
  const [featured, setFeatured] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHighlights()
  }, [])

  const fetchHighlights = async () => {
    try {
      const res = await fetch('/api/blogs?highlight=true')
      if (res.ok) {
        const data = await res.json()
        setHeadline(data.find((b: Blog) => b.highlightType === 'headline') || null)
        setFeatured(data.filter((b: Blog) => b.highlightType === 'featured'))
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Hari ini'
    if (days === 1) return 'Kemarin'
    if (days < 7) return `${days} hari lalu`
    if (days < 30) return `${Math.floor(days / 7)} minggu lalu`
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }

  if (loading) {
    return (
      <div className="px-6 py-10 space-y-8">
        <div className="h-10 bg-kinari/[0.03] rounded w-1/2 animate-pulse" />
        <div className="headline-card p-6 animate-pulse">
          <div className="h-6 bg-kinari/[0.04] rounded w-3/4 mb-3" />
          <div className="h-3 bg-kinari/[0.03] rounded w-full mb-2" />
          <div className="h-3 bg-kinari/[0.03] rounded w-2/3" />
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 pt-8 pb-6">
      {/* Hero — Bold & Dynamic */}
      <div className="mb-10">
        <div className="badge-matcha px-3 py-1 inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase mb-4">
          <Sparkles className="w-3 h-3" />
          Festival Tari Tradisional Nasional
        </div>
        <h1 className="text-4xl font-bold text-kinari leading-tight mb-3">
          FTRN
          <span className="green-gradient ml-2">#5</span>
        </h1>
        <p className="text-suri text-sm leading-relaxed max-w-sm font-medium">
          Merawat kekayaan budaya tari tradisional Indonesia
        </p>
        <div className="zen-divider mt-8" />
      </div>

      {/* Headline */}
      {headline && (
        <div className="mb-8">
          <p className="text-[11px] font-bold tracking-[0.2em] text-matcha-light uppercase mb-4">
            Pengumuman
          </p>
          <button
            onClick={() => onBlogClick(headline.id)}
            className="w-full text-left group"
          >
            <div className="headline-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-matcha-light animate-pulse-soft" />
                <span className="badge-urgent px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase">
                  Headline
                </span>
              </div>
              <h2 className="text-xl font-bold text-kinari leading-snug mb-3">
                {headline.title}
              </h2>
              {headline.excerpt && (
                <p className="text-sm text-kinari/50 leading-relaxed font-medium">
                  {headline.excerpt}
                </p>
              )}
              <div className="flex items-center justify-between mt-5">
                <p className="text-[11px] text-kinari/30 font-medium">
                  {timeAgo(headline.createdAt)}
                </p>
                <span className="flex items-center gap-1 text-matcha-light text-xs font-semibold group-hover:gap-2 transition-all duration-300">
                  Baca <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <div>
          <p className="text-[11px] font-bold tracking-[0.2em] text-matcha-light uppercase mb-4">
            Terbaru
          </p>
          <div className="space-y-3">
            {featured.map((blog) => (
              <button
                key={blog.id}
                onClick={() => onBlogClick(blog.id)}
                className="w-full text-left group"
              >
                <div className="glass-zen-card px-5 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {blog.category && (
                        <span className="badge-matcha px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase">
                          {blog.category}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-kinari/85 leading-snug">
                      {blog.title}
                    </h3>
                    {blog.excerpt && (
                      <p className="text-xs text-kinari/30 mt-1.5 line-clamp-1 font-medium">
                        {blog.excerpt}
                      </p>
                    )}
                    <p className="text-[11px] text-kinari/20 mt-2 font-medium">
                      {timeAgo(blog.createdAt)}
                    </p>
                  </div>
                  <div className="p-1.5 rounded-lg bg-matcha/5 group-hover:bg-matcha/10 transition-colors duration-300 shrink-0">
                    <ChevronRight className="w-4 h-4 text-kinari/15 group-hover:text-matcha-light transition-colors duration-300" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty */}
      {!headline && featured.length === 0 && (
        <div className="py-20 text-center">
          <div className="icon-circle w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-matcha-light/40" />
          </div>
          <p className="text-kinari/40 text-sm font-semibold">Belum ada pengumuman</p>
          <p className="text-kinari/20 text-xs mt-1 font-medium">Nantikan info terbaru dari FTRN #5</p>
        </div>
      )}
    </div>
  )
}
