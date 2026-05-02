import { NextRequest, NextResponse } from 'next/server'
import { getTurso, rowToBlog } from '@/lib/turso'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const turso = getTurso()

    const result = await turso.execute({
      sql: 'SELECT * FROM Blog WHERE id = ?',
      args: [id],
    })

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    return NextResponse.json(rowToBlog(result.rows[0] as Record<string, unknown>))
  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const body = await request.json()
    const { title, slug, content, excerpt, coverImage, isHighlight, highlightType, category, published } = body

    // Check for duplicate slug (excluding current blog)
    if (slug) {
      const existing = await turso.execute({
        sql: 'SELECT id FROM Blog WHERE slug = ? AND id != ?',
        args: [slug, id],
      })
      if (existing.rows.length > 0) {
        return NextResponse.json({ error: 'A blog with this slug already exists' }, { status: 400 })
      }
    }

    const now = new Date().toISOString()
    const isHighlightVal = isHighlight ? 1 : 0
    const publishedVal = published ? 1 : 0

    await turso.execute({
      sql: `UPDATE Blog SET title = ?, slug = ?, content = ?, excerpt = ?, coverImage = ?, isHighlight = ?, highlightType = ?, category = ?, published = ?, updatedAt = ? WHERE id = ?`,
      args: [
        title,
        slug,
        content,
        excerpt ?? null,
        coverImage ?? null,
        isHighlightVal,
        highlightType ?? null,
        category ?? null,
        publishedVal,
        now,
        id,
      ],
    })

    const updated = await turso.execute({
      sql: 'SELECT * FROM Blog WHERE id = ?',
      args: [id],
    })

    if (updated.rows.length > 0) {
      return NextResponse.json(rowToBlog(updated.rows[0] as Record<string, unknown>))
    }

    return NextResponse.json({ error: 'Blog not found after update' }, { status: 404 })
  } catch (error) {
    console.error('Error updating blog:', error)
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    await turso.execute({
      sql: 'DELETE FROM Blog WHERE id = ?',
      args: [id],
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 })
  }
}
