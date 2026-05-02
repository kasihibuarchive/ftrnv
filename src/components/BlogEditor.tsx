'use client'

import React, { useState, useCallback, useRef } from 'react'
import {
  Bold, Italic, Heading1, Heading2, Heading3,
  Link as LinkIcon, Image as ImageIcon, Video,
  List, ListOrdered, Quote, Code, Undo, Redo
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import LiquidGlass from './LiquidGlass'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface BlogEditorProps {
  blog?: {
    id: string
    title: string
    slug: string
    content: string
    excerpt?: string
    coverImage?: string
    isHighlight: boolean
    highlightType?: string
    category?: string
    published: boolean
  } | null
  onSave: (data: {
    title: string
    slug: string
    content: string
    excerpt?: string
    coverImage?: string
    isHighlight: boolean
    highlightType?: string
    category?: string
    published: boolean
  }) => Promise<void>
  onCancel: () => void
}

const toolbarButtons = [
  { icon: Bold, label: 'Bold', action: 'bold' },
  { icon: Italic, label: 'Italic', action: 'italic' },
  { icon: Heading1, label: 'Heading 1', action: 'h1' },
  { icon: Heading2, label: 'Heading 2', action: 'h2' },
  { icon: Heading3, label: 'Heading 3', action: 'h3' },
  { icon: LinkIcon, label: 'Link', action: 'link' },
  { icon: ImageIcon, label: 'Image', action: 'image' },
  { icon: Video, label: 'Video', action: 'video' },
  { icon: List, label: 'Bullet List', action: 'ul' },
  { icon: ListOrdered, label: 'Numbered List', action: 'ol' },
  { icon: Quote, label: 'Quote', action: 'quote' },
  { icon: Code, label: 'Code', action: 'code' },
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

  // Dialog states
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [imageDialogOpen, setImageDialogOpen] = useState(false)
  const [videoDialogOpen, setVideoDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageAlt, setImageAlt] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    if (!blog) {
      setSlug(generateSlug(newTitle))
    }
  }

  const insertAtCursor = useCallback((text: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newContent = content.substring(0, start) + text + content.substring(end)
    setContent(newContent)

    // Set cursor position after insert
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + text.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }, [content])

  const handleToolbarAction = (action: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    switch (action) {
      case 'bold':
        insertAtCursor(selectedText ? `**${selectedText}**` : '**teks tebal**')
        break
      case 'italic':
        insertAtCursor(selectedText ? `*${selectedText}*` : '*teks miring*')
        break
      case 'h1':
        insertAtCursor(`# ${selectedText || 'Heading 1'}`)
        break
      case 'h2':
        insertAtCursor(`## ${selectedText || 'Heading 2'}`)
        break
      case 'h3':
        insertAtCursor(`### ${selectedText || 'Heading 3'}`)
        break
      case 'link':
        setLinkText(selectedText || '')
        setLinkUrl('')
        setLinkDialogOpen(true)
        break
      case 'image':
        setImageAlt(selectedText || '')
        setImageUrl('')
        setImageDialogOpen(true)
        break
      case 'video':
        setVideoUrl('')
        setVideoDialogOpen(true)
        break
      case 'ul':
        insertAtCursor(selectedText ? `\n- ${selectedText.split('\n').join('\n- ')}` : '\n- Item 1\n- Item 2')
        break
      case 'ol':
        insertAtCursor(selectedText ? `\n1. ${selectedText.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n')}` : '\n1. Item 1\n2. Item 2')
        break
      case 'quote':
        insertAtCursor(selectedText ? `> ${selectedText}` : '> Kutipan')
        break
      case 'code':
        insertAtCursor(selectedText ? `\`\`\`\n${selectedText}\n\`\`\`` : '```\nkode\n```')
        break
    }
  }

  const insertLink = () => {
    const markdown = linkText ? `[${linkText}](${linkUrl})` : `[${linkUrl}](${linkUrl})`
    insertAtCursor(markdown)
    setLinkDialogOpen(false)
    setLinkUrl('')
    setLinkText('')
  }

  const insertImage = () => {
    const markdown = `![${imageAlt || 'gambar'}](${imageUrl})`
    insertAtCursor(markdown)
    setImageDialogOpen(false)
    setImageUrl('')
    setImageAlt('')
  }

  const insertVideo = () => {
    // Convert YouTube URL to embed
    let embedUrl = videoUrl
    const ytMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
    if (ytMatch) {
      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`
    }
    const markdown = `[Video](${embedUrl})\n\n<iframe width="100%" height="400" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>`
    insertAtCursor(markdown)
    setVideoDialogOpen(false)
    setVideoUrl('')
  }

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) return
    setSaving(true)
    try {
      await onSave({
        title,
        slug,
        content,
        excerpt: excerpt || undefined,
        coverImage: coverImage || undefined,
        isHighlight,
        highlightType: isHighlight ? (highlightType || undefined) : undefined,
        category: category || undefined,
        published,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Fields */}
      <LiquidGlass variant="strong" className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-forest-300 text-sm">Judul</Label>
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Judul artikel..."
              className="bg-white/5 border-white/10 text-forest-200 placeholder:text-forest-500/40 focus:border-forest-500/50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-forest-300 text-sm">Slug</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="slug-artikel"
              className="bg-white/5 border-white/10 text-forest-200 placeholder:text-forest-500/40 focus:border-forest-500/50 font-mono text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-forest-300 text-sm">Ringkasan (Excerpt)</Label>
          <Input
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Deskripsi singkat untuk preview..."
            className="bg-white/5 border-white/10 text-forest-200 placeholder:text-forest-500/40 focus:border-forest-500/50"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-forest-300 text-sm">Cover Image URL</Label>
            <Input
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="bg-white/5 border-white/10 text-forest-200 placeholder:text-forest-500/40 focus:border-forest-500/50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-forest-300 text-sm">Kategori</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-white/5 border-white/10 text-forest-200">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent className="bg-forest-900 border-white/10">
                <SelectItem value="pendaftaran">Pendaftaran</SelectItem>
                <SelectItem value="informasi">Informasi</SelectItem>
                <SelectItem value="juklak">Juklak</SelectItem>
                <SelectItem value="umum">Umum</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3">
            <Switch
              checked={isHighlight}
              onCheckedChange={setIsHighlight}
            />
            <Label className="text-forest-300 text-sm">Highlight di Beranda</Label>
          </div>
          {isHighlight && (
            <div className="flex items-center gap-3">
              <Label className="text-forest-300 text-sm">Tipe:</Label>
              <Select value={highlightType} onValueChange={setHighlightType}>
                <SelectTrigger className="bg-white/5 border-white/10 text-forest-200 w-40">
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent className="bg-forest-900 border-white/10">
                  <SelectItem value="headline">Headline</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Switch
              checked={published}
              onCheckedChange={setPublished}
            />
            <Label className="text-forest-300 text-sm">Publish</Label>
          </div>
        </div>
      </LiquidGlass>

      {/* Editor */}
      <LiquidGlass variant="strong" className="overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-3 border-b border-white/10">
          {toolbarButtons.map((btn) => (
            <button
              key={btn.action}
              onClick={() => handleToolbarAction(btn.action)}
              title={btn.label}
              className="p-2 rounded-lg text-forest-400/70 hover:text-forest-300 hover:bg-white/10 transition-colors duration-200"
            >
              <btn.icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Split Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          {/* Markdown Input */}
          <div className="blog-editor">
            <div className="p-3 border-b border-white/5 text-xs text-forest-500/40 uppercase tracking-wider font-medium">
              Markdown
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis konten markdown di sini..."
              className="w-full h-[500px] p-4 text-sm leading-relaxed resize-none"
            />
          </div>

          {/* Preview */}
          <div>
            <div className="p-3 border-b border-white/5 text-xs text-forest-500/40 uppercase tracking-wider font-medium">
              Preview
            </div>
            <div className="h-[500px] overflow-y-auto p-4">
              <div className="markdown-content">
                <ReactMarkdown>{content || '*Mulai menulis...*'}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </LiquidGlass>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="ghost"
          onClick={onCancel}
          className="text-forest-400 hover:text-forest-300 hover:bg-white/5"
        >
          Batal
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving || !title.trim() || !slug.trim()}
          className="bg-gradient-to-r from-forest-600 to-forest-500 text-forest-900 hover:from-forest-500 hover:to-forest-400 font-semibold"
        >
          {saving ? 'Menyimpan...' : blog ? 'Update' : 'Simpan'}
        </Button>
      </div>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="bg-forest-900 border-white/10 text-forest-200">
          <DialogHeader>
            <DialogTitle className="text-forest-200">Sisipkan Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-forest-300">Teks Link</Label>
              <Input
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Teks yang ditampilkan"
                className="bg-white/5 border-white/10 text-forest-200 placeholder:text-forest-500/40"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-forest-300">URL</Label>
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className="bg-white/5 border-white/10 text-forest-200 placeholder:text-forest-500/40"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={insertLink} disabled={!linkUrl} className="bg-forest-600 text-forest-900 hover:bg-forest-500">
              Sisipkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent className="bg-forest-900 border-white/10 text-forest-200">
          <DialogHeader>
            <DialogTitle className="text-forest-200">Sisipkan Gambar</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-forest-300">Alt Text</Label>
              <Input
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Deskripsi gambar"
                className="bg-white/5 border-white/10 text-forest-200 placeholder:text-forest-500/40"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-forest-300">Image URL</Label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="bg-white/5 border-white/10 text-forest-200 placeholder:text-forest-500/40"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={insertImage} disabled={!imageUrl} className="bg-forest-600 text-forest-900 hover:bg-forest-500">
              Sisipkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={videoDialogOpen} onOpenChange={setVideoDialogOpen}>
        <DialogContent className="bg-forest-900 border-white/10 text-forest-200">
          <DialogHeader>
            <DialogTitle className="text-forest-200">Sisipkan Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-forest-300">Video URL (YouTube atau embed URL)</Label>
              <Input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="bg-white/5 border-white/10 text-forest-200 placeholder:text-forest-500/40"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={insertVideo} disabled={!videoUrl} className="bg-forest-600 text-forest-900 hover:bg-forest-500">
              Sisipkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
