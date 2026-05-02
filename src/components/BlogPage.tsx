'use client'

import React, { useEffect, useState } from 'react'
import { Search, ChevronRight } from 'lucide-react'

interface Blog {
  id: string
  title: string
  slug: string
  excerpt?: string
  coverImage?: string
  category?: string
  published: boolean
  createdAt: string
}

interface BlogPageProps {
  onBlogClick: (blogId: string) => void
}

const categories = ['Semua', 'pendaftaran', 'informasi', 'juklak', 'umum']

export default function BlogPage({ onBlogClick }: BlogPageProps) {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs')
      if (res.ok) {
        setBlogs(await res.json())
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  const filtered = blogs.filter((b) => {
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'Semua' || b.category === activeCategory
    return matchSearch && matchCat
  })

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Hari ini'
    if (days === 1) return 'Kemarin'
    if (days < 7) return `${days} hari lalu`
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }

  return (
    <div>
      {/* Search bar */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 bg-white/[0.07] rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-ios-tertiary shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari artikel..."
            className="bg-transparent text-sm text-white placeholder:text-ios-tertiary outline-none flex-1"
          />
        </div>
      </div>

      {/* Category pills - IG story-like horizontal scroll */}
      <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 ${
              activeCategory === cat
                ? 'bg-accent-green text-black'
                : 'bg-white/[0.07] text-ios-secondary active:bg-white/10'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Blog list - IG feed style */}
      {loading ? (
        <div className="divide-y divide-ios-separator">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 animate-pulse">
              <div className="h-4 bg-white/5 rounded w-2/3 mb-3" />
              <div className="h-3 bg-white/5 rounded w-full mb-2" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-ios-secondary text-sm">Tidak ada artikel ditemukan</p>
        </div>
      ) : (
        <div className="divide-y divide-ios-separator">
          {filtered.map((blog) => (
            <button
              key={blog.id}
              onClick={() => onBlogClick(blog.id)}
              className="w-full text-left active:bg-ios-card transition-colors"
            >
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  {blog.category && (
                    <span className="text-[11px] font-medium text-accent-green bg-accent-green-dim px-2 py-0.5 rounded-full capitalize">
                      {blog.category}
                    </span>
                  )}
                  <span className="text-xs text-ios-tertiary">{timeAgo(blog.createdAt)}</span>
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
        </div>
      )}
    </div>
  )
}
