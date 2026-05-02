'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { Plus, Pencil, Trash2, ArrowLeft, LogOut, FileText } from 'lucide-react'
import BlogEditor from './BlogEditor'
import { toast } from 'sonner'

interface Blog {
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
  createdAt: string
  updatedAt: string
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
      const res = await fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${t}` },
      })
      if (res.ok) {
        setToken(t)
        setIsAuthenticated(true)
        fetchAllBlogs(t)
      } else {
        localStorage.removeItem('ftrn_admin_token')
      }
    } catch {
      localStorage.removeItem('ftrn_admin_token')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return
    setLoginLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        const data = await res.json()
        setToken(data.token)
        setIsAuthenticated(true)
        localStorage.setItem('ftrn_admin_token', data.token)
        fetchAllBlogs(data.token)
        toast.success('Login berhasil!')
      } else {
        toast.error('Password salah!')
      }
    } catch {
      toast.error('Gagal login')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setToken(null)
    localStorage.removeItem('ftrn_admin_token')
    setBlogs([])
    setEditingBlog(null)
    setIsCreating(false)
    onBack()
  }

  const fetchAllBlogs = async (t?: string) => {
    const authToken = t || token
    if (!authToken) return
    setBlogsLoading(true)
    try {
      const res = await fetch('/api/blogs?all=true', {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (res.ok) setBlogs(await res.json())
    } catch {
      // silent
    } finally {
      setBlogsLoading(false)
    }
  }

  const handleCreateBlog = useCallback(async (data: {
    title: string; slug: string; content: string; excerpt?: string
    coverImage?: string; isHighlight: boolean; highlightType?: string
    category?: string; published: boolean
  }) => {
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        toast.success('Blog berhasil dibuat!')
        setIsCreating(false)
        fetchAllBlogs()
      } else {
        const err = await res.json()
        toast.error(err.error || 'Gagal membuat blog')
      }
    } catch {
      toast.error('Gagal membuat blog')
    }
  }, [token])

  const handleUpdateBlog = useCallback(async (data: {
    title: string; slug: string; content: string; excerpt?: string
    coverImage?: string; isHighlight: boolean; highlightType?: string
    category?: string; published: boolean
  }) => {
    if (!editingBlog) return
    try {
      const res = await fetch(`/api/blogs/${editingBlog.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        toast.success('Blog berhasil diupdate!')
        setEditingBlog(null)
        fetchAllBlogs()
      } else {
        const err = await res.json()
        toast.error(err.error || 'Gagal mengupdate blog')
      }
    } catch {
      toast.error('Gagal mengupdate blog')
    }
  }, [editingBlog, token])

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm('Hapus blog ini?')) return
    try {
      const res = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        toast.success('Blog berhasil dihapus!')
        fetchAllBlogs()
      } else {
        toast.error('Gagal menghapus blog')
      }
    } catch {
      toast.error('Gagal menghapus blog')
    }
  }

  // Login Gate
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="w-full max-w-xs">
          <div className="glass-card p-6">
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-accent-green-dim mx-auto mb-3 flex items-center justify-center">
                <span className="text-accent-green font-bold">A</span>
              </div>
              <h2 className="text-base font-semibold text-white">Admin Panel</h2>
              <p className="text-xs text-ios-secondary mt-1">Masukkan password</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white/[0.07] border-0 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-ios-tertiary outline-none focus:ring-1 focus:ring-accent-green/50"
              />
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-accent-green text-black font-semibold text-sm py-2.5 rounded-xl active:opacity-80 transition-opacity disabled:opacity-50"
              >
                {loginLoading ? 'Memverifikasi...' : 'Masuk'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Editor View
  if (isCreating || editingBlog) {
    return (
      <div className="pb-4">
        <div className="flex items-center gap-2 px-4 py-3">
          <button
            onClick={() => { setIsCreating(false); setEditingBlog(null) }}
            className="flex items-center gap-1 text-accent-green text-sm active:opacity-60"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
          <span className="text-sm font-medium text-white">
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

  // Admin Dashboard
  return (
    <div>
      {/* Action bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent-green" />
          <span className="text-sm font-medium text-white">Blog Management</span>
          <span className="text-xs text-ios-tertiary">({blogs.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1 bg-accent-green text-black text-xs font-semibold px-3 py-1.5 rounded-lg active:opacity-80"
          >
            <Plus className="w-3.5 h-3.5" />
            Baru
          </button>
          <button
            onClick={handleLogout}
            className="p-1.5 text-ios-tertiary active:text-white"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Blog list - iOS settings style */}
      {blogsLoading ? (
        <div className="divide-y divide-ios-separator">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 animate-pulse">
              <div className="h-4 bg-white/5 rounded w-2/3 mb-2" />
              <div className="h-3 bg-white/5 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-ios-secondary text-sm">Belum ada blog</p>
        </div>
      ) : (
        <div className="divide-y divide-ios-separator">
          {blogs.map((blog) => (
            <div key={blog.id} className="flex items-center px-4 py-3 gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium line-clamp-1">{blog.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {blog.category && (
                    <span className="text-[10px] text-accent-green capitalize">{blog.category}</span>
                  )}
                  <span className={`text-[10px] ${blog.published ? 'text-accent-green' : 'text-yellow-500'}`}>
                    {blog.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setEditingBlog(blog)}
                  className="p-2 active:bg-white/10 rounded-lg"
                >
                  <Pencil className="w-3.5 h-3.5 text-ios-secondary" />
                </button>
                <button
                  onClick={() => handleDeleteBlog(blog.id)}
                  className="p-2 active:bg-white/10 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400/70" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
