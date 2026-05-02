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

  useEffect(() => { fetchBlog() }, [blogId])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/blogs/${blogId}`)
      if (res.ok) setBlog(await res.json())
    } catch { /* */ } finally { setLoading(false) }
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

  if (loading) {
    return (
      <div className="px-6 py-10 space-y-4 animate-pulse">
        <div className="h-7 bg-kinari/[0.03] rounded w-3/4" />
        <div className="h-3 bg-kinari/[0.02] rounded w-1/3" />
        <div className="mt-8 space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="h-4 bg-kinari/[0.02] rounded" style={{width: `${90-i*10}%`}} />)}
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="py-20 text-center">
        <p className="text-kinari/20 text-sm">記事が見つかりません</p>
        <button onClick={onBack} className="text-matcha-light/40 text-xs mt-3 hover:text-matcha-light transition-colors">
          もどる
        </button>
      </div>
    )
  }

  return (
    <div className="px-6 py-8">
      {/* Cover */}
      {blog.coverImage && (
        <div className="rounded-2xl overflow-hidden mb-6">
          <img src={blog.coverImage} alt={blog.title} className="w-full h-52 object-cover" />
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-3 mb-4">
        {blog.category && (
          <span className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] text-matcha/40 uppercase">
            <Tag className="w-2.5 h-2.5" />
            {blog.category}
          </span>
        )}
        <span className="flex items-center gap-1.5 text-[10px] text-kinari/15 tracking-wider">
          <Calendar className="w-2.5 h-2.5" />
          {formatDate(blog.createdAt)}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-light text-kinari/90 leading-relaxed tracking-wide mb-2">
        {blog.title}
      </h1>

      {/* Divider */}
      <div className="zen-divider my-8" />

      {/* Content */}
      <div className="markdown-content">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>
    </div>
  )
}
