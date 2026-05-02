'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Lock, Plus, Pencil, Trash2, ArrowLeft, LogOut, FileText } from 'lucide-react'
import LiquidGlass from './LiquidGlass'
import BlogEditor from './BlogEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [blogsLoading, setBlogsLoading] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  // Check for existing token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('ftrn_admin_token')
    if (savedToken) {
      verifyToken(savedToken)
    }
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
  }

  const fetchAllBlogs = async (t?: string) => {
    const authToken = t || token
    if (!authToken) return
    setBlogsLoading(true)
    try {
      const res = await fetch('/api/blogs?all=true', {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (res.ok) {
        const data = await res.json()
        setBlogs(data)
      }
    } catch {
      // silently fail
    } finally {
      setBlogsLoading(false)
    }
  }

  const handleCreateBlog = useCallback(async (data: {
    title: string
    slug: string
    content: string
    excerpt?: string
    coverImage?: string
    isHighlight: boolean
    highlightType?: string
    category?: string
    published: boolean
  }) => {
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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
    title: string
    slug: string
    content: string
    excerpt?: string
    coverImage?: string
    isHighlight: boolean
    highlightType?: string
    category?: string
    published: boolean
  }) => {
    if (!editingBlog) return
    try {
      const res = await fetch(`/api/blogs/${editingBlog.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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
    if (!confirm('Apakah Anda yakin ingin menghapus blog ini?')) return
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
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <LiquidGlass variant="glow" className="p-8">
            <div className="text-center mb-6">
              <Lock className="w-10 h-10 text-forest-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-forest-200">Admin Panel</h2>
              <p className="text-forest-400/60 text-sm mt-1">Masukkan password untuk mengakses</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="bg-white/5 border-white/10 text-forest-200 placeholder:text-forest-500/40 focus:border-forest-500/50 text-center"
              />
              <Button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-gradient-to-r from-forest-600 to-forest-500 text-forest-900 hover:from-forest-500 hover:to-forest-400 font-semibold"
              >
                {loginLoading ? 'Memverifikasi...' : 'Masuk'}
              </Button>
            </form>
          </LiquidGlass>
        </motion.div>
      </div>
    )
  }

  // Blog Editor View
  if (isCreating || editingBlog) {
    return (
      <div className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            onClick={() => { setIsCreating(false); setEditingBlog(null) }}
            className="text-forest-400 hover:text-forest-300 hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <h2 className="text-lg font-semibold text-forest-200">
            {isCreating ? 'Buat Blog Baru' : 'Edit Blog'}
          </h2>
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
    <div className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-forest-200 flex items-center gap-3">
            <FileText className="w-7 h-7 text-forest-500" />
            Blog Management
          </h1>
          <p className="text-forest-400/60 text-sm mt-1">Kelola semua blog FTRN #5</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-forest-600 to-forest-500 text-forest-900 hover:from-forest-500 hover:to-forest-400 font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Blog Baru
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-forest-400 hover:text-forest-300 hover:bg-white/5"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Blog Table */}
      <LiquidGlass variant="strong" className="overflow-hidden">
        {blogsLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-white/5 rounded animate-pulse" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-forest-500/20 mx-auto mb-4" />
            <p className="text-forest-400/60">Belum ada blog</p>
            <Button
              onClick={() => setIsCreating(true)}
              variant="ghost"
              className="mt-4 text-forest-500 hover:text-forest-400"
            >
              Buat blog pertama
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-xs font-semibold text-forest-400 uppercase tracking-wider">Judul</th>
                  <th className="text-left p-4 text-xs font-semibold text-forest-400 uppercase tracking-wider hidden sm:table-cell">Kategori</th>
                  <th className="text-left p-4 text-xs font-semibold text-forest-400 uppercase tracking-wider hidden md:table-cell">Highlight</th>
                  <th className="text-left p-4 text-xs font-semibold text-forest-400 uppercase tracking-wider">Status</th>
                  <th className="text-right p-4 text-xs font-semibold text-forest-400 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="text-forest-200 font-medium text-sm line-clamp-1">{blog.title}</p>
                        <p className="text-forest-500/40 text-xs font-mono mt-0.5">{blog.slug}</p>
                      </div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-forest-300/70 capitalize">
                        {blog.category || '-'}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      {blog.isHighlight ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-forest-500/20 text-forest-400 capitalize">
                          {blog.highlightType || 'Ya'}
                        </span>
                      ) : (
                        <span className="text-xs text-forest-500/30">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        blog.published
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingBlog(blog)}
                          className="text-forest-400 hover:text-forest-300 hover:bg-white/10 h-8 w-8 p-0"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="text-red-400/70 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </LiquidGlass>
    </div>
  )
}
