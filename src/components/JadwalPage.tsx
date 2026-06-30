'use client'

import React from 'react'
import { CalendarDays, MapPin, Clock, Star } from 'lucide-react'

interface ScheduleEvent {
  date: string
  dateShort: string
  title: string
  description: string
  icon: React.ElementType
  isUpcoming: boolean
  isSegera: boolean
  isHighlight: boolean
}

const scheduleEvents: ScheduleEvent[] = [
  {
    date: '1 Mei 2026',
    dateShort: '1 Mei',
    title: 'Pendaftaran Dibuka',
    description: 'Formulir pendaftaran FTRN #5 resmi dibuka untuk semua peserta',
    icon: CalendarDays,
    isUpcoming: true,
    isSegera: true,
    isHighlight: false,
  },
  {
    date: '15 Juni 2026',
    dateShort: '15 Jun',
    title: 'Batas Pendaftaran',
    description: 'Batas akhir pengiriman formulir pendaftaran dan berkas persyaratan',
    icon: Clock,
    isUpcoming: true,
    isSegera: false,
    isHighlight: false,
  },
  {
    date: '20 Juni 2026',
    dateShort: '20 Jun',
    title: 'Technical Meeting',
    description: 'Pertemuan teknis untuk seluruh peserta mengenai tata cara pentas',
    icon: MapPin,
    isUpcoming: true,
    isSegera: false,
    isHighlight: false,
  },
  {
    date: '25 Juni 2026',
    dateShort: '25 Jun',
    title: 'Gladi Bersih',
    description: 'Sesi gladi bersih dan pengecekan teknis di venue pentas',
    icon: Star,
    isUpcoming: true,
    isSegera: false,
    isHighlight: false,
  },
  {
    date: '28 Juni 2026',
    dateShort: '28 Jun',
    title: 'Hari 1 — Pentas Teater Tradisional',
    description: 'Pertunjukan kategori Teater Tradisional Murni oleh para peserta',
    icon: Star,
    isUpcoming: true,
    isSegera: false,
    isHighlight: true,
  },
  {
    date: '29 Juni 2026',
    dateShort: '29 Jun',
    title: 'Hari 2 — Pentas Teater Kreasi Baru',
    description: 'Pertunjukan kategori Teater Kreasi Baru oleh para peserta',
    icon: Star,
    isUpcoming: true,
    isSegera: false,
    isHighlight: true,
  },
  {
    date: '30 Juni 2026',
    dateShort: '30 Jun',
    title: 'Penghargaan & Penutupan',
    description: 'Pengumuman pemenang dan upacara penutupan FTRN #5',
    icon: Star,
    isUpcoming: true,
    isSegera: false,
    isHighlight: true,
  },
]

export default function JadwalPage() {
  return (
    <div className="px-6 pt-8 pb-6">
      {/* Header */}
      <div className="mb-8">
        <div className="badge-matcha px-3 py-1 inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase mb-4">
          <CalendarDays className="w-3 h-3" />
          Jadwal Acara
        </div>
        <h1 className="text-2xl font-bold text-kinari mb-2">
          Timeline FTRN #5
        </h1>
        <p className="text-sm text-kinari/40 leading-relaxed font-medium">
          Ikuti setiap tahap perjalanan Festival Teater Remaja Nusantara ke-5
        </p>
        <div className="zen-divider mt-6" />
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-matcha/40 via-matcha/20 to-matcha/5" />

        <div className="space-y-4">
          {scheduleEvents.map((event, index) => {
            const Icon = event.icon
            return (
              <div key={index} className="relative flex gap-4">
                {/* Timeline dot */}
                <div className="relative z-10 shrink-0 mt-4">
                  <div
                    className={`w-[36px] h-[36px] rounded-full flex items-center justify-center transition-all duration-300 ${
                      event.isHighlight
                        ? 'bg-matcha/20 border-2 border-matcha/50 green-glow-soft'
                        : event.isSegera
                        ? 'bg-sakura/15 border-2 border-sakura/40'
                        : 'bg-matcha/10 border border-matcha/20'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        event.isHighlight
                          ? 'text-matcha-light'
                          : event.isSegera
                          ? 'text-sakura'
                          : 'text-matcha-light/50'
                      }`}
                      strokeWidth={event.isHighlight ? 2 : 1.5}
                    />
                  </div>
                </div>

                {/* Card */}
                <div
                  className={`glass-zen-card flex-1 p-4 ${
                    event.isHighlight ? 'border-matcha/30' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p
                      className={`text-[11px] font-bold tracking-wide uppercase ${
                        event.isHighlight
                          ? 'text-matcha-light'
                          : event.isSegera
                          ? 'text-sakura'
                          : 'text-kinari/40'
                      }`}
                    >
                      {event.date}
                    </p>
                    {event.isSegera && (
                      <span className="badge-urgent px-2 py-0.5 text-[8px] font-bold tracking-wider uppercase animate-pulse-soft">
                        Segera!
                      </span>
                    )}
                  </div>
                  <h3
                    className={`text-sm font-bold leading-snug mb-1 ${
                      event.isHighlight ? 'text-kinari' : 'text-kinari/80'
                    }`}
                  >
                    {event.title}
                  </h3>
                  <p className="text-xs text-kinari/35 font-medium leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-10 glass-zen-card p-5 text-center">
        <p className="text-xs text-kinari/30 font-medium leading-relaxed">
          Jadwal dapat berubah sewaktu-waktu. Pantau terus informasi terbaru dari FTRN #5 melalui halaman Beranda dan media sosial kami.
        </p>
      </div>
    </div>
  )
}
