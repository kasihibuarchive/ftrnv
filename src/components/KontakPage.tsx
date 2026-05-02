'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Instagram, MessageCircle, Youtube, ExternalLink } from 'lucide-react'
import LiquidGlass from './LiquidGlass'

const contacts = [
  {
    icon: <Mail className="w-6 h-6" />,
    label: 'Email',
    value: 'ftrn@students.isi.ac.id',
    href: 'mailto:ftrn@students.isi.ac.id',
    color: 'from-forest-600 to-forest-500',
  },
  {
    icon: <Instagram className="w-6 h-6" />,
    label: 'Instagram',
    value: '@ftrn.isijogja',
    href: 'https://instagram.com/ftrn.isijogja',
    color: 'from-purple-600 to-pink-500',
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    label: 'WhatsApp',
    value: '+62 882-1244-7588 (Dinda)',
    href: 'https://wa.me/6288212447588',
    color: 'from-green-600 to-green-400',
  },
  {
    icon: <Youtube className="w-6 h-6" />,
    label: 'YouTube',
    value: 'FTRN ISI Yogyakarta',
    href: 'https://youtube.com',
    color: 'from-red-600 to-red-400',
  },
]

export default function KontakPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-forest-200 mb-3">
          Kontak Kami
        </h1>
        <p className="text-forest-400/60 text-sm">
          Hubungi kami untuk informasi lebih lanjut tentang FTRN #5
        </p>
      </motion.div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {contacts.map((contact, index) => (
          <motion.div
            key={contact.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <a
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <LiquidGlass hover className="p-6 group">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${contact.color} flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {contact.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-forest-300 mb-1">
                      {contact.label}
                    </h3>
                    <p className="text-forest-400/60 text-sm break-all">
                      {contact.value}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-forest-500/30 group-hover:text-forest-400 transition-colors duration-300 shrink-0 mt-1" />
                </div>
              </LiquidGlass>
            </a>
          </motion.div>
        ))}
      </div>

      {/* Decorative Section */}
      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <LiquidGlass variant="subtle" className="p-8 max-w-lg mx-auto">
          <p className="text-forest-400/50 text-sm leading-relaxed italic">
            &ldquo;Tari adalah bahasa jiwa yang menghubungkan kita dengan budaya dan tradisi nenek moyang.&rdquo;
          </p>
          <p className="text-forest-500/40 text-xs mt-3">— FTRN #5, ISI Yogyakarta</p>
        </LiquidGlass>
      </motion.div>
    </div>
  )
}
