'use client'

import React, { useEffect, useState } from 'react'
import { ChevronRight, ArrowRight, Clock, Megaphone } from 'lucide-react'
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

interface BerandaPageProps {
  isDark: boolean
}

export default function BerandaPage({ isDark }: BerandaPageProps) {
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
        <div className="h-10 bg-foreground/[0.03] rounded w-1/2 animate-pulse" />
        <div className="h-44 bg-foreground/[0.03] rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <div className="px-6 pt-8 pb-6">
      {/* Hero — Logo & tagline */}
      <div className="mb-10">
        <div className="mb-4">
          <Image
            src="/ftrn-logo.png"
            alt="FTRN #5 Temu-Taut"
            width={200}
            height={60}
            className="object-contain"
            style={{ filter: isDark ? 'invert(1) brightness(1.1)' : 'none' }}
          />
        </div>
        <p className="badge-matcha px-3 py-1 inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase mb-4">
          <Megaphone className="w-3 h-3" />
          Festival Teater Remaja Nusantara
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm font-medium">
          Merawat kekayaan budaya teater remaja Indonesia
        </p>
        <div className="zen-divider mt-8" />
      </div>

      {/* Headline */}
      {headline && (
        <div className="mb-8">
          <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase mb-4">
            Pengumuman
          </p>
          <Link
            href={`/blog/${headline.slug}`}
            className="w-full text-left group block"
          >
            <div className="headline-card overflow-hidden">
              {headline.coverImage && (
                <div className="relative w-full h-44 overflow-hidden rounded-lg">
                  <img
                    src={proxyImageUrl(headline.coverImage)}
                    alt={headline.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse-soft" />
                    <span className="bg-white/15 backdrop-blur-sm text-white/90 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full">
                      Headline
                    </span>
                  </div>
                  {/* Title on image — always bright */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                    <h2 className="text-lg font-bold text-white leading-snug mb-2">
                      {headline.title}
                    </h2>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-white/50 font-medium flex items-center gap-2">
                        <span>{timeAgo(headline.createdAt)}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {readingTime(headline.excerpt || headline.title)}
                        </span>
                      </p>
                      <span className="flex items-center gap-1 text-white/70 text-xs font-semibold group-hover:gap-2 transition-all duration-300">
                        Baca <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {!headline.coverImage && (
                <div className="py-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse-soft" />
                    <span className="text-[9px] font-bold tracking-wider text-primary uppercase">
                      Headline
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground leading-snug mb-2">
                    {headline.title}
                  </h2>
                  {headline.excerpt && (
                    <p className="text-sm text-foreground/50 leading-relaxed font-medium">
                      {headline.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-[11px] text-foreground/35 font-medium flex items-center gap-2">
                      <span>{timeAgo(headline.createdAt)}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {readingTime(headline.excerpt || headline.title)}
                      </span>
                    </p>
                    <span className="flex items-center gap-1 text-primary text-xs font-semibold group-hover:gap-2 transition-all duration-300">
                      Baca <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Link>
        </div>
      )}

      {/* Featured — Seamless list with dividers */}
      {featured.length > 0 && (
        <div>
          <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase mb-4">
            Terbaru
          </p>
          <div className="space-y-0">
            {featured.map((blog, idx) => (
              <React.Fragment key={blog.id}>
                {idx > 0 && <div className="zen-divider my-4" />}
                <Link
                  href={`/blog/${blog.slug}`}
                  className="w-full text-left group block"
                >
                  {blog.coverImage && (
                    <div className="relative w-full h-28 overflow-hidden rounded-lg mb-3">
                      <img
                        src={proxyImageUrl(blog.coverImage)}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        {blog.category && (
                          <span className="badge-matcha px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase">
                            {blog.category}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-foreground/85 leading-snug">
                        {blog.title}
                      </h3>
                      {blog.excerpt && (
                        <p className="text-xs text-foreground/40 mt-1 line-clamp-1 font-medium">
                          {blog.excerpt}
                        </p>
                      )}
                      <p className="text-[11px] text-foreground/25 mt-2 font-medium flex items-center gap-2">
                        <span>{timeAgo(blog.createdAt)}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {readingTime(blog.excerpt || blog.title)}
                        </span>
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-foreground/10 group-hover:text-primary transition-colors duration-300 shrink-0 mt-1" />
                  </div>
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Empty */}
      {!headline && featured.length === 0 && (
        <div className="py-20 text-center">
          <div className="icon-circle w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Megaphone className="w-6 h-6 text-primary/40" />
          </div>
          <p className="text-foreground/40 text-sm font-semibold">Belum ada pengumuman</p>
          <p className="text-foreground/20 text-xs mt-1 font-medium">Nantikan info terbaru dari FTRN #5</p>
        </div>
      )}
    </div>
  )
}
