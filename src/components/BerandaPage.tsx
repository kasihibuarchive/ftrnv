'use client'

import React, { useEffect, useState } from 'react'
import { ChevronRight, Sparkles, ArrowRight, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { proxyImageUrl } from '@/lib/image-proxy'
import { timeAgo, readingTime } from '@/lib/utils-shared'

interface Blog {
  id: string
  title: string
  slug: string
  excerpt?: string
  coverImage?: string
  isHighlight: boolean
  highlightType?: string
  category?: string
  createdAt: string
}

export default function BerandaPage() {
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
          Festival Teater Remaja Nusantara
        </div>
        <div className="mb-3">
          <Image
            src="/ftrn-text.png"
            alt="FTRN #5"
            width={140}
            height={48}
            className="object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>
        <p className="text-suri text-sm leading-relaxed max-w-sm font-medium">
          Merawat kekayaan budaya teater remaja Indonesia
        </p>
        <div className="zen-divider mt-8" />
      </div>

      {/* Headline */}
      {headline && (
        <div className="mb-8">
          <p className="text-[11px] font-bold tracking-[0.2em] text-matcha-light uppercase mb-4">
            Pengumuman
          </p>
          <Link
            href={`/blog/${headline.slug}`}
            className="w-full text-left group block"
          >
            <div className="headline-card overflow-hidden">
              {headline.coverImage && (
                <div className="relative w-full h-44 overflow-hidden">
                  <img
                    src={proxyImageUrl(headline.coverImage)}
                    alt={headline.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-matcha-light animate-pulse-soft" />
                    <span className="badge-urgent px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase">
                      Headline
                    </span>
                  </div>
                </div>
              )}
              <div className="p-6">
                {!headline.coverImage && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-matcha-light animate-pulse-soft" />
                    <span className="badge-urgent px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase">
                      Headline
                    </span>
                  </div>
                )}
                <h2 className="text-xl font-bold text-kinari leading-snug mb-3">
                  {headline.title}
                </h2>
                {headline.excerpt && (
                  <p className="text-sm text-kinari/50 leading-relaxed font-medium">
                    {headline.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between mt-5">
                  <p className="text-[11px] text-kinari/30 font-medium flex items-center gap-2">
                    <span>{timeAgo(headline.createdAt)}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {readingTime(headline.excerpt || headline.title)}
                    </span>
                  </p>
                  <span className="flex items-center gap-1 text-matcha-light text-xs font-semibold group-hover:gap-2 transition-all duration-300">
                    Baca <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
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
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="w-full text-left group block"
              >
                <div className="glass-zen-card overflow-hidden">
                  {blog.coverImage && (
                    <div className="relative w-full h-32 overflow-hidden">
                      <img
                        src={proxyImageUrl(blog.coverImage)}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </div>
                  )}
                  <div className="px-5 py-4 flex items-center gap-4">
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
                      <p className="text-[11px] text-kinari/20 mt-2 font-medium flex items-center gap-2">
                        <span>{timeAgo(blog.createdAt)}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {readingTime(blog.excerpt || blog.title)}
                        </span>
                      </p>
                    </div>
                    <div className="p-1.5 rounded-lg bg-matcha/5 group-hover:bg-matcha/10 transition-colors duration-300 shrink-0">
                      <ChevronRight className="w-4 h-4 text-kinari/15 group-hover:text-matcha-light transition-colors duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
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
