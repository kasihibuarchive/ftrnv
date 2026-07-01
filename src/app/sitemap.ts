import { getTurso } from '@/lib/turso'
import type { MetadataRoute } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ftrn.space-z.ai'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ]

  // Dynamic blog pages
  let blogPages: MetadataRoute.Sitemap = []
  try {
    const turso = getTurso()
    const result = await turso.execute({
      sql: 'SELECT slug, updatedAt FROM Blog WHERE published = 1 ORDER BY createdAt DESC',
      args: [],
    })
    blogPages = result.rows.map((row) => ({
      url: `${siteUrl}/blog/${row.slug as string}`,
      lastModified: new Date(row.updatedAt as string),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // If DB fails, just return static pages
  }

  return [...staticPages, ...blogPages]
}
