import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const highlight = searchParams.get('highlight')
    const all = searchParams.get('all')
    const authHeader = request.headers.get('Authorization')

    let where: Record<string, unknown> = {}

    // If not admin requesting all, only show published
    if (all !== 'true' || !authHeader) {
      where.published = true
    }

    if (highlight === 'true') {
      where.isHighlight = true
    }

    const blogs = await db.blog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(blogs)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const session = await db.adminSession.findUnique({ where: { token } })
    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    const body = await request.json()
    const { title, slug, content, excerpt, coverImage, isHighlight, highlightType, category, published } = body

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 })
    }

    // Check for duplicate slug
    const existing = await db.blog.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'A blog with this slug already exists' }, { status: 400 })
    }

    const blog = await db.blog.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        isHighlight: isHighlight || false,
        highlightType: highlightType || null,
        category: category || null,
        published: published || false,
      },
    })

    return NextResponse.json(blog, { status: 201 })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 })
  }
}
