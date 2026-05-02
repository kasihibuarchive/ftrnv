'use client'

import React, { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'

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
    if (days === 0) return 'きょう'
    if (days === 1) return 'きのう'
    if (days < 7) return `${days}日前`
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }

  if (loading) {
    return (
      <div className="px-6 py-10 space-y-8">
        <div className="h-8 bg-kinari/[0.03] rounded w-1/3 animate-pulse" />
        <div className="glass-zen-card p-6 animate-pulse">
          <div className="h-5 bg-kinari/[0.03] rounded w-3/4 mb-3" />
          <div className="h-3 bg-kinari/[0.03] rounded w-full mb-2" />
          <div className="h-3 bg-kinari/[0.03] rounded w-2/3" />
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 pt-10 pb-6">
      {/* Hero — Zen breathing space */}
      <div className="mb-12">
        <p className="text-matcha-light/40 text-[10px] tracking-[0.3em] uppercase mb-3">
          Festival Tari Tradisional Nasional
        </p>
        <h1 className="text-3xl font-light text-kinari/90 tracking-wide leading-relaxed">
          FTRN<span className="text-matcha-light ml-2">#5</span>
        </h1>
        <p className="text-suri text-sm mt-3 leading-relaxed max-w-sm">
          メラワン ケカヤan ブダヤ タリ トラディシオナル インドネシア
        </p>
        <div className="zen-divider mt-8" />
      </div>

      {/* Headline */}
      {headline && (
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.25em] text-matcha-light/40 uppercase mb-4">
            おしらせ
          </p>
          <button
            onClick={() => onBlogClick(headline.id)}
            className="w-full text-left group"
          >
            <div className="glass-zen-card p-6 group-hover:border-matcha/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-matcha-light animate-pulse" />
                <span className="text-[10px] tracking-[0.2em] text-matcha-light/60 uppercase">
                  Headline
                </span>
              </div>
              <h2 className="text-lg font-light text-kinari/90 leading-relaxed mb-2">
                {headline.title}
              </h2>
              {headline.excerpt && (
                <p className="text-sm text-suri leading-relaxed">
                  {headline.excerpt}
                </p>
              )}
              <p className="text-[10px] text-kinari/20 mt-4 tracking-wider">
                {timeAgo(headline.createdAt)}
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <div>
          <p className="text-[10px] tracking-[0.25em] text-matcha-light/40 uppercase mb-4">
            あたらしい
          </p>
          <div className="space-y-3">
            {featured.map((blog) => (
              <button
                key={blog.id}
                onClick={() => onBlogClick(blog.id)}
                className="w-full text-left group"
              >
                <div className="glass-zen-card px-5 py-4 flex items-center gap-4 group-hover:border-matcha/15">
                  <div className="flex-1 min-w-0">
                    {blog.category && (
                      <span className="text-[9px] tracking-[0.2em] text-matcha/50 uppercase">
                        {blog.category}
                      </span>
                    )}
                    <h3 className="text-sm font-light text-kinari/80 leading-relaxed mt-0.5">
                      {blog.title}
                    </h3>
                    <p className="text-[10px] text-kinari/20 mt-1.5 tracking-wider">
                      {timeAgo(blog.createdAt)}
                    </p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-kinari/10 group-hover:text-matcha-light/40 transition-colors duration-500 shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty */}
      {!headline && featured.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-suri/50 text-sm">まだ おしらせ が ありません</p>
        </div>
      )}
    </div>
  )
}
