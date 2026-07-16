import { NextRequest, NextResponse } from 'next/server'
import { getTurso } from '@/lib/turso'

// One-time migration: add modelType column to Merch table
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

    await turso.execute('ALTER TABLE Merch ADD COLUMN modelType TEXT DEFAULT \'embed\'')
    return NextResponse.json({ success: true, message: 'Column modelType added to Merch table' })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    if (msg.includes('duplicate column')) {
      return NextResponse.json({ success: true, message: 'Column modelType already exists' })
    }
    console.error('Migration error:', error)
    return NextResponse.json({ error: 'Migration failed', details: msg }, { status: 500 })
  }
}
