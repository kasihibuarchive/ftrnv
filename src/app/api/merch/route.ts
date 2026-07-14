import { NextRequest, NextResponse } from 'next/server'
import { getTurso, rowToMerch } from '@/lib/turso'

export async function GET(request: NextRequest) {
  try {
    const turso = getTurso()
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all')
    const authHeader = request.headers.get('Authorization')

    let sql = 'SELECT * FROM Merch'
    const conditions: string[] = []
    const args: unknown[] = []

    // If not admin requesting all, only show published
    if (all !== 'true' || !authHeader) {
      conditions.push('published = 1')
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ')
    }

    sql += ' ORDER BY createdAt DESC'

    const result = await turso.execute({ sql, args })
    const merch = result.rows.map(row => rowToMerch(row as Record<string, unknown>))

    return NextResponse.json(merch)
  } catch (error) {
    console.error('Error fetching merch:', error)
    return NextResponse.json({ error: 'Failed to fetch merch' }, { status: 500 })
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
    const { name, slug, description, price, imageUrl, category, is3D, modelUrl, modelType, published } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    // Check for duplicate slug
    const existing = await turso.execute({
      sql: 'SELECT id FROM Merch WHERE slug = ?',
      args: [slug],
    })
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'A merch item with this slug already exists' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const is3DVal = is3D ? 1 : 0
    const publishedVal = published ? 1 : 0

    const result = await turso.execute({
      sql: `INSERT INTO Merch (name, slug, description, price, imageUrl, category, is3D, modelUrl, modelType, published, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        name,
        slug,
        description || null,
        price || 0,
        imageUrl || null,
        category || 'custom',
        is3DVal,
        modelUrl || null,
        modelType || 'embed',
        publishedVal,
        now,
        now,
      ],
    })

    // Get the created merch
    const newMerch = await turso.execute({
      sql: 'SELECT * FROM Merch WHERE slug = ?',
      args: [slug],
    })

    if (newMerch.rows.length > 0) {
      return NextResponse.json(rowToMerch(newMerch.rows[0] as Record<string, unknown>), { status: 201 })
    }

    return NextResponse.json({ id: result.rowsAffected, message: 'Merch created' }, { status: 201 })
  } catch (error) {
    console.error('Error creating merch:', error)
    return NextResponse.json({ error: 'Failed to create merch' }, { status: 500 })
  }
}
