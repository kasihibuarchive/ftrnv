'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Home as HomeIcon, BookOpen, Phone, ShoppingBag, Sun, Moon } from 'lucide-react'
import Image from 'next/image'
import BerandaPage from '@/components/BerandaPage'
import BlogPage from '@/components/BlogPage'
import MerchPage from '@/components/MerchPage'
import KontakPage from '@/components/KontakPage'
import AdminPage from '@/components/AdminPage'

type Tab = 'beranda' | 'blog' | 'merch' | 'kontak'

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'beranda', label: 'Beranda', icon: HomeIcon },
  { id: 'blog', label: 'Blog', icon: BookOpen },
  { id: 'merch', label: 'Merch', icon: ShoppingBag },
  { id: 'kontak', label: 'Kontak', icon: Phone },
]

export default function Page() {
  const [activeTab, setActiveTab] = useState<Tab>('beranda')
  const [view, setView] = useState<'tabs' | 'admin'>('tabs')
  const [logoTaps, setLogoTaps] = useState(0)
  const [isDark, setIsDark] = useState(false)

  // Persist theme preference
  useEffect(() => {
    const saved = localStorage.getItem('ftrn-theme')
    if (saved === 'dark') {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = useCallback(() => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('ftrn-theme', next ? 'dark' : 'light')
  }, [isDark])

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab)
    setView('tabs')
  }, [])

  const handleBack = useCallback(() => {
    setView('tabs')
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
      {/* Nature ambient blobs — organic, flowing */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div
          className="absolute top-[-5%] left-[10%] w-[450px] h-[450px] rounded-full opacity-[0.08] animate-float-1"
          style={{
            background: 'radial-gradient(circle, #C97A4A 0%, #E09A6E 30%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute bottom-[5%] right-[5%] w-[380px] h-[380px] rounded-full opacity-[0.06] animate-float-2"
          style={{
            background: 'radial-gradient(circle, #7FA771 0%, #9DC293 30%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full opacity-[0.04] animate-float-1"
          style={{
            background: 'radial-gradient(circle, #EDE7D6 0%, transparent 60%)',
            filter: 'blur(45px)',
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
            <div className="w-8 h-8 flex items-center justify-center">
              <Image
                src="/ftrn-logo.png"
                alt="FTRN"
                width={28}
                height={28}
                className="object-contain"
                style={{ filter: isDark ? 'brightness(0) invert(1)' : 'none' }}
              />
            </div>
            {view === 'admin' ? (
              <span className={`font-semibold text-sm tracking-wide ${isDark ? 'text-kinari' : 'text-charcoal'}`}>Admin</span>
            ) : (
              <Image
                src="/ftrn-text.png"
                alt="FTRN #5"
                width={60}
                height={22}
                className="object-contain"
                style={{ filter: isDark ? 'brightness(0) invert(1)' : 'none' }}
              />
            )}
          </button>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-matcha/10"
            title={isDark ? 'Mode Terang' : 'Mode Gelap'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-kinari/40" />
            ) : (
              <Moon className="w-4 h-4 text-charcoal/40" />
            )}
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {view === 'admin' ? (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="pb-28"
            >
              <AdminPage onBack={handleBack} />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="pb-28"
            >
              {activeTab === 'beranda' && <BerandaPage />}
              {activeTab === 'blog' && <BlogPage />}
              {activeTab === 'merch' && <MerchPage />}
              {activeTab === 'kontak' && <KontakPage />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      {view !== 'admin' && (
        <nav className="glass-zen-nav fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-2xl mx-auto flex items-center justify-around h-16 gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id && view === 'tabs'
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300"
                >
                  <div className={`p-1 rounded-lg transition-all duration-300 ${isActive ? 'bg-terra/10 terra-glow' : ''}`}>
                    <Icon
                      className={`w-5 h-5 transition-all duration-300 ${
                        isActive ? 'text-terra' : 'text-charcoal/20'
                      }`}
                      strokeWidth={isActive ? 2 : 1.2}
                    />
                  </div>
                  <span className={`text-[9px] font-medium tracking-wide transition-all duration-300 ${
                    isActive ? 'text-terra' : 'text-charcoal/20'
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
