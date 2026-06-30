'use client'

import React, { useEffect, useState } from 'react'
import { Search, ChevronRight, FileText, Clock } from 'lucide-react'
import Link from 'next/link'
import { proxyImageUrl } from '@/lib/image-proxy'
import { timeAgo, readingTime } from '@/lib/utils-shared'

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

const categories = ['Semua', 'pendaftaran', 'informasi', 'juklak', 'umum']

export default function BlogPage() {
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

  return (
    <div className="px-6 pt-8 pb-6">
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-kinari">
          Blog
          <span className="green-gradient ml-2 text-lg">Artikel</span>
        </h2>
        <p className="text-xs text-kinari/30 mt-1 font-medium">Temukan informasi terbaru seputar FTRN #5</p>
      </div>

      {/* Search */}
      <div className="glass-zen-input flex items-center gap-3 px-4 py-3 mb-5">
        <Search className="w-4 h-4 text-matcha-light/40 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari artikel..."
          className="bg-transparent text-sm text-kinari/70 placeholder:text-kinari/20 outline-none flex-1 font-medium"
        />
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
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Blog list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-zen-card p-5 animate-pulse">
              <div className="h-4 bg-kinari/[0.04] rounded w-2/3 mb-3" />
              <div className="h-3 bg-kinari/[0.02] rounded w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <div className="icon-circle w-14 h-14 mx-auto mb-3 flex items-center justify-center">
            <FileText className="w-5 h-5 text-matcha-light/30" />
          </div>
          <p className="text-kinari/30 text-sm font-semibold">Artikel tidak ditemukan</p>
          <p className="text-kinari/15 text-xs mt-1 font-medium">Coba kata kunci lain</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="w-full text-left group block"
            >
              <div className="glass-zen-card overflow-hidden">
                {blog.coverImage && (
                  <div className="relative w-full h-28 overflow-hidden">
                    <img
                      src={proxyImageUrl(blog.coverImage)}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
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
                    <h3 className="text-sm font-semibold text-kinari/80 leading-snug">
                      {blog.title}
                    </h3>
                    {blog.excerpt && (
                      <p className="text-xs text-kinari/30 mt-1.5 line-clamp-1 font-medium leading-relaxed">
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
                    <ChevronRight className="w-4 h-4 text-kinari/10 group-hover:text-matcha-light transition-colors duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
