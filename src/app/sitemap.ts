import { MetadataRoute } from 'next'
import { getTurso } from '@/lib/turso'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ftrn.space-z.ai'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  let blogPages: MetadataRoute.Sitemap = []
  try {
    const turso = getTurso()
    const result = await turso.execute('SELECT slug, updatedAt FROM Blog WHERE published = 1')
    blogPages = result.rows.map((row) => ({
      url: `${siteUrl}/blog/${row.slug}`,
      lastModified: new Date(row.updatedAt as string),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // DB not available during build
  }

  return [...staticPages, ...blogPages]
}
