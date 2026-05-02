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
    <div className="divide-y divide-ios-separator">
      {/* Profile header - IG profile style */}
      <div className="px-4 pt-6 pb-4 text-center">
        <div className="w-16 h-16 rounded-full bg-accent-green-dim mx-auto mb-3 flex items-center justify-center">
          <span className="text-accent-green font-bold text-lg">F5</span>
        </div>
        <h2 className="text-lg font-semibold text-white">FTRN #5</h2>
        <p className="text-sm text-ios-secondary mt-0.5">
          Festival Tari Tradisional Nasional
        </p>
        <p className="text-xs text-ios-tertiary mt-1">ISI Yogyakarta</p>
      </div>

      {/* Contact list - iOS Settings style */}
      <div>
        {contacts.map((contact) => {
          const Icon = contact.icon
          return (
            <a
              key={contact.label}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 active:bg-ios-card transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-white/[0.07] flex items-center justify-center">
                <Icon className="w-4 h-4 text-accent-green" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] text-white">{contact.label}</p>
                <p className="text-xs text-ios-secondary truncate">{contact.value}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-ios-tertiary shrink-0" />
            </a>
          )
        })}
      </div>

      {/* Info section */}
      <div className="p-4">
        <div className="glass-card p-4">
          <p className="text-xs text-ios-secondary leading-relaxed text-center italic">
            &ldquo;Tari adalah bahasa jiwa yang menghubungkan kita dengan budaya dan tradisi nenek moyang.&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}
