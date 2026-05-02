import { NextRequest, NextResponse } from 'next/server'
import { getTurso, rowToBlog } from '@/lib/turso'

export async function GET(request: NextRequest) {
  try {
    const turso = getTurso()
    const { searchParams } = new URL(request.url)
    const highlight = searchParams.get('highlight')
    const all = searchParams.get('all')
    const authHeader = request.headers.get('Authorization')

    let sql = 'SELECT * FROM Blog'
    const conditions: string[] = []
    const args: unknown[] = []

    // If not admin requesting all, only show published
    if (all !== 'true' || !authHeader) {
      conditions.push('published = 1')
    }

    if (highlight === 'true') {
      conditions.push('isHighlight = 1')
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ')
    }

    sql += ' ORDER BY createdAt DESC'

    const result = await turso.execute({ sql, args })
    const blogs = result.rows.map(row => rowToBlog(row as Record<string, unknown>))

    return NextResponse.json(blogs)
  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const turso = getTurso()
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const sessionResult = await turso.execute({
      sql: 'SELECT * FROM AdminSession WHERE token = ?',
      args: [token],
    })
    if (sessionResult.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }
    const session = sessionResult.rows[0] as Record<string, unknown>
    if (new Date(session.expiresAt as string) < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    const body = await request.json()
    const { title, slug, content, excerpt, coverImage, isHighlight, highlightType, category, published } = body

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 })
    }

    // Check for duplicate slug
    const existing = await turso.execute({
      sql: 'SELECT id FROM Blog WHERE slug = ?',
      args: [slug],
    })
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'A blog with this slug already exists' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const isHighlightVal = isHighlight ? 1 : 0
    const publishedVal = published ? 1 : 0

    const result = await turso.execute({
      sql: `INSERT INTO Blog (title, slug, content, excerpt, coverImage, isHighlight, highlightType, category, published, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        title,
        slug,
        content,
        excerpt || null,
        coverImage || null,
        isHighlightVal,
        highlightType || null,
        category || null,
        publishedVal,
        now,
        now,
      ],
    })

    // Get the created blog
    const newBlog = await turso.execute({
      sql: 'SELECT * FROM Blog WHERE slug = ?',
      args: [slug],
    })

    if (newBlog.rows.length > 0) {
      return NextResponse.json(rowToBlog(newBlog.rows[0] as Record<string, unknown>), { status: 201 })
    }

    return NextResponse.json({ id: result.rowsAffected, message: 'Blog created' }, { status: 201 })
  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 })
  }
}
