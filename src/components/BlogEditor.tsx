'use client'

import React, { useState, useCallback, useRef } from 'react'
import {
  Bold, Italic, Heading1, Heading2, Heading3,
  Link as LinkIcon, Image as ImageIcon, Video,
  List, ListOrdered, Quote, Code
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { proxyImageUrl } from '@/lib/image-proxy'
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

  const handleTitleChange = (t: string) => { setTitle(t); if (!blog) setSlug(generateSlug(t)) }

  const insertAtCursor = useCallback((text: string) => {
    const ta = textareaRef.current
    if (!ta) return
    const s = ta.selectionStart, e = ta.selectionEnd
    setContent(prev => prev.substring(0, s) + text + prev.substring(e))
    setTimeout(() => { ta.focus(); ta.setSelectionRange(s + text.length, s + text.length) }, 0)
  }, [])

  const handleToolbarAction = (action: string) => {
    const ta = textareaRef.current
    if (!ta) return
    const s = ta.selectionStart, e = ta.selectionEnd
    const sel = ta.value.substring(s, e)
    switch (action) {
      case 'bold': insertAtCursor(sel ? `**${sel}**` : '**teks**'); break
      case 'italic': insertAtCursor(sel ? `*${sel}*` : '*miring*'); break
      case 'h1': insertAtCursor(`# ${sel || 'Heading 1'}`); break
      case 'h2': insertAtCursor(`## ${sel || 'Heading 2'}`); break
      case 'h3': insertAtCursor(`### ${sel || 'Heading 3'}`); break
      case 'link': setLinkText(sel || ''); setLinkUrl(''); setLinkDialogOpen(true); break
      case 'image': setImageAlt(sel || ''); setImageUrl(''); setImageDialogOpen(true); break
      case 'video': setVideoUrl(''); setVideoDialogOpen(true); break
      case 'ul': insertAtCursor(sel ? `\n- ${sel.split('\n').join('\n- ')}` : '\n- Item 1\n- Item 2'); break
      case 'ol': insertAtCursor(sel ? `\n1. ${sel.split('\n').map((l,i) => `${i+1}. ${l}`).join('\n')}` : '\n1. Item 1\n2. Item 2'); break
      case 'quote': insertAtCursor(sel ? `> ${sel}` : '> Kutipan'); break
      case 'code': insertAtCursor(sel ? `\`\`\`\n${sel}\n\`\`\`` : '```\nkode\n```'); break
    }
  }

  const insertLink = () => { insertAtCursor(linkText ? `[${linkText}](${linkUrl})` : `[${linkUrl}](${linkUrl})`); setLinkDialogOpen(false) }
  const insertImage = () => { insertAtCursor(`![${imageAlt || 'gambar'}](${imageUrl})`); setImageDialogOpen(false) }
  const insertVideo = () => {
    let url = videoUrl
    const m = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
    if (m) url = `https://www.youtube.com/embed/${m[1]}`
    insertAtCursor(`[Video](${url})\n\n<iframe width="100%" height="400" src="${url}" frameborder="0" allowfullscreen></iframe>`)
    setVideoDialogOpen(false)
  }

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) return
    setSaving(true)
    try {
      await onSave({ title, slug, content, excerpt: excerpt || undefined, coverImage: coverImage || undefined, isHighlight, highlightType: isHighlight ? (highlightType || undefined) : undefined, category: category || undefined, published })
    } finally { setSaving(false) }
  }

  const inputCls = "w-full glass-zen-input px-4 py-3 text-sm text-foreground/75 placeholder:text-foreground/15 outline-none tracking-wide"
  const dialogCls = "bg-popover/95 border-border text-foreground/75"

  return (
    <div className="px-6 space-y-5 pb-8">
      {/* Meta */}
      <div className="glass-zen-strong p-6 space-y-4">
        <div>
          <Label className="text-[10px] text-foreground/30 tracking-wider mb-1.5 block">Judul</Label>
          <input value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Judul artikel..." className={inputCls} />
        </div>
        <div>
          <Label className="text-[10px] text-foreground/30 tracking-wider mb-1.5 block">Slug</Label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug-artikel" className={`${inputCls} font-mono text-xs`} />
        </div>
        <div>
          <Label className="text-[10px] text-foreground/30 tracking-wider mb-1.5 block">Ringkasan</Label>
          <input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Deskripsi singkat..." className={inputCls} />
        </div>
        <div>
          <Label className="text-[10px] text-foreground/30 tracking-wider mb-1.5 block">URL Cover Image</Label>
          <input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." className={inputCls} />
        </div>
        <div>
          <Label className="text-[10px] text-foreground/30 tracking-wider mb-1.5 block">Kategori</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="glass-zen-input border-0 h-10 text-sm text-foreground/65">{<SelectValue placeholder="Pilih kategori" />}</SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="pendaftaran">Pendaftaran</SelectItem>
              <SelectItem value="informasi">Informasi</SelectItem>
              <SelectItem value="juklak">Juklak</SelectItem>
              <SelectItem value="umum">Umum</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="zen-divider" />

        <div className="space-y-3">
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-foreground/45 tracking-wider">Highlight</span>
            <Switch checked={isHighlight} onCheckedChange={setIsHighlight} />
          </div>
          {isHighlight && (
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-foreground/45 tracking-wider">Tipe Highlight</span>
              <Select value={highlightType} onValueChange={setHighlightType}>
                <SelectTrigger className="glass-zen-input border-0 h-9 w-28 text-xs text-foreground/65">{<SelectValue placeholder="Pilih" />}</SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="headline">Headline</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-foreground/45 tracking-wider">Terbitkan</span>
            <Switch checked={published} onCheckedChange={setPublished} />
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="glass-zen-strong overflow-hidden">
        <div className="flex items-center gap-0.5 px-3 py-2 border-b border-border overflow-x-auto no-scrollbar">
          {toolbarButtons.map((btn) => (
            <button key={btn.action} onClick={() => handleToolbarAction(btn.action)}
              className="p-2 rounded-lg text-foreground/15 hover:text-primary/55 hover:bg-foreground/[0.03] transition-colors duration-300 shrink-0">
              <btn.icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
          <div className="blog-editor">
            <div className="px-3 py-2 text-[9px] text-foreground/12 tracking-[0.2em] uppercase border-b border-border">Markdown</div>
            <textarea ref={textareaRef} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Tulis di sini..." className="w-full h-[400px] p-3 text-sm leading-relaxed resize-none" />
          </div>
          <div>
            <div className="px-3 py-2 text-[9px] text-foreground/12 tracking-[0.2em] uppercase border-b border-border">Pratinjau</div>
            <div className="h-[400px] overflow-y-auto no-scrollbar p-3">
              <div className="markdown-content"><ReactMarkdown
                components={{
                  img: ({ src, alt, ...props }) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={proxyImageUrl(src)} alt={alt} {...props} />
                  ),
                }}
              >{content || '*Mulai menulis...'}</ReactMarkdown></div>
            </div>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-3 rounded-xl text-xs text-foreground/28 border border-border hover:border-foreground/10 tracking-wider transition-colors duration-300">
          Batal
        </button>
        <button onClick={handleSave} disabled={saving || !title.trim() || !slug.trim()}
          className="flex-1 py-3 rounded-xl text-xs bg-primary/15 text-primary tracking-wider hover:bg-primary/25 transition-colors duration-500 disabled:opacity-30">
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>

      {/* Dialogs */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className={dialogCls}>
          <DialogHeader><DialogTitle className="text-foreground/65 text-sm font-light">Sisipkan Tautan</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-[10px] text-foreground/22">Teks</Label><input value={linkText} onChange={(e) => setLinkText(e.target.value)} placeholder="Teks tautan" className={inputCls} /></div>
            <div><Label className="text-[10px] text-foreground/22">URL</Label><input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." className={inputCls} /></div>
          </div>
          <DialogFooter><button onClick={insertLink} disabled={!linkUrl} className="bg-primary/15 text-primary text-xs px-4 py-2 rounded-xl disabled:opacity-30 tracking-wider">Sisipkan</button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className={dialogCls}>
          <DialogHeader><DialogTitle className="text-foreground/65 text-sm font-light">Sisipkan Gambar</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-[10px] text-foreground/22">Alt Text</Label><input value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} placeholder="Deskripsi gambar" className={inputCls} /></div>
            <div><Label className="text-[10px] text-foreground/22">URL Gambar</Label><input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className={inputCls} /></div>
          </div>
          <DialogFooter><button onClick={insertImage} disabled={!imageUrl} className="bg-primary/15 text-primary text-xs px-4 py-2 rounded-xl disabled:opacity-30 tracking-wider">Sisipkan</button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className={dialogCls}>
          <DialogHeader><DialogTitle className="text-foreground/65 text-sm font-light">Sisipkan Video</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-[10px] text-foreground/22">URL Video</Label><input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/..." className={inputCls} /></div>
          </div>
          <DialogFooter><button onClick={insertVideo} disabled={!videoUrl} className="bg-primary/15 text-primary text-xs px-4 py-2 rounded-xl disabled:opacity-30 tracking-wider">Sisipkan</button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
