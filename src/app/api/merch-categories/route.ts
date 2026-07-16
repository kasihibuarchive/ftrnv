import { NextRequest, NextResponse } from 'next/server'
import { getTurso } from '@/lib/turso'

// GET /api/merch-categories — list all categories
export async function GET() {
  try {
    const turso = getTurso()
    const result = await turso.execute('SELECT * FROM MerchCategory ORDER BY "order" ASC, createdAt ASC')
    const categories = result.rows.map(row => ({
      id: row.id as string,
      slug: row.slug as string,
      label: row.label as string,
      order: row.order as number,
      createdAt: row.createdAt as string,
    }))
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching merch categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

// POST /api/merch-categories — create a new category (admin only)
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
    const { slug, label, order } = body

    if (!slug || !label) {
      return NextResponse.json({ error: 'slug and label are required' }, { status: 400 })
    }

    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    await turso.execute({
      sql: 'INSERT INTO MerchCategory (id, slug, label, "order", createdAt) VALUES (?, ?, ?, ?, ?)',
      args: [id, slug, label, order || 0, now],
    })

    return NextResponse.json({ id, slug, label, order: order || 0, createdAt: now }, { status: 201 })
  } catch (error) {
    console.error('Error creating merch category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
