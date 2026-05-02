'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Leaf, Home, BookOpen, Phone, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

type TabType = 'beranda' | 'blog' | 'kontak' | 'admin'

interface NavbarProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: 'beranda', label: 'Beranda', icon: <Home className="w-4 h-4" /> },
  { id: 'blog', label: 'Blog', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'kontak', label: 'Kontak Kami', icon: <Phone className="w-4 h-4" /> },
  { id: 'admin', label: 'Admin', icon: <Shield className="w-4 h-4" /> },
]

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="liquid-glass-strong rounded-none border-x-0 border-t-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onTabChange('beranda')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Leaf className="w-7 h-7 text-forest-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-forest-400 to-forest-300 bg-clip-text text-transparent">
                FTRN #5
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center gap-2',
                    activeTab === tab.id
                      ? 'text-forest-500'
                      : 'text-forest-300/70 hover:text-forest-400'
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 liquid-glass-glow rounded-lg"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {tab.icon}
                    {tab.label}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center gap-1">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    'relative p-2 rounded-lg transition-colors duration-300',
                    activeTab === tab.id
                      ? 'text-forest-500'
                      : 'text-forest-300/70'
                  )}
                  whileTap={{ scale: 0.9 }}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabMobile"
                      className="absolute inset-0 liquid-glass-glow rounded-lg"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{tab.icon}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
