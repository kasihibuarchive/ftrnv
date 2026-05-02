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

export default function Home() {
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
    <div className="min-h-screen bg-ios-bg relative flex flex-col">
      {/* Subtle background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div
          className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.07] animate-drift-1"
          style={{
            background: 'radial-gradient(circle, #30D158 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.05] animate-drift-2"
          style={{
            background: 'radial-gradient(circle, #30D158 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      {/* Header - Instagram style */}
      <header className="glass-header sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 h-12 flex items-center justify-between">
          <button
            onClick={view === 'admin' ? handleBack : handleLogoTap}
            className="flex items-center gap-2 active:opacity-60 transition-opacity"
          >
            <div className="w-7 h-7 rounded-lg bg-accent-green flex items-center justify-center">
              <span className="text-black font-bold text-xs">F5</span>
            </div>
            <h1 className="text-base font-semibold text-white tracking-tight">
              {view === 'admin' ? 'Admin' : 'FTRN #5'}
            </h1>
          </button>
          {view === 'detail' && (
            <button
              onClick={handleBack}
              className="text-accent-green text-sm font-medium active:opacity-60"
            >
              Kembali
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          {view === 'admin' ? (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="pb-20"
            >
              <AdminPage onBack={handleBack} />
            </motion.div>
          ) : view === 'detail' && selectedBlogId ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="pb-20"
            >
              <BlogDetail blogId={selectedBlogId} onBack={handleBack} />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="pb-20"
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

      {/* Bottom Tab Bar - Instagram style */}
      {view !== 'admin' && (
        <nav className="glass-nav fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-lg mx-auto flex items-center justify-around h-14">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id && view === 'tabs'
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full active:opacity-50 transition-opacity"
                >
                  <Icon
                    className={`w-6 h-6 transition-colors duration-150 ${
                      isActive ? 'text-white' : 'text-white/40'
                    }`}
                    fill={isActive ? 'currentColor' : 'none'}
                    strokeWidth={isActive ? 0 : 1.5}
                  />
                </button>
              )
            })}
          </div>
          {/* Safe area spacer for iOS */}
          <div className="h-[env(safe-area-inset-bottom)]" />
        </nav>
      )}
    </div>
  )
}
