'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Tag, Search, BookOpen } from 'lucide-react'
import LiquidGlass from './LiquidGlass'

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

interface BlogPageProps {
  onBlogClick: (blogId: string) => void
}

const categories = ['semua', 'pendaftaran', 'informasi', 'juklak', 'umum']

export default function BlogPage({ onBlogClick }: BlogPageProps) {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('semua')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs')
      if (res.ok) {
        const data = await res.json()
        setBlogs(data)
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory = selectedCategory === 'semua' || blog.category === selectedCategory
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (blog.excerpt && blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-forest-200 mb-3 flex items-center justify-center gap-3">
          <BookOpen className="w-8 h-8 text-forest-500" />
          Blog
        </h1>
        <p className="text-forest-400/60 text-sm">
          Informasi dan berita seputar FTRN #5
        </p>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        className="mb-8 space-y-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="liquid-glass-subtle flex items-center gap-3 px-4 py-3 rounded-xl">
            <Search className="w-4 h-4 text-forest-500/50 shrink-0" />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-forest-200 placeholder:text-forest-500/40 text-sm flex-1"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 capitalize ${
                selectedCategory === cat
                  ? 'bg-forest-500/30 text-forest-300 border border-forest-500/40'
                  : 'bg-white/5 text-forest-400/60 border border-white/10 hover:bg-white/10 hover:text-forest-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Blog Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="liquid-glass p-5 animate-pulse">
              <div className="h-40 bg-white/5 rounded-lg mb-4" />
              <div className="h-5 bg-white/10 rounded w-3/4 mb-3" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredBlogs.length === 0 ? (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <LiquidGlass className="p-10 max-w-md mx-auto">
            <BookOpen className="w-12 h-12 text-forest-500/30 mx-auto mb-4" />
            <p className="text-forest-400/60">Belum ada artikel</p>
          </LiquidGlass>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
            >
              <LiquidGlass hover onClick={() => onBlogClick(blog.id)} className="overflow-hidden">
                {/* Cover Image */}
                {blog.coverImage ? (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-forest-700/30 to-forest-800/30 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-forest-500/20" />
                  </div>
                )}

                <div className="p-5">
                  {/* Category + Date */}
                  <div className="flex items-center gap-2 mb-3">
                    {blog.category && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-forest-500/15 text-forest-400 capitalize">
                        <Tag className="w-2.5 h-2.5" />
                        {blog.category}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[10px] text-forest-500/50">
                      <Calendar className="w-2.5 h-2.5" />
                      {formatDate(blog.createdAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-forest-200 mb-2 line-clamp-2 leading-snug">
                    {blog.title}
                  </h3>

                  {/* Excerpt */}
                  {blog.excerpt && (
                    <p className="text-xs text-forest-400/50 line-clamp-2 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  )}
                </div>
              </LiquidGlass>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
