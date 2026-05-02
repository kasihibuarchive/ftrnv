import { NextRequest, NextResponse } from 'next/server'
import { getTurso } from '@/lib/turso'

const ADMIN_PASSWORD = 'ftrn5admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Create a session token
    const token = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 hour expiry

    const turso = getTurso()
    await turso.execute({
      sql: 'INSERT INTO AdminSession (token, expiresAt) VALUES (?, ?)',
      args: [token, expiresAt.toISOString()],
    })

    return NextResponse.json({ token, expiresAt })
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
