import { NextRequest, NextResponse } from 'next/server'
import { getTurso } from '@/lib/turso'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const turso = getTurso()

    const result = await turso.execute({
      sql: 'SELECT * FROM AdminSession WHERE token = ?',
      args: [token],
    })

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    const session = result.rows[0] as Record<string, unknown>
    if (new Date(session.expiresAt as string) < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error('Error verifying token:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
