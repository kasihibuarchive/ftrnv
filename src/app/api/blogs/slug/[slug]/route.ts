import { NextRequest, NextResponse } from 'next/server'
import { getTurso, rowToBlog } from '@/lib/turso'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const turso = getTurso()

    const result = await turso.execute({
      sql: 'SELECT * FROM Blog WHERE slug = ?',
      args: [slug],
    })

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    const blog = rowToBlog(result.rows[0] as Record<string, unknown>)

    // If the blog is not published, require admin auth
    if (!blog.published) {
      const authHeader = request.headers.get('Authorization')
      if (!authHeader) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
      }

      const token = authHeader.replace('Bearer ', '')
      const sessionResult = await turso.execute({
        sql: 'SELECT * FROM AdminSession WHERE token = ?',
        args: [token],
      })
      if (sessionResult.rows.length === 0) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
      }
      const session = sessionResult.rows[0] as Record<string, unknown>
      if (new Date(session.expiresAt as string) < new Date()) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
      }
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error('Error fetching blog by slug:', error)
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 })
  }
}
