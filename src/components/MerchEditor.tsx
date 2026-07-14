'use client'

import React, { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

interface MerchEditorProps {
  merch?: {
    id: string; name: string; slug: string; description: string | null
    price: number; imageUrl: string | null; category: string
    is3D: boolean; modelUrl: string | null; published: boolean
  } | null
  onSave: (data: {
    name: string; slug: string; description?: string
    price: number; imageUrl?: string; category: string
    is3D: boolean; modelUrl?: string; published: boolean
  }) => Promise<void>
  onCancel: () => void
}

export default function MerchEditor({ merch, onSave, onCancel }: MerchEditorProps) {
  const [name, setName] = useState(merch?.name || '')
  const [slug, setSlug] = useState(merch?.slug || '')
  const [description, setDescription] = useState(merch?.description || '')
  const [price, setPrice] = useState(merch?.price?.toString() || '0')
  const [imageUrl, setImageUrl] = useState(merch?.imageUrl || '')
  const [category, setCategory] = useState(merch?.category || 'custom')
  const [is3D, setIs3D] = useState(merch?.is3D || false)
  const [modelUrl, setModelUrl] = useState(merch?.modelUrl || '')
  const [published, setPublished] = useState(merch?.published || false)
  const [saving, setSaving] = useState(false)

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

  const handleNameChange = (t: string) => {
    setName(t)
    if (!merch) setSlug(generateSlug(t))
  }

  const handleSave = async () => {
    if (!name.trim() || !slug.trim()) return
    setSaving(true)
    try {
      await onSave({
        name,
        slug,
        description: description || undefined,
        price: parseInt(price) || 0,
        imageUrl: imageUrl || undefined,
        category,
        is3D,
        modelUrl: is3D ? (modelUrl || undefined) : undefined,
        published,
      })
    } finally {
      setSaving(false)
    }
  }

  const inputCls = "w-full glass-zen-input px-4 py-3 text-sm text-kinari/70 placeholder:text-kinari/12 outline-none tracking-wide"

  return (
    <div className="px-6 space-y-5 pb-8">
      {/* Meta */}
      <div className="glass-zen-strong p-6 space-y-4">
        <div>
          <Label className="text-[10px] text-kinari/25 tracking-wider mb-1.5 block">Nama Merchandise</Label>
          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Nama produk..."
            className={inputCls}
          />
        </div>
        <div>
          <Label className="text-[10px] text-kinari/25 tracking-wider mb-1.5 block">Slug</Label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="slug-produk"
            className={`${inputCls} font-mono text-xs`}
          />
        </div>
        <div>
          <Label className="text-[10px] text-kinari/25 tracking-wider mb-1.5 block">Deskripsi</Label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Deskripsi produk..."
            rows={4}
            className={`${inputCls} resize-none`}
          />
        </div>
        <div>
          <Label className="text-[10px] text-kinari/25 tracking-wider mb-1.5 block">Harga (Rp)</Label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            className={inputCls}
          />
        </div>
        <div>
          <Label className="text-[10px] text-kinari/25 tracking-wider mb-1.5 block">URL Gambar</Label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className={inputCls}
          />
        </div>
        <div>
          <Label className="text-[10px] text-kinari/25 tracking-wider mb-1.5 block">Kategori</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="glass-zen-input border-0 h-10 text-sm text-kinari/60">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a2e1a] border-kinari/[0.06]">
              <SelectItem value="tshirt">T-Shirt</SelectItem>
              <SelectItem value="stiker">Stiker</SelectItem>
              <SelectItem value="totebag">Totebag</SelectItem>
              <SelectItem value="topi">Topi</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="zen-divider" />

        <div className="space-y-3">
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-kinari/40 tracking-wider">3D Model</span>
            <Switch checked={is3D} onCheckedChange={setIs3D} />
          </div>
          {is3D && (
            <div>
              <Label className="text-[10px] text-kinari/25 tracking-wider mb-1.5 block">URL Model 3D (glTF/GLB)</Label>
              <input
                value={modelUrl}
                onChange={(e) => setModelUrl(e.target.value)}
                placeholder="https://..."
                className={inputCls}
              />
            </div>
          )}
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-kinari/40 tracking-wider">Terbitkan</span>
            <Switch checked={published} onCheckedChange={setPublished} />
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl text-xs text-kinari/25 border border-kinari/[0.05] hover:border-kinari/10 tracking-wider transition-colors duration-300"
        >
          Batal
        </button>
        <button
          onClick={handleSave}
          disabled={saving || !name.trim() || !slug.trim()}
          className="flex-1 py-3 rounded-xl text-xs bg-matcha/15 text-matcha-light tracking-wider hover:bg-matcha/25 transition-colors duration-500 disabled:opacity-30"
        >
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </div>
  )
}
