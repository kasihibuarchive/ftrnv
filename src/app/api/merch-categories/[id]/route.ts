import { NextRequest, NextResponse } from 'next/server'
import { getTurso } from '@/lib/turso'

// DELETE /api/merch-categories/[id] — delete a category (admin only)
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
      sql: 'DELETE FROM MerchCategory WHERE id = ?',
      args: [id],
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting merch category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
