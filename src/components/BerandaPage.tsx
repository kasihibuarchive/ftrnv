'use client'

import React, { useEffect, useState } from 'react'
import { ChevronRight, Pin } from 'lucide-react'

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
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-4 animate-pulse">
            <div className="h-4 bg-white/5 rounded w-2/3 mb-3" />
            <div className="h-3 bg-white/5 rounded w-full mb-2" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="divide-y divide-ios-separator">
      {/* Headline Card - like IG story highlight */}
      {headline && (
        <button
          onClick={() => onBlogClick(headline.id)}
          className="w-full text-left active:bg-ios-card transition-colors"
        >
          <div className="p-4">
            {/* Green accent top bar */}
            <div className="h-1 w-12 rounded-full bg-accent-green mb-3" />
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <Pin className="w-3 h-3 text-accent-green" />
                  <span className="text-[11px] font-semibold text-accent-green uppercase tracking-wider">
                    Headline
                  </span>
                </div>
                <h2 className="text-[17px] font-semibold text-white leading-snug mb-1">
                  {headline.title}
                </h2>
                {headline.excerpt && (
                  <p className="text-sm text-ios-secondary leading-relaxed line-clamp-2">
                    {headline.excerpt}
                  </p>
                )}
                <span className="text-xs text-ios-tertiary mt-2 block">
                  {timeAgo(headline.createdAt)}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-ios-tertiary mt-1 shrink-0" />
            </div>
          </div>
        </button>
      )}

      {/* Featured Cards - like IG posts */}
      {featured.map((blog) => (
        <button
          key={blog.id}
          onClick={() => onBlogClick(blog.id)}
          className="w-full text-left active:bg-ios-card transition-colors"
        >
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {blog.category && (
                <span className="text-[11px] font-medium text-accent-green bg-accent-green-dim px-2 py-0.5 rounded-full capitalize">
                  {blog.category}
                </span>
              )}
              <span className="text-xs text-ios-tertiary">
                {timeAgo(blog.createdAt)}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-semibold text-white leading-snug mb-1">
                  {blog.title}
                </h3>
                {blog.excerpt && (
                  <p className="text-sm text-ios-secondary leading-relaxed line-clamp-2">
                    {blog.excerpt}
                  </p>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-ios-tertiary mt-1 shrink-0" />
            </div>
          </div>
        </button>
      ))}

      {/* Empty state */}
      {!headline && featured.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-ios-secondary text-sm">Belum ada informasi</p>
        </div>
      )}
    </div>
  )
}
