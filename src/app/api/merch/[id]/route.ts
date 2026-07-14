import { NextRequest, NextResponse } from 'next/server'
import { getTurso, rowToMerch } from '@/lib/turso'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const turso = getTurso()

    const result = await turso.execute({
      sql: 'SELECT * FROM Merch WHERE id = ?',
      args: [id],
    })

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Merch not found' }, { status: 404 })
    }

    const merch = rowToMerch(result.rows[0] as Record<string, unknown>)

    // If the merch is not published, require admin auth
    if (!merch.published) {
      const authHeader = request.headers.get('Authorization')
      if (!authHeader) {
        return NextResponse.json({ error: 'Merch not found' }, { status: 404 })
      }

      const token = authHeader.replace('Bearer ', '')
      const sessionResult = await turso.execute({
        sql: 'SELECT * FROM AdminSession WHERE token = ?',
        args: [token],
      })
      if (sessionResult.rows.length === 0) {
        return NextResponse.json({ error: 'Merch not found' }, { status: 404 })
      }
      const session = sessionResult.rows[0] as Record<string, unknown>
      if (new Date(session.expiresAt as string) < new Date()) {
        return NextResponse.json({ error: 'Merch not found' }, { status: 404 })
      }
    }

    return NextResponse.json(merch)
  } catch (error) {
    console.error('Error fetching merch:', error)
    return NextResponse.json({ error: 'Failed to fetch merch' }, { status: 500 })
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
    const { name, slug, description, price, imageUrl, category, is3D, modelUrl, published } = body

    // Check for duplicate slug (excluding current merch)
    if (slug) {
      const existing = await turso.execute({
        sql: 'SELECT id FROM Merch WHERE slug = ? AND id != ?',
        args: [slug, id],
      })
      if (existing.rows.length > 0) {
        return NextResponse.json({ error: 'A merch item with this slug already exists' }, { status: 400 })
      }
    }

    const now = new Date().toISOString()
    const is3DVal = is3D ? 1 : 0
    const publishedVal = published ? 1 : 0

    await turso.execute({
      sql: `UPDATE Merch SET name = ?, slug = ?, description = ?, price = ?, imageUrl = ?, category = ?, is3D = ?, modelUrl = ?, published = ?, updatedAt = ? WHERE id = ?`,
      args: [
        name,
        slug,
        description ?? null,
        price ?? 0,
        imageUrl ?? null,
        category ?? 'custom',
        is3DVal,
        modelUrl ?? null,
        publishedVal,
        now,
        id,
      ],
    })

    const updated = await turso.execute({
      sql: 'SELECT * FROM Merch WHERE id = ?',
      args: [id],
    })

    if (updated.rows.length > 0) {
      return NextResponse.json(rowToMerch(updated.rows[0] as Record<string, unknown>))
    }

    return NextResponse.json({ error: 'Merch not found after update' }, { status: 404 })
  } catch (error) {
    console.error('Error updating merch:', error)
    return NextResponse.json({ error: 'Failed to update merch' }, { status: 500 })
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
      sql: 'DELETE FROM Merch WHERE id = ?',
      args: [id],
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting merch:', error)
    return NextResponse.json({ error: 'Failed to delete merch' }, { status: 500 })
  }
}
