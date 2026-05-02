'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Calendar, MapPin } from 'lucide-react'
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

interface BerandaPageProps {
  onBlogClick: (blogId: string) => void
  onTabChange: (tab: string) => void
}

export default function BerandaPage({ onBlogClick, onTabChange }: BerandaPageProps) {
  const [headline, setHeadline] = useState<Blog | null>(null)
  const [featured, setFeatured] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHighlights()
  }, [])

  const fetchHighlights = async () => {
    try {
      const res = await fetch('/api/blogs?highlight=true')
      if (res.ok) {
        const data = await res.json()
        const headlineBlog = data.find((b: Blog) => b.highlightType === 'headline')
        const featuredBlogs = data.filter((b: Blog) => b.highlightType === 'featured')
        setHeadline(headlineBlog || null)
        setFeatured(featuredBlogs)
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

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 pt-16 pb-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center"
        >
          {/* Decorative sparkle */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Sparkles className="w-8 h-8 text-forest-500" />
          </motion.div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-6">
            <span className="bg-gradient-to-r from-forest-400 via-forest-300 to-warm-cream bg-clip-text text-transparent">
              FTRN #5
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-forest-300/80 max-w-2xl mx-auto mb-4 leading-relaxed">
            Festival Tari Tradisional Nasional ke-5
          </p>
          <p className="text-base text-forest-400/60 max-w-xl mx-auto mb-10 leading-relaxed">
            Rayakan kekayaan budaya tari tradisional Indonesia bersama Institut Seni Indonesia Yogyakarta
          </p>

          {/* Info badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <div className="liquid-glass-subtle px-4 py-2 rounded-full flex items-center gap-2 text-sm text-forest-300">
              <Calendar className="w-4 h-4 text-forest-500" />
              <span>2025</span>
            </div>
            <div className="liquid-glass-subtle px-4 py-2 rounded-full flex items-center gap-2 text-sm text-forest-300">
              <MapPin className="w-4 h-4 text-forest-500" />
              <span>ISI Yogyakarta</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => onTabChange('blog')}
              className="liquid-glass-glow px-8 py-3 rounded-xl text-forest-900 font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-forest-500/20 transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #52b788, #74c69d)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Lihat Informasi
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => onTabChange('kontak')}
              className="liquid-glass px-8 py-3 rounded-xl text-forest-300 font-medium flex items-center justify-center gap-2 hover:bg-white/15 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Hubungi Kami
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Highlighted Blog Cards Section */}
      <section className="px-4 sm:px-6 pb-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-forest-300 mb-8 text-center">
            Informasi Terbaru
          </h2>

          {loading ? (
            <div className="grid gap-6 max-w-4xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="liquid-glass p-6 animate-pulse">
                  <div className="h-6 bg-white/10 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-white/5 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 max-w-4xl mx-auto">
              {/* Headline Card */}
              {headline && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <LiquidGlass
                    variant="glow"
                    hover
                    onClick={() => onBlogClick(headline.id)}
                    className="p-6 sm:p-8 animate-pulse-glow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                            style={{ background: 'linear-gradient(135deg, #52b788, #40916c)', color: '#0d2818' }}>
                            Headline
                          </span>
                          {headline.category && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-forest-300 capitalize">
                              {headline.category}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-forest-200 mb-2">
                          {headline.title}
                        </h3>
                        {headline.excerpt && (
                          <p className="text-forest-400/70 text-sm sm:text-base leading-relaxed">
                            {headline.excerpt}
                          </p>
                        )}
                        <p className="text-forest-500/50 text-xs mt-3">
                          {formatDate(headline.createdAt)}
                        </p>
                      </div>
                      <ArrowRight className="w-6 h-6 text-forest-500 shrink-0 hidden sm:block" />
                    </div>
                  </LiquidGlass>
                </motion.div>
              )}

              {/* Featured Cards */}
              {featured.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.15, duration: 0.5 }}
                >
                  <LiquidGlass hover onClick={() => onBlogClick(blog.id)} className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-forest-500/20 text-forest-400">
                            Featured
                          </span>
                          {blog.category && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-forest-300/70 capitalize">
                              {blog.category}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-forest-200 mb-1">
                          {blog.title}
                        </h3>
                        {blog.excerpt && (
                          <p className="text-forest-400/60 text-sm leading-relaxed">
                            {blog.excerpt}
                          </p>
                        )}
                        <p className="text-forest-500/40 text-xs mt-2">
                          {formatDate(blog.createdAt)}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-forest-500/50 shrink-0 mt-1" />
                    </div>
                  </LiquidGlass>
                </motion.div>
              ))}

              {/* View All Link */}
              <motion.div
                className="text-center mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <button
                  onClick={() => onTabChange('blog')}
                  className="text-forest-400 hover:text-forest-300 text-sm font-medium transition-colors duration-300 flex items-center gap-2 mx-auto"
                >
                  Lihat semua artikel
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  )
}
