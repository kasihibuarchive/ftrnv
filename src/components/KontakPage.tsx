'use client'

import React from 'react'
import { Mail, Instagram, MessageCircle, Youtube, ExternalLink } from 'lucide-react'

const contacts = [
  {
    icon: Mail,
    label: 'Email',
    value: 'ftrn@students.isi.ac.id',
    href: 'mailto:ftrn@students.isi.ac.id',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@ftrn.isijogja',
    href: 'https://instagram.com/ftrn.isijogja',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+62 882-1244-7588 (Dinda)',
    href: 'https://wa.me/6288212447588',
  },
  {
    icon: Youtube,
    label: 'YouTube',
    value: 'FTRN ISI Yogyakarta',
    href: 'https://youtube.com',
  },
]

export default function KontakPage() {
  return (
    <div className="px-6 pt-10 pb-6">
      {/* Profile — Zen */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-full bg-matcha/10 mx-auto mb-5 flex items-center justify-center">
          <span className="text-matcha-light text-lg font-light">葉</span>
        </div>
        <h2 className="text-xl font-light text-kinari/80 tracking-wide">FTRN #5</h2>
        <p className="text-xs text-suri mt-2 tracking-wider">
          Festival Tari Tradisional Nasional
        </p>
        <p className="text-[10px] text-kinari/15 mt-1 tracking-widest">
          ISI ヨグヤカルタ
        </p>
      </div>

      {/* Divider */}
      <div className="zen-divider mb-8" />

      {/* Contact label */}
      <p className="text-[10px] tracking-[0.25em] text-matcha-light/40 uppercase mb-4">
        連絡先 — Contact
      </p>

      {/* Contact list — Zen rows */}
      <div className="space-y-2">
        {contacts.map((contact) => {
          const Icon = contact.icon
          return (
            <a
              key={contact.label}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="glass-zen-card px-5 py-4 flex items-center gap-4 group-hover:border-matcha/15">
                <div className="w-9 h-9 rounded-full bg-matcha/8 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-matcha-light/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-kinari/70 font-light">{contact.label}</p>
                  <p className="text-xs text-kinari/25 mt-0.5 truncate tracking-wide">{contact.value}</p>
                </div>
                <ExternalLink className="w-3 h-3 text-kinari/[0.06] group-hover:text-matcha-light/30 transition-colors duration-500 shrink-0" />
              </div>
            </a>
          )
        })}
      </div>

      {/* Zen quote */}
      <div className="mt-10 text-center">
        <p className="text-xs text-kinari/15 italic leading-loose tracking-wide">
          踊りは魂の言語であり、<br />
          私たちを文化と伝統に結びつける
        </p>
        <p className="text-[9px] text-kinari/10 mt-3 tracking-widest">— FTRN #5</p>
      </div>
    </div>
  )
}
