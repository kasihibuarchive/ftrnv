'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, LogOut, FileText, ShoppingBag } from 'lucide-react'
import BlogEditor from './BlogEditor'
import MerchEditor from './MerchEditor'
import { toast } from 'sonner'

interface Blog {
  id: string; title: string; slug: string; content: string
  excerpt?: string; coverImage?: string; isHighlight: boolean
  highlightType?: string; category?: string; published: boolean
  createdAt: string; updatedAt: string
}

interface MerchItem {
  id: string; name: string; slug: string; description: string | null
  price: number; imageUrl: string | null; category: string
  is3D: boolean; modelUrl: string | null; modelType: string | null; published: boolean
  createdAt: string; updatedAt: string
}

type AdminSection = 'blog' | 'merch'

interface AdminPageProps {
  onBack: () => void
}

export default function AdminPage({ onBack }: AdminPageProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [activeSection, setActiveSection] = useState<AdminSection>('blog')

  // Blog state
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [blogsLoading, setBlogsLoading] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [isCreatingBlog, setIsCreatingBlog] = useState(false)

  // Merch state
  const [merch, setMerch] = useState<MerchItem[]>([])
  const [merchLoading, setMerchLoading] = useState(false)
  const [editingMerch, setEditingMerch] = useState<MerchItem | null>(null)
  const [isCreatingMerch, setIsCreatingMerch] = useState(false)

  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('ftrn_admin_token')
    if (savedToken) verifyToken(savedToken)
  }, [])

  const verifyToken = async (t: string) => {
    try {
      const res = await fetch('/api/admin/verify', { headers: { Authorization: `Bearer ${t}` } })
      if (res.ok) { setToken(t); setIsAuthenticated(true); fetchAllBlogs(t); fetchAllMerch(t) }
      else localStorage.removeItem('ftrn_admin_token')
    } catch { localStorage.removeItem('ftrn_admin_token') }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return
    setLoginLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        const data = await res.json()
        setToken(data.token); setIsAuthenticated(true)
        localStorage.setItem('ftrn_admin_token', data.token)
        fetchAllBlogs(data.token); fetchAllMerch(data.token); toast.success('Login berhasil!')
      } else { toast.error('Password salah!') }
    } catch { toast.error('Gagal login') } finally { setLoginLoading(false) }
  }

  const handleLogout = () => {
    setIsAuthenticated(false); setToken(null)
    localStorage.removeItem('ftrn_admin_token')
    setBlogs([]); setEditingBlog(null); setIsCreatingBlog(false)
    setMerch([]); setEditingMerch(null); setIsCreatingMerch(false)
    onBack()
  }

  // Blog CRUD
  const fetchAllBlogs = async (t?: string) => {
    const authToken = t || token
    if (!authToken) return
    setBlogsLoading(true)
    try {
      const res = await fetch('/api/blogs?all=true', { headers: { Authorization: `Bearer ${authToken}` } })
      if (res.ok) setBlogs(await res.json())
    } catch { /* */ } finally { setBlogsLoading(false) }
  }

  const handleCreateBlog = useCallback(async (data: {
    title: string; slug: string; content: string; excerpt?: string
    coverImage?: string; isHighlight: boolean; highlightType?: string
    category?: string; published: boolean
  }) => {
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      })
      if (res.ok) { toast.success('Blog berhasil dibuat!'); setIsCreatingBlog(false); fetchAllBlogs() }
      else { const err = await res.json(); toast.error(err.error || 'Gagal') }
    } catch { toast.error('Gagal') }
  }, [token])

  const handleUpdateBlog = useCallback(async (data: {
    title: string; slug: string; content: string; excerpt?: string
    coverImage?: string; isHighlight: boolean; highlightType?: string
    category?: string; published: boolean
  }) => {
    if (!editingBlog) return
    try {
      const res = await fetch(`/api/blogs/${editingBlog.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      })
      if (res.ok) { toast.success('Blog berhasil diupdate!'); setEditingBlog(null); fetchAllBlogs() }
      else { const err = await res.json(); toast.error(err.error || 'Gagal') }
    } catch { toast.error('Gagal') }
  }, [editingBlog, token])

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm('Hapus blog ini?')) return
    try {
      const res = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) { toast.success('Blog berhasil dihapus!'); fetchAllBlogs() }
      else toast.error('Gagal menghapus')
    } catch { toast.error('Gagal') }
  }

  // Merch CRUD
  const fetchAllMerch = async (t?: string) => {
    const authToken = t || token
    if (!authToken) return
    setMerchLoading(true)
    try {
      const res = await fetch('/api/merch?all=true', { headers: { Authorization: `Bearer ${authToken}` } })
      if (res.ok) setMerch(await res.json())
    } catch { /* */ } finally { setMerchLoading(false) }
  }

  const handleCreateMerch = useCallback(async (data: {
    name: string; slug: string; description?: string
    price: number; imageUrl?: string; category: string
    is3D: boolean; modelUrl?: string; modelType?: string; published: boolean
  }) => {
    try {
      const res = await fetch('/api/merch', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      })
      if (res.ok) { toast.success('Merch berhasil dibuat!'); setIsCreatingMerch(false); fetchAllMerch() }
      else { const err = await res.json(); toast.error(err.error || 'Gagal') }
    } catch { toast.error('Gagal') }
  }, [token])

  const handleUpdateMerch = useCallback(async (data: {
    name: string; slug: string; description?: string
    price: number; imageUrl?: string; category: string
    is3D: boolean; modelUrl?: string; modelType?: string; published: boolean
  }) => {
    if (!editingMerch) return
    try {
      const res = await fetch(`/api/merch/${editingMerch.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      })
      if (res.ok) { toast.success('Merch berhasil diupdate!'); setEditingMerch(null); fetchAllMerch() }
      else { const err = await res.json(); toast.error(err.error || 'Gagal') }
    } catch { toast.error('Gagal') }
  }, [editingMerch, token])

  const handleDeleteMerch = async (merchId: string) => {
    if (!confirm('Hapus merchandise ini?')) return
    try {
      const res = await fetch(`/api/merch/${merchId}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) { toast.success('Merch berhasil dihapus!'); fetchAllMerch() }
      else toast.error('Gagal menghapus')
    } catch { toast.error('Gagal') }
  }

  // Login
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-6">
        <div className="w-full max-w-xs">
          <div className="glass-zen-strong p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 mx-auto mb-5 flex items-center justify-center">
              <span className="text-primary text-lg font-light">A</span>
            </div>
            <h2 className="text-sm font-light text-foreground/70 tracking-wider mb-1">Panel Admin</h2>
            <p className="text-[10px] text-foreground/20 tracking-wider mb-6">Kelola FTRN #5</p>
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full glass-zen-input px-4 py-3 text-sm text-foreground/70 placeholder:text-foreground/15 outline-none tracking-wide"
              />
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-primary/15 text-primary text-sm py-3 rounded-xl tracking-wider hover:bg-primary/25 transition-colors duration-500 disabled:opacity-40"
              >
                {loginLoading ? '...' : 'Masuk'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Blog Editor
  if (isCreatingBlog || editingBlog) {
    return (
      <div className="pb-6">
        <div className="px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => { setIsCreatingBlog(false); setEditingBlog(null) }}
            className="text-primary/50 text-xs tracking-wider hover:text-primary transition-colors duration-300"
          >
            ← Kembali
          </button>
          <span className="text-xs text-foreground/35 tracking-wider">
            {isCreatingBlog ? 'Buat Baru' : 'Edit'}
          </span>
        </div>
        <BlogEditor
          blog={editingBlog}
          onSave={isCreatingBlog ? handleCreateBlog : handleUpdateBlog}
          onCancel={() => { setIsCreatingBlog(false); setEditingBlog(null) }}
        />
      </div>
    )
  }

  // Merch Editor
  if (isCreatingMerch || editingMerch) {
    return (
      <div className="pb-6">
        <div className="px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => { setIsCreatingMerch(false); setEditingMerch(null) }}
            className="text-primary/50 text-xs tracking-wider hover:text-primary transition-colors duration-300"
          >
            ← Kembali
          </button>
          <span className="text-xs text-foreground/35 tracking-wider">
            {isCreatingMerch ? 'Buat Baru' : 'Edit'}
          </span>
        </div>
        <MerchEditor
          merch={editingMerch}
          onSave={isCreatingMerch ? handleCreateMerch : handleUpdateMerch}
          onCancel={() => { setIsCreatingMerch(false); setEditingMerch(null) }}
        />
      </div>
    )
  }

  const categoryLabels: Record<string, string> = {
    tshirt: 'T-Shirt',
    stiker: 'Stiker',
    totebag: 'Totebag',
    topi: 'Topi',
    custom: 'Custom',
  }

  // Dashboard
  return (
    <div className="px-6 pt-8 pb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-light text-foreground/70 tracking-wide">Kelola Konten</h2>
          <p className="text-[10px] text-foreground/18 tracking-wider mt-0.5">
            {activeSection === 'blog' ? `${blogs.length} artikel` : `${merch.length} merchandise`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (activeSection === 'blog') setIsCreatingBlog(true)
              else setIsCreatingMerch(true)
            }}
            className="flex items-center gap-1.5 bg-primary/12 text-primary text-[11px] tracking-wider px-3.5 py-2 rounded-xl hover:bg-primary/22 transition-colors duration-500"
          >
            <Plus className="w-3.5 h-3.5" />
            Baru
          </button>
          <button onClick={handleLogout} className="p-2 text-foreground/10 hover:text-foreground/30 transition-colors duration-300">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 p-1 glass-zen-card rounded-xl mb-6">
        <button
          onClick={() => setActiveSection('blog')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[11px] font-semibold tracking-wider transition-all duration-300 ${
            activeSection === 'blog'
              ? 'bg-primary/12 text-primary'
              : 'text-foreground/25 hover:text-foreground/40'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Blog
        </button>
        <button
          onClick={() => setActiveSection('merch')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-[11px] font-semibold tracking-wider transition-all duration-300 ${
            activeSection === 'merch'
              ? 'bg-primary/12 text-primary'
              : 'text-foreground/25 hover:text-foreground/40'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Merch
        </button>
      </div>

      {/* Blog section */}
      {activeSection === 'blog' && (
        <>
          {blogsLoading ? (
            <div className="space-y-2">
              {[1,2,3].map(i => <div key={i} className="glass-zen-card p-4 animate-pulse"><div className="h-4 bg-foreground/[0.03] rounded w-2/3" /></div>)}
            </div>
          ) : blogs.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-foreground/18 text-sm">Belum ada artikel</p>
            </div>
          ) : (
            <div className="space-y-2">
              {blogs.map((blog) => (
                <div key={blog.id} className="glass-zen-card px-5 py-3.5 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/65 font-light line-clamp-1">{blog.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {blog.category && <span className="text-[9px] text-primary/30 tracking-wider">{blog.category}</span>}
                      <span className={`text-[9px] tracking-wider ${blog.published ? 'text-accent-foreground/45' : 'text-destructive/45'}`}>
                        {blog.published ? 'Terbit' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button onClick={() => setEditingBlog(blog)} className="p-2 text-foreground/10 hover:text-primary/55 transition-colors duration-300">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteBlog(blog.id)} className="p-2 text-foreground/10 hover:text-destructive/55 transition-colors duration-300">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Merch section */}
      {activeSection === 'merch' && (
        <>
          {merchLoading ? (
            <div className="space-y-2">
              {[1,2,3].map(i => <div key={i} className="glass-zen-card p-4 animate-pulse"><div className="h-4 bg-foreground/[0.03] rounded w-2/3" /></div>)}
            </div>
          ) : merch.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-foreground/18 text-sm">Belum ada merchandise</p>
            </div>
          ) : (
            <div className="space-y-2">
              {merch.map((item) => (
                <div key={item.id} className="glass-zen-card px-5 py-3.5 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/65 font-light line-clamp-1">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[9px] text-primary/30 tracking-wider">
                        {categoryLabels[item.category] || item.category}
                      </span>
                      {item.is3D && (
                        <span className="text-[9px] text-accent-foreground/35 tracking-wider">3D</span>
                      )}
                      <span className="text-[9px] text-foreground/20 tracking-wider">
                        Rp {item.price.toLocaleString('id-ID')}
                      </span>
                      <span className={`text-[9px] tracking-wider ${item.published ? 'text-accent-foreground/45' : 'text-destructive/45'}`}>
                        {item.published ? 'Terbit' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button onClick={() => setEditingMerch(item)} className="p-2 text-foreground/10 hover:text-primary/55 transition-colors duration-300">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteMerch(item.id)} className="p-2 text-foreground/10 hover:text-destructive/55 transition-colors duration-300">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
