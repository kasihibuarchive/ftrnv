'use client'

import React, { useState, useCallback, useRef } from 'react'
import {
  Bold, Italic, Heading1, Heading2, Heading3,
  Link as LinkIcon, Image as ImageIcon, Video,
  List, ListOrdered, Quote, Code
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'

interface BlogEditorProps {
  blog?: {
    id: string; title: string; slug: string; content: string
    excerpt?: string; coverImage?: string; isHighlight: boolean
    highlightType?: string; category?: string; published: boolean
  } | null
  onSave: (data: {
    title: string; slug: string; content: string; excerpt?: string
    coverImage?: string; isHighlight: boolean; highlightType?: string
    category?: string; published: boolean
  }) => Promise<void>
  onCancel: () => void
}

const toolbarButtons = [
  { icon: Bold, action: 'bold' },
  { icon: Italic, action: 'italic' },
  { icon: Heading1, action: 'h1' },
  { icon: Heading2, action: 'h2' },
  { icon: Heading3, action: 'h3' },
  { icon: LinkIcon, action: 'link' },
  { icon: ImageIcon, action: 'image' },
  { icon: Video, action: 'video' },
  { icon: List, action: 'ul' },
  { icon: ListOrdered, action: 'ol' },
  { icon: Quote, action: 'quote' },
  { icon: Code, action: 'code' },
]

export default function BlogEditor({ blog, onSave, onCancel }: BlogEditorProps) {
  const [title, setTitle] = useState(blog?.title || '')
  const [slug, setSlug] = useState(blog?.slug || '')
  const [content, setContent] = useState(blog?.content || '')
  const [excerpt, setExcerpt] = useState(blog?.excerpt || '')
  const [coverImage, setCoverImage] = useState(blog?.coverImage || '')
  const [isHighlight, setIsHighlight] = useState(blog?.isHighlight || false)
  const [highlightType, setHighlightType] = useState(blog?.highlightType || '')
  const [category, setCategory] = useState(blog?.category || '')
  const [published, setPublished] = useState(blog?.published || false)
  const [saving, setSaving] = useState(false)

  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [videoDialogOpen, setVideoDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const generateSlug = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    if (!blog) setSlug(generateSlug(newTitle))
  }

  const insertAtCursor = useCallback((text: string) => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newContent = content.substring(0, start) + text + content.substring(end)
    setContent(newContent)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  }, [content])

  const handleToolbarAction = (action: string) => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.substring(start, end)

    switch (action) {
      case 'bold': insertAtCursor(selected ? `**${selected}**` : '**teks**'); break
      case 'italic': insertAtCursor(selected ? `*${selected}*` : '*miring*'); break
      case 'h1': insertAtCursor(`# ${selected || 'Heading 1'}`); break
      case 'h2': insertAtCursor(`## ${selected || 'Heading 2'}`); break
      case 'h3': insertAtCursor(`### ${selected || 'Heading 3'}`); break
      case 'link': setLinkText(selected || ''); setLinkUrl(''); setLinkDialogOpen(true); break
      case 'image': setImageAlt(selected || ''); setImageUrl(''); setImageDialogOpen(true); break
      case 'video': setVideoUrl(''); setVideoDialogOpen(true); break
      case 'ul': insertAtCursor(selected ? `\n- ${selected.split('\n').join('\n- ')}` : '\n- Item 1\n- Item 2'); break
      case 'ol': insertAtCursor(selected ? `\n1. ${selected.split('\n').map((l, i) => `${i+1}. ${l}`).join('\n')}` : '\n1. Item 1\n2. Item 2'); break
      case 'quote': insertAtCursor(selected ? `> ${selected}` : '> Kutipan'); break
      case 'code': insertAtCursor(selected ? `\`\`\`\n${selected}\n\`\`\`` : '```\nkode\n```'); break
    }
  }

  const insertLink = () => {
    insertAtCursor(linkText ? `[${linkText}](${linkUrl})` : `[${linkUrl}](${linkUrl})`)
    setLinkDialogOpen(false); setLinkUrl(''); setLinkText('')
  }

  const insertImage = () => {
    insertAtCursor(`![${imageAlt || 'gambar'}](${imageUrl})`)
    setImageDialogOpen(false); setImageUrl(''); setImageAlt('')
  }

  const insertVideo = () => {
    let embedUrl = videoUrl
    const ytMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
    if (ytMatch) embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`
    insertAtCursor(`[Video](${embedUrl})\n\n<iframe width="100%" height="400" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`)
    setVideoDialogOpen(false); setVideoUrl('')
  }

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) return
    setSaving(true)
    try {
      await onSave({
        title, slug, content, excerpt: excerpt || undefined,
        coverImage: coverImage || undefined, isHighlight,
        highlightType: isHighlight ? (highlightType || undefined) : undefined,
        category: category || undefined, published,
      })
    } finally {
      setSaving(false)
    }
  }

  // iOS-style input class
  const inputCls = "w-full bg-white/[0.07] border-0 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-ios-tertiary outline-none focus:ring-1 focus:ring-accent-green/50"

  return (
    <div className="px-4 space-y-4 pb-8">
      {/* Meta fields */}
      <div className="glass-card p-4 space-y-3">
        <div>
          <Label className="text-xs text-ios-secondary mb-1 block">Judul</Label>
          <input value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Judul artikel..." className={inputCls} />
        </div>
        <div>
          <Label className="text-xs text-ios-secondary mb-1 block">Slug</Label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug-artikel" className={`${inputCls} font-mono text-xs`} />
        </div>
        <div>
          <Label className="text-xs text-ios-secondary mb-1 block">Ringkasan</Label>
          <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Deskripsi singkat..." className={inputCls} />
        </div>
        <div>
          <Label className="text-xs text-ios-secondary mb-1 block">Cover Image URL</Label>
          <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." className={inputCls} />
        </div>
        <div>
          <Label className="text-xs text-ios-secondary mb-1 block">Kategori</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="bg-white/[0.07] border-0 rounded-xl text-sm text-white h-10">
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent className="bg-[#1c1c1e] border-ios-separator">
              <SelectItem value="pendaftaran">Pendaftaran</SelectItem>
              <SelectItem value="informasi">Informasi</SelectItem>
              <SelectItem value="juklak">Juklak</SelectItem>
              <SelectItem value="umum">Umum</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Toggles - iOS style */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-white">Highlight di Beranda</span>
            <Switch checked={isHighlight} onCheckedChange={setIsHighlight} />
          </div>
          {isHighlight && (
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-white">Tipe</span>
              <Select value={highlightType} onValueChange={setHighlightType}>
                <SelectTrigger className="bg-white/[0.07] border-0 rounded-xl text-sm text-white h-9 w-32">
                  <SelectValue placeholder="Pilih" />
                </SelectTrigger>
                <SelectContent className="bg-[#1c1c1e] border-ios-separator">
                  <SelectItem value="headline">Headline</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-white">Publish</span>
            <Switch checked={published} onCheckedChange={setPublished} />
          </div>
        </div>
      </div>

      {/* Markdown Editor */}
      <div className="glass-card overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-0.5 px-2 py-2 border-b border-ios-separator overflow-x-auto no-scrollbar">
          {toolbarButtons.map((btn) => (
            <button
              key={btn.action}
              onClick={() => handleToolbarAction(btn.action)}
              className="p-2 rounded-lg text-ios-secondary hover:text-white hover:bg-white/10 active:bg-white/15 transition-colors shrink-0"
            >
              <btn.icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Split pane */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-ios-separator">
          <div className="blog-editor">
            <div className="px-3 py-2 text-[10px] text-ios-tertiary uppercase tracking-wider font-medium border-b border-ios-separator">
              Markdown
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis konten..."
              className="w-full h-[400px] p-3 text-sm leading-relaxed resize-none"
            />
          </div>
          <div>
            <div className="px-3 py-2 text-[10px] text-ios-tertiary uppercase tracking-wider font-medium border-b border-ios-separator">
              Preview
            </div>
            <div className="h-[400px] overflow-y-auto no-scrollbar p-3">
              <div className="markdown-content">
                <ReactMarkdown>{content || '*Mulai menulis...*'}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save buttons */}
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl text-sm font-medium text-ios-secondary bg-white/[0.07] active:bg-white/10"
        >
          Batal
        </button>
        <button
          onClick={handleSave}
          disabled={saving || !title.trim() || !slug.trim()}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-black bg-accent-green active:opacity-80 disabled:opacity-40"
        >
          {saving ? 'Menyimpan...' : blog ? 'Update' : 'Simpan'}
        </button>
      </div>

      {/* Dialogs */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="bg-[#1c1c1e] border-ios-separator text-white">
          <DialogHeader><DialogTitle className="text-white">Sisipkan Link</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs text-ios-secondary">Teks</Label>
              <input value={linkText} onChange={(e) => setLinkText(e.target.value)} placeholder="Teks link" className={inputCls} />
            </div>
            <div>
              <Label className="text-xs text-ios-secondary">URL</Label>
              <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." className={inputCls} />
            </div>
          </div>
          <DialogFooter>
            <button onClick={insertLink} disabled={!linkUrl} className="bg-accent-green text-black text-sm font-semibold px-4 py-2 rounded-xl disabled:opacity-40">Sisipkan</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="bg-[#1c1c1e] border-ios-separator text-white">
          <DialogHeader><DialogTitle className="text-white">Sisipkan Gambar</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs text-ios-secondary">Alt Text</Label>
              <input value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} placeholder="Deskripsi" className={inputCls} />
            </div>
            <div>
              <Label className="text-xs text-ios-secondary">Image URL</Label>
              <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className={inputCls} />
            </div>
          </div>
          <DialogFooter>
            <button onClick={insertImage} disabled={!imageUrl} className="bg-accent-green text-black text-sm font-semibold px-4 py-2 rounded-xl disabled:opacity-40">Sisipkan</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className="bg-[#1c1c1e] border-ios-separator text-white">
          <DialogHeader><DialogTitle className="text-white">Sisipkan Video</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label className="text-xs text-ios-secondary">Video URL</Label>
              <input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className={inputCls} />
            </div>
          </div>
          <DialogFooter>
            <button onClick={insertVideo} disabled={!videoUrl} className="bg-accent-green text-black text-sm font-semibold px-4 py-2 rounded-xl disabled:opacity-40">Sisipkan</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
