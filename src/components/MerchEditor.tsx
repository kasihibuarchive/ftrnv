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
    is3D: boolean; modelUrl: string | null; modelType: string | null; published: boolean
  } | null
  onSave: (data: {
    name: string; slug: string; description?: string
    price: number; imageUrl?: string; category: string
    is3D: boolean; modelUrl?: string; modelType?: string; published: boolean
  }) => Promise<void>
  onCancel: () => void
}

const modelTypes = [
  { value: 'embed', label: 'Embed 3D Viewer', desc: 'Tampilkan model 3D langsung di halaman (glTF/GLB)' },
  { value: 'sketchfab', label: 'Sketchfab', desc: 'Link ke model Sketchfab' },
  { value: 'video', label: 'Video Preview', desc: 'Link video YouTube/dll sebagai preview' },
  { value: 'ar', label: 'AR Link', desc: 'Link untuk pengalaman Augmented Reality' },
]

export default function MerchEditor({ merch, onSave, onCancel }: MerchEditorProps) {
  const [name, setName] = useState(merch?.name || '')
  const [slug, setSlug] = useState(merch?.slug || '')
  const [description, setDescription] = useState(merch?.description || '')
  const [price, setPrice] = useState(merch?.price?.toString() || '0')
  const [imageUrl, setImageUrl] = useState(merch?.imageUrl || '')
  const [category, setCategory] = useState(merch?.category || 'custom')
  const [is3D, setIs3D] = useState(merch?.is3D || false)
  const [modelUrl, setModelUrl] = useState(merch?.modelUrl || '')
  const [modelType, setModelType] = useState(merch?.modelType || 'embed')
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
        modelType: is3D ? (modelType || 'embed') : undefined,
        published,
      })
    } finally {
      setSaving(false)
    }
  }

  const inputCls = "w-full glass-zen-input px-4 py-3 text-sm text-foreground/75 placeholder:text-foreground/15 outline-none tracking-wide"

  const selectedModelType = modelTypes.find(mt => mt.value === modelType)

  return (
    <div className="px-6 space-y-5 pb-8">
      {/* Meta */}
      <div className="glass-zen-strong p-6 space-y-4">
        <div>
          <Label className="text-[10px] text-foreground/30 tracking-wider mb-1.5 block">Nama Merchandise</Label>
          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Nama produk..."
            className={inputCls}
          />
        </div>
        <div>
          <Label className="text-[10px] text-foreground/30 tracking-wider mb-1.5 block">Slug</Label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="slug-produk"
            className={`${inputCls} font-mono text-xs`}
          />
        </div>
        <div>
          <Label className="text-[10px] text-foreground/30 tracking-wider mb-1.5 block">Deskripsi</Label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Deskripsi produk..."
            rows={4}
            className={`${inputCls} resize-none`}
          />
        </div>
        <div>
          <Label className="text-[10px] text-foreground/30 tracking-wider mb-1.5 block">Harga (Rp)</Label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            className={inputCls}
          />
        </div>
        <div>
          <Label className="text-[10px] text-foreground/30 tracking-wider mb-1.5 block">URL Gambar</Label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className={inputCls}
          />
        </div>
        <div>
          <Label className="text-[10px] text-foreground/30 tracking-wider mb-1.5 block">Kategori</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="glass-zen-input border-0 h-10 text-sm text-foreground/65">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
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
            <span className="text-xs text-foreground/45 tracking-wider">3D Model</span>
            <Switch checked={is3D} onCheckedChange={setIs3D} />
          </div>
          {is3D && (
            <div className="space-y-3 pl-1">
              {/* Model Type Selection */}
              <div>
                <Label className="text-[10px] text-foreground/30 tracking-wider mb-2 block">Tipe 3D</Label>
                <div className="space-y-2">
                  {modelTypes.map((mt) => (
                    <button
                      key={mt.value}
                      type="button"
                      onClick={() => setModelType(mt.value)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-200 ${
                        modelType === mt.value
                          ? 'border-primary/25 bg-primary/6'
                          : 'border-border bg-transparent hover:border-primary/10'
                      }`}
                    >
                      <p className={`text-[11px] font-semibold tracking-wide ${modelType === mt.value ? 'text-primary' : 'text-foreground/50'}`}>
                        {mt.label}
                      </p>
                      <p className="text-[9px] text-foreground/30 mt-0.5">{mt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* URL Input */}
              <div>
                <Label className="text-[10px] text-foreground/30 tracking-wider mb-1.5 block">
                  {modelType === 'embed' ? 'URL Model 3D (glTF/GLB)' :
                   modelType === 'sketchfab' ? 'URL Sketchfab' :
                   modelType === 'video' ? 'URL Video (YouTube/dll)' :
                   'URL AR Experience'}
                </Label>
                <input
                  value={modelUrl}
                  onChange={(e) => setModelUrl(e.target.value)}
                  placeholder={
                    modelType === 'embed' ? 'https://model.glb' :
                    modelType === 'sketchfab' ? 'https://sketchfab.com/...' :
                    modelType === 'video' ? 'https://youtube.com/...' :
                    'https://...'
                  }
                  className={inputCls}
                />
                {selectedModelType && (
                  <p className="text-[9px] text-foreground/20 mt-1.5 tracking-wide">
                    {modelType === 'embed' ? 'File glTF (.gltf) atau GLB (.glb) yang bisa di-embed langsung' :
                     modelType === 'sketchfab' ? 'Link ke halaman model Sketchfab' :
                     modelType === 'video' ? 'Video YouTube atau link video lain sebagai preview 3D' :
                     'Link ke experience AR (bisa dibuka di perangkat mobile)'}
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-foreground/45 tracking-wider">Terbitkan</span>
            <Switch checked={published} onCheckedChange={setPublished} />
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl text-xs text-foreground/28 border border-border hover:border-foreground/10 tracking-wider transition-colors duration-300"
        >
          Batal
        </button>
        <button
          onClick={handleSave}
          disabled={saving || !name.trim() || !slug.trim()}
          className="flex-1 py-3 rounded-xl text-xs bg-primary/15 text-primary tracking-wider hover:bg-primary/25 transition-colors duration-500 disabled:opacity-30"
        >
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </div>
  )
}
