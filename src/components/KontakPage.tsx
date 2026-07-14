'use client'

import React from 'react'
import { Mail, Instagram, MessageCircle, Youtube, ExternalLink, Heart } from 'lucide-react'
import Image from 'next/image'

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
    href: 'https://youtube.com/@ftrnisiyogyakarta2655',
  },
]

export default function KontakPage() {
  return (
    <div className="px-6 pt-8 pb-6">
      {/* Profile */}
      <div className="text-center mb-10">
        <div className="icon-circle w-16 h-16 mx-auto mb-5 flex items-center justify-center">
          <Image
            src="/ftrn-logo.png"
            alt="FTRN"
            width={36}
            height={36}
            className="object-contain"
            style={{ filter: 'brightness(0) invert(0.3)' }}
          />
        </div>
        <div className="mb-2">
          <Image
            src="/ftrn-text.png"
            alt="FTRN #5"
            width={110}
            height={38}
            className="object-contain mx-auto"
            style={{ filter: 'brightness(0)' }}
          />
        </div>
        <p className="text-xs text-primary/60 mt-2 font-semibold tracking-widest uppercase">
          Festival Teater Remaja Nusantara
        </p>
        <p className="text-xs text-foreground/30 mt-1 font-medium">
          ISI Yogyakarta
        </p>
      </div>

      {/* Divider */}
      <div className="zen-divider mb-8" />

      {/* Contact label */}
      <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase mb-4">
        Hubungi Kami
      </p>

      {/* Contact list — seamless */}
      <div className="space-y-2">
        {contacts.map((contact) => {
          const Icon = contact.icon
          return (
            <a
              key={contact.label}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block py-3 flex items-center gap-4 hover:bg-foreground/[0.02] rounded-lg px-3 -mx-3 transition-colors duration-200"
            >
              <div className="w-10 h-10 rounded-full bg-primary/6 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors duration-200">
                <Icon className="w-4.5 h-4.5 text-primary/50 group-hover:text-primary/70 transition-colors duration-200" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground/80 font-semibold">{contact.label}</p>
                <p className="text-xs text-foreground/40 mt-0.5 truncate font-medium">{contact.value}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-foreground/[0.08] group-hover:text-primary/40 transition-colors duration-200 shrink-0" />
            </a>
          )
        })}
      </div>

      {/* Quote */}
      <div className="mt-10 text-center">
        <Heart className="w-4 h-4 text-sakura/40 mx-auto mb-3" />
        <p className="text-xs text-foreground/50 font-medium leading-loose italic">
          Sampai jumpa di,<br />
          Festival Teater Remaja Nusantara #5<br />
          2026
        </p>
        <p className="text-[10px] text-primary/30 mt-3 font-bold tracking-widest">— FTRN #5</p>
      </div>
    </div>
  )
}
