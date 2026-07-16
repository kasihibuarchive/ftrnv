'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Home as HomeIcon, BookOpen, Phone, ShoppingBag, Sun, Moon } from 'lucide-react'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'

type Tab = 'beranda' | 'blog' | 'merch' | 'kontak'

const tabs: { id: Tab; label: string; icon: React.ElementType; path: string }[] = [
  { id: 'beranda', label: 'Beranda', icon: HomeIcon, path: '/beranda' },
  { id: 'blog', label: 'Blog', icon: BookOpen, path: '/blog' },
  { id: 'merch', label: 'Merch', icon: ShoppingBag, path: '/merch' },
  { id: 'kontak', label: 'Kontak', icon: Phone, path: '/kontak' },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isDark, setIsDark] = useState(false)
  const [logoTaps, setLogoTaps] = useState(0)

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
    const tabInfo = tabs.find(t => t.id === tab)
    if (tabInfo) router.push(tabInfo.path)
  }, [router])

  const handleLogoTap = useCallback(() => {
    const next = logoTaps + 1
    setLogoTaps(next)
    if (next >= 5) {
      router.push('/admin')
      setLogoTaps(0)
    }
    setTimeout(() => setLogoTaps(0), 2000)
  }, [logoTaps, router])

  // Determine active tab from pathname
  const activeTab: Tab | null = pathname === '/beranda' ? 'beranda'
    : pathname.startsWith('/blog') ? 'blog'
    : pathname === '/merch' ? 'merch'
    : pathname === '/kontak' ? 'kontak'
    : null

  // Hide bottom nav on admin and blog detail pages
  const hideNav = pathname === '/admin' || pathname.startsWith('/blog/')
  // Hide app header on blog detail (has its own header)
  const hideHeader = pathname.startsWith('/blog/')

  return (
    <div className="min-h-screen nature-bg relative flex flex-col">
      {/* Header */}
      {!hideHeader && (
        <header className="glass-zen-header sticky top-0 z-50">
          <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
            <button
              onClick={pathname === '/admin' ? () => router.push('/beranda') : handleLogoTap}
              className="flex items-center gap-2 group"
            >
              <Image
                src={isDark ? "/ftrn-logo-light.png" : "/ftrn-logo.png"}
                alt="FTRN"
                width={28}
                height={28}
                className="object-contain"
              />
              <Image
                src={isDark ? "/ftrn-text-light.png" : "/ftrn-text.png"}
                alt="FTRN #5 Temu-Taut"
                width={100}
                height={30}
                className="object-contain h-7 w-auto"
                style={{ filter: isDark ? 'none' : 'brightness(0)' }}
              />
              {pathname === '/admin' && (
                <span className="font-semibold text-sm tracking-wide text-foreground/50 ml-1">Admin</span>
              )}
            </button>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-foreground/5"
              title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-foreground/40" />
              ) : (
                <Moon className="w-4 h-4 text-foreground/30" />
              )}
            </button>
          </div>
        </header>
      )}

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="pb-28"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      {!hideNav && (
        <nav className="glass-zen-nav fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-2xl mx-auto flex items-center justify-around h-16 gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-300"
                >
                  <Icon
                    className={`w-5 h-5 transition-all duration-300 ${
                      isActive ? 'text-primary' : 'text-foreground/15'
                    }`}
                    strokeWidth={isActive ? 2 : 1.2}
                  />
                  <span className={`text-[9px] font-medium tracking-wide transition-all duration-300 ${
                    isActive ? 'text-primary' : 'text-foreground/15'
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
