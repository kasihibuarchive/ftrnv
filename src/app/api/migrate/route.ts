import { NextRequest, NextResponse } from 'next/server'
import { getTurso } from '@/lib/turso'

// Migrations: create MerchCategory table + seed defaults
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

    const messages: string[] = []

    // Migration 1: Add modelType column (idempotent)
    try {
      await turso.execute("ALTER TABLE Merch ADD COLUMN modelType TEXT DEFAULT 'embed'")
      messages.push('Column modelType added to Merch table')
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error)
      if (msg.includes('duplicate column')) {
        messages.push('Column modelType already exists')
      } else {
        throw error
      }
    }

    // Migration 2: Create MerchCategory table (idempotent)
    try {
      await turso.execute(`
        CREATE TABLE IF NOT EXISTS MerchCategory (
          id TEXT PRIMARY KEY,
          slug TEXT NOT NULL UNIQUE,
          label TEXT NOT NULL,
          "order" INTEGER DEFAULT 0,
          createdAt TEXT NOT NULL
        )
      `)
      messages.push('MerchCategory table ready')
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error)
      if (msg.includes('already exists')) {
        messages.push('MerchCategory table already exists')
      } else {
        throw error
      }
    }

    // Seed default categories if empty
    const existing = await turso.execute('SELECT COUNT(*) as count FROM MerchCategory')
    const count = Number(existing.rows[0].count)
    if (count === 0) {
      const now = new Date().toISOString()
      const defaults = [
        { slug: 'tshirt', label: 'T-Shirt', order: 1 },
        { slug: 'stiker', label: 'Stiker', order: 2 },
        { slug: 'totebag', label: 'Totebag', order: 3 },
        { slug: 'topi', label: 'Topi', order: 4 },
        { slug: 'custom', label: 'Custom', order: 5 },
      ]
      for (const cat of defaults) {
        const id = crypto.randomUUID()
        await turso.execute({
          sql: 'INSERT INTO MerchCategory (id, slug, label, "order", createdAt) VALUES (?, ?, ?, ?, ?)',
          args: [id, cat.slug, cat.label, cat.order, now],
        })
      }
      messages.push(`Seeded ${defaults.length} default categories`)
    } else {
      messages.push(`MerchCategory already has ${count} rows`)
    }

    return NextResponse.json({ success: true, messages })
  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 })
  }
}
