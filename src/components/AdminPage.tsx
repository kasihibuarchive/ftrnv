'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, LogOut, FileText } from 'lucide-react'
import BlogEditor from './BlogEditor'
import { toast } from 'sonner'

interface Blog {
  id: string; title: string; slug: string; content: string
  excerpt?: string; coverImage?: string; isHighlight: boolean
  highlightType?: string; category?: string; published: boolean
  createdAt: string; updatedAt: string
}

interface AdminPageProps {
  onBack: () => void
}

export default function AdminPage({ onBack }: AdminPageProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [blogsLoading, setBlogsLoading] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('ftrn_admin_token')
    if (savedToken) verifyToken(savedToken)
  }, [])

  const verifyToken = async (t: string) => {
    try {
      const res = await fetch('/api/admin/verify', { headers: { Authorization: `Bearer ${t}` } })
      if (res.ok) { setToken(t); setIsAuthenticated(true); fetchAllBlogs(t) }
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
        fetchAllBlogs(data.token); toast.success('Login berhasil!')
      } else { toast.error('Password salah!') }
    } catch { toast.error('Gagal login') } finally { setLoginLoading(false) }
  }

  const handleLogout = () => {
    setIsAuthenticated(false); setToken(null)
    localStorage.removeItem('ftrn_admin_token')
    setBlogs([]); setEditingBlog(null); setIsCreating(false); onBack()
  }

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
      if (res.ok) { toast.success('Blog berhasil dibuat!'); setIsCreating(false); fetchAllBlogs() }
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

  // Login
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-6">
        <div className="w-full max-w-xs">
          <div className="glass-zen-strong p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-matcha/10 mx-auto mb-5 flex items-center justify-center">
              <span className="text-matcha-light text-lg font-light">A</span>
            </div>
            <h2 className="text-sm font-light text-kinari/70 tracking-wider mb-1">Panel Admin</h2>
            <p className="text-[10px] text-kinari/20 tracking-wider mb-6">Kelola Blog FTRN #5</p>
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full glass-zen-input px-4 py-3 text-sm text-kinari/70 placeholder:text-kinari/15 outline-none tracking-wide"
              />
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-matcha/20 text-matcha-light text-sm py-3 rounded-xl tracking-wider hover:bg-matcha/30 transition-colors duration-500 disabled:opacity-40"
              >
                {loginLoading ? '...' : 'Masuk'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Editor
  if (isCreating || editingBlog) {
    return (
      <div className="pb-6">
        <div className="px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => { setIsCreating(false); setEditingBlog(null) }}
            className="text-matcha-light/40 text-xs tracking-wider hover:text-matcha-light transition-colors duration-300"
          >
            ← Kembali
          </button>
          <span className="text-xs text-kinari/30 tracking-wider">
            {isCreating ? 'Buat Baru' : 'Edit'}
          </span>
        </div>
        <BlogEditor
          blog={editingBlog}
          onSave={isCreating ? handleCreateBlog : handleUpdateBlog}
          onCancel={() => { setIsCreating(false); setEditingBlog(null) }}
        />
      </div>
    )
  }

  // Dashboard
  return (
    <div className="px-6 pt-8 pb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-light text-kinari/70 tracking-wide">Kelola Blog</h2>
          <p className="text-[10px] text-kinari/15 tracking-wider mt-0.5">{blogs.length} artikel</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 bg-matcha/15 text-matcha-light text-[11px] tracking-wider px-3.5 py-2 rounded-xl hover:bg-matcha/25 transition-colors duration-500"
          >
            <Plus className="w-3.5 h-3.5" />
            Baru
          </button>
          <button onClick={handleLogout} className="p-2 text-kinari/10 hover:text-kinari/30 transition-colors duration-300">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {blogsLoading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="glass-zen-card p-4 animate-pulse"><div className="h-4 bg-kinari/[0.03] rounded w-2/3" /></div>)}
        </div>
      ) : blogs.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-kinari/15 text-sm">Belum ada artikel</p>
        </div>
      ) : (
        <div className="space-y-2">
          {blogs.map((blog) => (
            <div key={blog.id} className="glass-zen-card px-5 py-3.5 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-kinari/60 font-light line-clamp-1">{blog.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  {blog.category && <span className="text-[9px] text-matcha/30 tracking-wider">{blog.category}</span>}
                  <span className={`text-[9px] tracking-wider ${blog.published ? 'text-matcha-light/40' : 'text-sakura/40'}`}>
                    {blog.published ? 'Terbit' : 'Draft'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                <button onClick={() => setEditingBlog(blog)} className="p-2 text-kinari/10 hover:text-matcha-light/50 transition-colors duration-300">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDeleteBlog(blog.id)} className="p-2 text-kinari/10 hover:text-sakura/50 transition-colors duration-300">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
