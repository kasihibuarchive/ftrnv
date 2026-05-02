'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NatureBackground from '@/components/NatureBackground'
import Navbar from '@/components/Navbar'
import BerandaPage from '@/components/BerandaPage'
import BlogPage from '@/components/BlogPage'
import BlogDetail from '@/components/BlogDetail'
import KontakPage from '@/components/KontakPage'
import AdminPage from '@/components/AdminPage'

type TabType = 'beranda' | 'blog' | 'kontak' | 'admin'
type ViewType = 'tab' | 'blog-detail'

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('beranda')
  const [view, setView] = useState<ViewType>('tab')
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as TabType)
    setView('tab')
    setSelectedBlogId(null)
  }

  const handleBlogClick = (blogId: string) => {
    setSelectedBlogId(blogId)
    setView('blog-detail')
  }

  const handleBackFromBlog = () => {
    setView('tab')
    setSelectedBlogId(null)
  }

  return (
    <div className="min-h-screen nature-bg relative">
      <NatureBackground />

      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {view === 'blog-detail' && selectedBlogId ? (
            <motion.div
              key="blog-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <BlogDetail blogId={selectedBlogId} onBack={handleBackFromBlog} />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'beranda' && (
                <BerandaPage
                  onBlogClick={handleBlogClick}
                  onTabChange={handleTabChange}
                />
              )}
              {activeTab === 'blog' && (
                <BlogPage onBlogClick={handleBlogClick} />
              )}
              {activeTab === 'kontak' && <KontakPage />}
              {activeTab === 'admin' && <AdminPage />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-auto border-t border-white/10">
        <div className="liquid-glass-subtle rounded-none border-0 border-t-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-forest-400 text-lg">🌿</span>
                <span className="text-forest-300 font-semibold">FTRN #5</span>
              </div>
              <p className="text-forest-500/40 text-xs text-center sm:text-right">
                © 2025 Festival Tari Tradisional Nasional — ISI Yogyakarta
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
