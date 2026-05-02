'use client'

import React, { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Home as HomeIcon, BookOpen, Phone } from 'lucide-react'
import BerandaPage from '@/components/BerandaPage'
import BlogPage from '@/components/BlogPage'
import KontakPage from '@/components/KontakPage'
import AdminPage from '@/components/AdminPage'
import BlogDetail from '@/components/BlogDetail'

type Tab = 'beranda' | 'blog' | 'kontak'

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'beranda', label: 'Beranda', icon: HomeIcon },
  { id: 'blog', label: 'Blog', icon: BookOpen },
  { id: 'kontak', label: 'Kontak', icon: Phone },
]

export default function Page() {
  const [activeTab, setActiveTab] = useState<Tab>('beranda')
  const [view, setView] = useState<'tabs' | 'detail' | 'admin'>('tabs')
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null)
  const [logoTaps, setLogoTaps] = useState(0)

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab)
    setView('tabs')
    setSelectedBlogId(null)
  }, [])

  const handleBlogClick = useCallback((blogId: string) => {
    setSelectedBlogId(blogId)
    setView('detail')
  }, [])

  const handleBack = useCallback(() => {
    setView('tabs')
    setSelectedBlogId(null)
  }, [])

  const handleLogoTap = useCallback(() => {
    const next = logoTaps + 1
    setLogoTaps(next)
    if (next >= 5) {
      setView('admin')
      setLogoTaps(0)
    }
    setTimeout(() => setLogoTaps(0), 2000)
  }, [logoTaps])

  return (
    <div className="min-h-screen nature-bg relative flex flex-col">
      {/* Nature ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div
          className="absolute top-[-5%] left-[10%] w-[600px] h-[600px] rounded-full opacity-[0.08] animate-float-1"
          style={{
            background: 'radial-gradient(circle, #6B8F5E 0%, #3D5A3A 40%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-[5%] right-[5%] w-[500px] h-[500px] rounded-full opacity-[0.06] animate-float-2"
          style={{
            background: 'radial-gradient(circle, #9BB592 0%, #4A6B42 40%, transparent 70%)',
            filter: 'blur(90px)',
          }}
        />
        <div
          className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full opacity-[0.04] animate-float-1"
          style={{
            background: 'radial-gradient(circle, #D4A0A0 0%, transparent 60%)',
            filter: 'blur(70px)',
            animationDelay: '-10s',
          }}
        />
      </div>

      {/* Header */}
      <header className="glass-zen-header sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={view === 'admin' ? handleBack : handleLogoTap}
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-full bg-matcha/20 flex items-center justify-center group-hover:bg-matcha/30 transition-colors duration-500">
              <span className="text-matcha-light text-xs font-semibold">F</span>
            </div>
            <span className="text-kinari/80 text-sm font-medium tracking-wide">
              {view === 'admin' ? 'Admin' : 'FTRN #5'}
            </span>
          </button>
          {view === 'detail' && (
            <button
              onClick={handleBack}
              className="text-matcha-light/60 text-xs tracking-wider hover:text-matcha-light transition-colors duration-300"
            >
              ← Kembali
            </button>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {view === 'admin' ? (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="pb-28"
            >
              <AdminPage onBack={handleBack} />
            </motion.div>
          ) : view === 'detail' && selectedBlogId ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="pb-28"
            >
              <BlogDetail blogId={selectedBlogId} onBack={handleBack} />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="pb-28"
            >
              {activeTab === 'beranda' && (
                <BerandaPage onBlogClick={handleBlogClick} />
              )}
              {activeTab === 'blog' && (
                <BlogPage onBlogClick={handleBlogClick} />
              )}
              {activeTab === 'kontak' && <KontakPage />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      {view !== 'admin' && (
        <nav className="glass-zen-nav fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-2xl mx-auto flex items-center justify-around h-16">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id && view === 'tabs'
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-opacity duration-300"
                >
                  <Icon
                    className={`w-5 h-5 transition-all duration-500 ${
                      isActive ? 'text-matcha-light' : 'text-kinari/20'
                    }`}
                    strokeWidth={isActive ? 1.8 : 1.2}
                  />
                  <span className={`text-[9px] tracking-widest transition-colors duration-500 ${
                    isActive ? 'text-matcha-light/60' : 'text-kinari/15'
                  }`}>
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        </nav>
      )}
    </div>
  )
}
