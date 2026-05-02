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

  useEffect(() => { fetchBlogs() }, [])

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs')
      if (res.ok) setBlogs(await res.json())
    } catch { /* */ } finally { setLoading(false) }
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
    if (days < 30) return `${Math.floor(days / 7)} minggu lalu`
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="px-6 pt-8 pb-6">
      {/* Title */}
      <h2 className="text-xl font-light text-kinari/80 tracking-wide mb-6">
        Blog<span className="text-matcha-light/40 ml-2 text-sm">Artikel</span>
      </h2>

      {/* Search */}
      <div className="glass-zen-input flex items-center gap-3 px-4 py-3 mb-5">
        <Search className="w-4 h-4 text-kinari/15 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari artikel..."
          className="bg-transparent text-sm text-kinari/70 placeholder:text-kinari/15 outline-none flex-1 tracking-wide"
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-[11px] tracking-wider whitespace-nowrap transition-all duration-500 ${
              activeCategory === cat
                ? 'bg-matcha/20 text-matcha-light border border-matcha/20'
                : 'text-kinari/20 border border-kinari/[0.05] hover:border-kinari/10 hover:text-kinari/30'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Blog list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-zen-card p-5 animate-pulse">
              <div className="h-4 bg-kinari/[0.03] rounded w-2/3 mb-3" />
              <div className="h-3 bg-kinari/[0.02] rounded w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-kinari/15 text-sm">Artikel tidak ditemukan</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((blog) => (
            <button
              key={blog.id}
              onClick={() => onBlogClick(blog.id)}
              className="w-full text-left group"
            >
              <div className="glass-zen-card px-5 py-4 flex items-center gap-4 group-hover:border-matcha/15">
                <div className="flex-1 min-w-0">
                  {blog.category && (
                    <span className="text-[9px] tracking-[0.2em] text-matcha/40 uppercase">
                      {blog.category}
                    </span>
                  )}
                  <h3 className="text-sm font-light text-kinari/75 leading-relaxed mt-0.5">
                    {blog.title}
                  </h3>
                  {blog.excerpt && (
                    <p className="text-xs text-kinari/20 mt-1 line-clamp-1 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  )}
                  <p className="text-[10px] text-kinari/15 mt-2 tracking-wider">
                    {timeAgo(blog.createdAt)}
                  </p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-kinari/[0.06] group-hover:text-matcha-light/30 transition-colors duration-500 shrink-0" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
