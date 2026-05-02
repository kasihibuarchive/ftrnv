'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import LiquidGlass from './LiquidGlass'

interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  coverImage?: string
  isHighlight: boolean
  highlightType?: string
  category?: string
  published: boolean
  createdAt: string
  updatedAt: string
}

interface BlogDetailProps {
  blogId: string
  onBack: () => void
}

export default function BlogDetail({ blogId, onBack }: BlogDetailProps) {
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlog()
  }, [blogId])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/blogs/${blogId}`)
      if (res.ok) {
        const data = await res.json()
        setBlog(data)
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
      month: 'long',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="liquid-glass p-8 animate-pulse">
          <div className="h-8 bg-white/10 rounded w-3/4 mb-6" />
          <div className="h-4 bg-white/5 rounded w-1/4 mb-8" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-white/5 rounded" style={{ width: `${80 - i * 10}%` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-center">
        <LiquidGlass className="p-8">
          <p className="text-forest-400">Blog tidak ditemukan</p>
          <button
            onClick={onBack}
            className="mt-4 text-forest-500 hover:text-forest-400 font-medium"
          >
            Kembali
          </button>
        </LiquidGlass>
      </div>
    )
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 sm:px-6 py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back button */}
      <motion.button
        onClick={onBack}
        className="flex items-center gap-2 text-forest-400 hover:text-forest-300 mb-6 transition-colors duration-300"
        whileHover={{ x: -4 }}
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Kembali</span>
      </motion.button>

      <LiquidGlass variant="strong" className="p-6 sm:p-10">
        {/* Cover Image */}
        {blog.coverImage && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-48 sm:h-64 md:h-80 object-cover"
            />
          </div>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {blog.category && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-forest-500/20 text-forest-400 capitalize">
              <Tag className="w-3 h-3" />
              {blog.category}
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-forest-500/60">
            <Calendar className="w-3 h-3" />
            {formatDate(blog.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-forest-200 mb-8 leading-tight">
          {blog.title}
        </h1>

        {/* Content */}
        <div className="markdown-content">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>
      </LiquidGlass>
    </motion.div>
  )
}
