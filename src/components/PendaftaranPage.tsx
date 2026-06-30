'use client'

import React, { useState } from 'react'
import { ClipboardList, Send, CheckCircle, Loader2 } from 'lucide-react'

interface FormData {
  namaLengkap: string
  namaGrup: string
  email: string
  whatsapp: string
  kategori: string
  judulPertunjukan: string
  durasi: string
  nomorSurat: string
}

const initialForm: FormData = {
  namaLengkap: '',
  namaGrup: '',
  email: '',
  whatsapp: '',
  kategori: '',
  judulPertunjukan: '',
  durasi: '',
  nomorSurat: '',
}

const kategoriOptions = [
  { value: 'Teater Tradisional Murni', label: 'Teater Tradisional Murni' },
  { value: 'Teater Kreasi Baru', label: 'Teater Kreasi Baru' },
]

const durasiOptions = [
  { value: '5 menit', label: '5 menit' },
  { value: '7 menit', label: '7 menit' },
  { value: '10 menit', label: '10 menit' },
  { value: '12 menit', label: '12 menit' },
  { value: '15 menit', label: '15 menit' },
]

export default function PendaftaranPage() {
  const [form, setForm] = useState<FormData>(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.namaLengkap || !form.namaGrup || !form.email || !form.whatsapp || !form.kategori || !form.judulPertunjukan || !form.durasi) {
      setError('Mohon lengkapi semua field yang wajib diisi')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/pendaftaran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Terjadi kesalahan saat mendaftar')
        return
      }

      setSubmitted(true)
      setForm(initialForm)
    } catch {
      setError('Gagal mengirim formulir. Silakan coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="px-6 pt-8 pb-6">
        <div className="glass-zen-strong p-8 text-center">
          <div className="icon-circle w-16 h-16 mx-auto mb-5 flex items-center justify-center green-glow">
            <CheckCircle className="w-8 h-8 text-matcha-light" />
          </div>
          <h2 className="text-xl font-bold text-kinari mb-3">Pendaftaran Berhasil!</h2>
          <p className="text-sm text-kinari/50 leading-relaxed font-medium mb-6">
            Terima kasih telah mendaftar di FTRN #5. Kami akan menghubungi Anda melalui email atau WhatsApp untuk konfirmasi lebih lanjut.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="cta-button px-6 py-2.5 text-sm font-semibold"
          >
            Daftar Lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 pt-8 pb-6">
      {/* Header */}
      <div className="mb-8">
        <div className="badge-matcha px-3 py-1 inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase mb-4">
          <ClipboardList className="w-3 h-3" />
          Pendaftaran
        </div>
        <h1 className="text-2xl font-bold text-kinari mb-2">
          Formulir Pendaftaran
        </h1>
        <p className="text-sm text-kinari/40 leading-relaxed font-medium">
          Daftarkan grup atau institusi Anda untuk tampil di Festival Teater Remaja Nusantara #5
        </p>
        <div className="zen-divider mt-6" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="glass-zen-strong p-6 space-y-5">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-[11px] font-bold tracking-[0.15em] text-matcha-light uppercase mb-2">
              Nama Lengkap <span className="text-sakura">*</span>
            </label>
            <input
              type="text"
              name="namaLengkap"
              value={form.namaLengkap}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              className="glass-zen-input w-full px-4 py-3 text-sm text-kinari/85 placeholder:text-kinari/20 font-medium outline-none"
            />
          </div>

          {/* Nama Grup/Institusi */}
          <div>
            <label className="block text-[11px] font-bold tracking-[0.15em] text-matcha-light uppercase mb-2">
              Nama Grup / Institusi <span className="text-sakura">*</span>
            </label>
            <input
              type="text"
              name="namaGrup"
              value={form.namaGrup}
              onChange={handleChange}
              placeholder="Masukkan nama grup atau institusi"
              className="glass-zen-input w-full px-4 py-3 text-sm text-kinari/85 placeholder:text-kinari/20 font-medium outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold tracking-[0.15em] text-matcha-light uppercase mb-2">
              Email <span className="text-sakura">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="contoh@email.com"
              className="glass-zen-input w-full px-4 py-3 text-sm text-kinari/85 placeholder:text-kinari/20 font-medium outline-none"
            />
          </div>

          {/* No. WhatsApp */}
          <div>
            <label className="block text-[11px] font-bold tracking-[0.15em] text-matcha-light uppercase mb-2">
              No. WhatsApp <span className="text-sakura">*</span>
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="+62 8xx-xxxx-xxxx"
              className="glass-zen-input w-full px-4 py-3 text-sm text-kinari/85 placeholder:text-kinari/20 font-medium outline-none"
            />
          </div>

          {/* Kategori Pertunjukan */}
          <div>
            <label className="block text-[11px] font-bold tracking-[0.15em] text-matcha-light uppercase mb-2">
              Kategori Pertunjukan <span className="text-sakura">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {kategoriOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, kategori: opt.value }))}
                  className={`badge-matcha px-3 py-1.5 text-[11px] font-semibold tracking-wide transition-all duration-300 ${
                    form.kategori === opt.value
                      ? 'bg-matcha/30 border-matcha/50 text-kinari green-glow-soft'
                      : 'hover:bg-matcha/15'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {!form.kategori && (
              <p className="text-[10px] text-kinari/20 mt-1.5 font-medium">Pilih salah satu kategori</p>
            )}
          </div>

          {/* Judul Pertunjukan */}
          <div>
            <label className="block text-[11px] font-bold tracking-[0.15em] text-matcha-light uppercase mb-2">
              Judul Pertunjukan <span className="text-sakura">*</span>
            </label>
            <input
              type="text"
              name="judulPertunjukan"
              value={form.judulPertunjukan}
              onChange={handleChange}
              placeholder="Masukkan judul pertunjukan"
              className="glass-zen-input w-full px-4 py-3 text-sm text-kinari/85 placeholder:text-kinari/20 font-medium outline-none"
            />
          </div>

          {/* Durasi Pertunjukan */}
          <div>
            <label className="block text-[11px] font-bold tracking-[0.15em] text-matcha-light uppercase mb-2">
              Durasi Pertunjukan <span className="text-sakura">*</span>
            </label>
            <select
              name="durasi"
              value={form.durasi}
              onChange={handleChange}
              className="glass-zen-input w-full px-4 py-3 text-sm text-kinari/85 font-medium outline-none appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(245,240,232,0.3)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
              }}
            >
              <option value="" className="bg-[#1a2e1a] text-kinari/50">Pilih durasi</option>
              {durasiOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#1a2e1a] text-kinari/85">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Nomor Surat (optional) */}
          <div>
            <label className="block text-[11px] font-bold tracking-[0.15em] text-matcha-light uppercase mb-2">
              Nomor Surat <span className="text-kinari/20 text-[9px] lowercase tracking-normal font-medium">(opsional)</span>
            </label>
            <input
              type="text"
              name="nomorSurat"
              value={form.nomorSurat}
              onChange={handleChange}
              placeholder="Nomor surat referensi (jika ada)"
              className="glass-zen-input w-full px-4 py-3 text-sm text-kinari/85 placeholder:text-kinari/20 font-medium outline-none"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="badge-urgent px-4 py-2.5 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="cta-button w-full py-3.5 text-sm font-bold tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Mengirim...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Kirim Pendaftaran
            </>
          )}
        </button>

        <p className="text-[10px] text-kinari/20 text-center font-medium leading-relaxed">
          Dengan mendaftar, Anda menyetujui ketentuan yang berlaku di FTRN #5
        </p>
      </form>
    </div>
  )
}
