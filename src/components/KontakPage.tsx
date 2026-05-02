'use client'

import React from 'react'
import { Mail, Instagram, MessageCircle, Youtube, ExternalLink, Heart } from 'lucide-react'

const contacts = [
  {
    icon: Mail,
    label: 'Email',
    value: 'ftrn@students.isi.ac.id',
    href: 'mailto:ftrn@students.isi.ac.id',
    color: 'from-matcha/20 to-matcha-dark/10',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@ftrn.isijogja',
    href: 'https://instagram.com/ftrn.isijogja',
    color: 'from-sakura/20 to-sakura/5',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+62 882-1244-7588 (Dinda)',
    href: 'https://wa.me/6288212447588',
    color: 'from-matcha/20 to-matcha-dark/10',
  },
  {
    icon: Youtube,
    label: 'YouTube',
    value: 'FTRN ISI Yogyakarta',
    href: 'https://youtube.com/@ftrnisiyogyakarta2655',
    color: 'from-sakura/20 to-sakura/5',
  },
]

export default function KontakPage() {
  return (
    <div className="px-6 pt-8 pb-6">
      {/* Profile */}
      <div className="text-center mb-10">
        <div className="icon-circle w-20 h-20 mx-auto mb-5 flex items-center justify-center green-glow">
          <span className="green-gradient text-2xl font-bold">F</span>
        </div>
        <h2 className="text-2xl font-bold text-kinari">
          FTRN
          <span className="green-gradient ml-1 font-light">#5</span>
        </h2>
        <p className="text-xs text-matcha-light/50 mt-2 font-semibold tracking-widest uppercase">
          Festival Tari Tradisional Nasional
        </p>
        <p className="text-xs text-kinari/25 mt-1 font-medium">
          ISI Yogyakarta
        </p>
      </div>

      {/* Divider */}
      <div className="zen-divider mb-8" />

      {/* Contact label */}
      <p className="text-[11px] font-bold tracking-[0.2em] text-matcha-light uppercase mb-4">
        Hubungi Kami
      </p>

      {/* Contact list */}
      <div className="space-y-3">
        {contacts.map((contact) => {
          const Icon = contact.icon
          return (
            <a
              key={contact.label}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div className="glass-zen-card px-5 py-4 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${contact.color} border border-kinari/[0.08] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 text-matcha-light/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-kinari/80 font-semibold">{contact.label}</p>
                  <p className="text-xs text-kinari/35 mt-0.5 truncate font-medium">{contact.value}</p>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-kinari/[0.08] group-hover:text-matcha-light/40 transition-colors duration-300 shrink-0" />
              </div>
            </a>
          )
        })}
      </div>

      {/* Quote */}
      <div className="mt-10 text-center glass-zen-card p-6">
        <Heart className="w-4 h-4 text-sakura/40 mx-auto mb-3" />
        <p className="text-xs text-kinari/50 font-medium leading-loose italic">
          Tari adalah bahasa jiwa,<br />
          yang menghubungkan kita dengan<br />
          budaya dan tradisi
        </p>
        <p className="text-[10px] text-matcha-light/25 mt-3 font-bold tracking-widest">— FTRN #5</p>
      </div>
    </div>
  )
}
