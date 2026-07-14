'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Share2, Tag, Calendar, Clock } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { proxyImageUrl } from '@/lib/image-proxy'
import { timeAgo, readingTime } from '@/lib/utils-shared'
import { toast } from '@/hooks/use-toast'
import MerchAdboard from '@/components/MerchAdboard'

interface Blog {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string | null
  coverImage?: string | null
  category?: string | null
  isHighlight: boolean
  highlightType?: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

interface BlogPostClientProps {
  blog: Blog
}

export default function BlogPostClient({ blog }: BlogPostClientProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ftrnv.vercel.app'
  const blogUrl = `${siteUrl}/blog/${blog.slug}`

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt || blog.title,
          url: blogUrl,
        })
      } catch {
        // user cancelled — silent
      }
    } else {
      await navigator.clipboard.writeText(blogUrl)
      toast({ title: 'Link disalin!', description: blogUrl })
    }
  }

  // Share to specific platforms
  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`${blog.title}\n\n${blogUrl}`)
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const shareToTwitter = () => {
    const text = encodeURIComponent(`${blog.title}`)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(blogUrl)}`, '_blank')
  }

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`, '_blank')
  }

  const [showShareMenu, setShowShareMenu] = React.useState(false)

  return (
    <div className="min-h-screen nature-bg relative flex flex-col">
      {/* Nature ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div
          className="absolute top-[-5%] left-[10%] w-[400px] h-[400px] rounded-full opacity-[0.1] animate-float-1"
          style={{
            background: 'radial-gradient(circle, #6B8F5E 0%, #3D5A3A 40%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute bottom-[5%] right-[5%] w-[350px] h-[350px] rounded-full opacity-[0.08] animate-float-2"
          style={{
            background: 'radial-gradient(circle, #9BB592 0%, #4A6B42 40%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
      </div>

      {/* Header — back nav */}
      <header className="glass-zen-header sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-kinari/60 hover:text-kinari transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-wide">Kembali</span>
          </Link>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-kinari/40 hover:text-matcha-light transition-colors duration-200"
          >
            <Share2 className="w-4 h-4" />
            <span className="text-xs font-semibold tracking-wide">Bagikan</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full">
        {/* Hero Image */}
        {blog.coverImage && (
          <div className="relative w-full h-[45vh] min-h-[280px] max-h-[420px] overflow-hidden">
            <img
              src={proxyImageUrl(blog.coverImage)}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2e1a] via-[#1a2e1a]/60 to-transparent" />
            {/* Hero overlay content */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
              <div className="flex items-center gap-3 mb-3">
                {blog.category && (
                  <span className="badge-matcha px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase inline-flex items-center gap-1.5">
                    <Tag className="w-2.5 h-2.5" />
                    {blog.category}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-[11px] text-kinari/50 font-medium">
                  <Calendar className="w-3 h-3" />
                  {formatDate(blog.createdAt)}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-kinari leading-snug">
                {blog.title}
              </h1>
              <div className="flex items-center justify-between mt-3">
                <span className="flex items-center gap-1.5 text-[11px] text-kinari/40 font-medium">
                  <Clock className="w-3 h-3" />
                  {readingTime(blog.content)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* If no cover image — show title block */}
        {!blog.coverImage && (
          <div className="px-6 pt-8 pb-4">
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
              <span className="flex items-center gap-1.5 text-[11px] text-kinari/30 font-medium">
                <Clock className="w-3 h-3" />
                {readingTime(blog.content)}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-kinari leading-snug mb-2">
              {blog.title}
            </h1>
          </div>
        )}

        {/* Share bar (below hero or title) */}
        <div className="px-6 py-4">
          <div className="glass-zen-card px-4 py-3 flex items-center justify-between">
            <span className="text-[11px] text-kinari/30 font-medium">Bagikan artikel ini</span>
            <div className="flex items-center gap-3">
              <button
                onClick={shareToWhatsApp}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-matcha/10 hover:bg-matcha/20 transition-colors duration-200"
                title="WhatsApp"
              >
                <svg className="w-3.5 h-3.5 text-matcha-light" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </button>
              <button
                onClick={shareToTwitter}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-matcha/10 hover:bg-matcha/20 transition-colors duration-200"
                title="X / Twitter"
              >
                <svg className="w-3.5 h-3.5 text-matcha-light" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
              <button
                onClick={shareToFacebook}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-matcha/10 hover:bg-matcha/20 transition-colors duration-200"
                title="Facebook"
              >
                <svg className="w-3.5 h-3.5 text-matcha-light" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(blogUrl)
                  toast({ title: 'Link disalin!' })
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-matcha/10 hover:bg-matcha/20 transition-colors duration-200"
                title="Salin Link"
              >
                <Share2 className="w-3.5 h-3.5 text-matcha-light" />
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="px-6">
          <div className="zen-divider" />
        </div>

        {/* Content */}
        <article className="px-6 py-8 markdown-content">
          <ReactMarkdown
            components={{
              img: ({ src, alt, ...props }) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={proxyImageUrl(src)} alt={alt} {...props} />
              ),
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </article>

        {/* Bottom share bar */}
        <div className="px-6 pb-8">
          <div className="zen-divider mb-6" />
          <div className="glass-zen-card px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-kinari/70">Tertarik dengan artikel ini?</p>
              <p className="text-[11px] text-kinari/30 font-medium mt-0.5">Bagikan ke teman-temanmu!</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={shareToWhatsApp}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-matcha/10 hover:bg-matcha/20 transition-colors duration-200"
                title="WhatsApp"
              >
                <svg className="w-3.5 h-3.5 text-matcha-light" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </button>
              <button
                onClick={shareToTwitter}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-matcha/10 hover:bg-matcha/20 transition-colors duration-200"
                title="X / Twitter"
              >
                <svg className="w-3.5 h-3.5 text-matcha-light" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
              <button
                onClick={shareToFacebook}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-matcha/10 hover:bg-matcha/20 transition-colors duration-200"
                title="Facebook"
              >
                <svg className="w-3.5 h-3.5 text-matcha-light" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(blogUrl)
                  toast({ title: 'Link disalin!' })
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-matcha/10 hover:bg-matcha/20 transition-colors duration-200"
                title="Salin Link"
              >
                <Share2 className="w-3.5 h-3.5 text-matcha-light" />
              </button>
            </div>
          </div>
        </div>

        {/* Merch Adboard */}
        <MerchAdboard />

        {/* Back link */}
        <div className="px-6 pb-28">
          <Link
            href="/"
            className="cta-button px-5 py-2.5 text-xs font-semibold inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    </div>
  )
}
