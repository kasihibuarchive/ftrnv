'use client'

import React, { useEffect, useState } from 'react'
import { Tag, Calendar, ArrowLeft, Share2, Clock } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { proxyImageUrl } from '@/lib/image-proxy'
import { toast } from '@/hooks/use-toast'

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

  const readingTime = (text: string) => Math.max(1, Math.ceil(text.split(/\s+/).length / 200))

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: blog?.title, url })
      } catch {
        // user cancelled or error — silent
      }
    } else {
      await navigator.clipboard.writeText(url)
      toast({ title: 'Link disalin!' })
    }
  }

  if (loading) {
    return (
      <div className="px-6 py-10 space-y-4 animate-pulse">
        <div className="h-8 bg-kinari/[0.04] rounded w-3/4" />
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
        <p className="text-kinari/30 text-sm font-semibold">Artikel tidak ditemukan</p>
        <button onClick={onBack} className="cta-button px-4 py-2 text-xs font-semibold mt-4 inline-flex items-center gap-1.5">
          <ArrowLeft className="w-3 h-3" /> Kembali
        </button>
      </div>
    )
  }

  return (
    <div className="px-6 py-8">
      {/* Cover */}
      {blog.coverImage && (
        <div className="rounded-2xl overflow-hidden mb-6 green-glow-soft">
          <img src={proxyImageUrl(blog.coverImage)} alt={blog.title} className="w-full h-56 object-cover" />
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-3 mb-4">
        {blog.category && (
          <span className="badge-matcha px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase inline-flex items-center gap-1.5">
            <Tag className="w-2.5 h-2.5" />
            {blog.category}
          </span>
        )}
        <span className="flex items-center gap-1.5 text-[11px] text-kinari/30 font-medium">
          <Calendar className="w-3 h-3" />
          {formatDate(blog.createdAt)}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-kinari leading-snug mb-3">
        {blog.title}
      </h1>

      {/* Share row */}
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-1.5 text-[11px] text-kinari/30 font-medium">
          <Clock className="w-3 h-3" />
          ~{readingTime(blog.content)} menit baca
        </span>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-[11px] text-kinari/40 font-medium hover:text-matcha-light transition-colors duration-200"
        >
          <Share2 className="w-3 h-3" />
          Bagikan
        </button>
      </div>

      {/* Divider */}
      <div className="zen-divider my-8" />

      {/* Content */}
      <div className="markdown-content">
        <ReactMarkdown
          components={{
            img: ({ src, alt, ...props }) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={proxyImageUrl(src)} alt={alt} {...props} />
            ),
          }}
        >{blog.content}</ReactMarkdown>
      </div>
    </div>
  )
}
