'use client'

import React, { useEffect, useState } from 'react'
import { Tag, Calendar } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface Blog {
  id: string
  title: string
  content: string
  excerpt?: string
  coverImage?: string
  category?: string
  createdAt: string
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
      if (res.ok) setBlog(await res.json())
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  if (loading) {
    return (
      <div className="p-4 space-y-3 animate-pulse">
        <div className="h-6 bg-white/5 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/3" />
        <div className="h-4 bg-white/5 rounded w-full mt-4" />
        <div className="h-4 bg-white/5 rounded w-full" />
        <div className="h-4 bg-white/5 rounded w-2/3" />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="p-8 text-center">
        <p className="text-ios-secondary">Artikel tidak ditemukan</p>
        <button onClick={onBack} className="text-accent-green text-sm mt-2">
          Kembali
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 py-4">
      {/* Cover image */}
      {blog.coverImage && (
        <div className="rounded-2xl overflow-hidden mb-4">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-2 mb-3">
        {blog.category && (
          <span className="flex items-center gap-1 text-[11px] font-medium text-accent-green bg-accent-green-dim px-2 py-0.5 rounded-full capitalize">
            <Tag className="w-2.5 h-2.5" />
            {blog.category}
          </span>
        )}
        <span className="flex items-center gap-1 text-xs text-ios-tertiary">
          <Calendar className="w-2.5 h-2.5" />
          {formatDate(blog.createdAt)}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold text-white leading-snug mb-5">
        {blog.title}
      </h1>

      {/* Content */}
      <div className="markdown-content">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>
    </div>
  )
}
