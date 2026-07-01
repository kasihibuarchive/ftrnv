'use client'

import { Tag, Calendar, ArrowLeft, Share2, Clock } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { proxyImageUrl } from '@/lib/image-proxy'
import { toast } from 'sonner'

interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string | null
  coverImage?: string | null
  category?: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

interface BlogPostPageProps {
  blog: Blog
}

const readingTime = (text: string) => {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

export default function BlogPostPage({ blog }: BlogPostPageProps) {
  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: blog.title, url })
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Link disalin!')
    }
  }

  return (
    <div className="min-h-screen nature-bg">
      {/* Hero Section */}
      {blog.coverImage && (
        <div className="relative w-full h-[40vh] min-h-[280px] max-h-[500px] overflow-hidden">
          <img
            src={proxyImageUrl(blog.coverImage)}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e1a] via-[#1a2e1a]/40 to-transparent" />
          {/* Back button on hero */}
          <div className="absolute top-4 left-4 z-10">
            <a
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-kinari/80"
              style={{
                background: 'rgba(26, 46, 26, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(245, 240, 232, 0.1)',
              }}
            >
              <ArrowLeft className="w-3 h-3" />
              Kembali
            </a>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`${blog.coverImage ? '-mt-20' : 'pt-8'} relative z-10`}>
        <div className="max-w-2xl mx-auto px-6">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
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
            <span className="flex items-center gap-1.5 text-[11px] text-kinari/30 font-medium">
              <Clock className="w-3 h-3" />
              ~{readingTime(blog.content)} menit baca
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-kinari leading-snug mb-4">
            {blog.title}
          </h1>

          {/* Share Row */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] text-kinari/50 font-medium hover:text-matcha-light transition-colors duration-200"
              style={{
                background: 'rgba(245, 240, 232, 0.06)',
                border: '1px solid rgba(245, 240, 232, 0.08)',
              }}
            >
              <Share2 className="w-3 h-3" />
              Bagikan
            </button>
            {!blog.coverImage && (
              <a
                href="/"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] text-kinari/50 font-medium hover:text-matcha-light transition-colors duration-200"
                style={{
                  background: 'rgba(245, 240, 232, 0.06)',
                  border: '1px solid rgba(245, 240, 232, 0.08)',
                }}
              >
                <ArrowLeft className="w-3 h-3" />
                Kembali
              </a>
            )}
          </div>

          {/* Divider */}
          <div className="zen-divider mb-8" />

          {/* Markdown Content */}
          <div className="markdown-content pb-16">
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
      </div>
    </div>
  )
}
