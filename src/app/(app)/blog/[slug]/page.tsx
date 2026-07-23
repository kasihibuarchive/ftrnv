import type { Metadata } from 'next'
import { getTurso, rowToBlog } from '@/lib/turso'
import BlogPostClient from './BlogPostClient'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ftrnv.vercel.app'

// Always use self-hosted OG image for WhatsApp compatibility.
// External hosts (imgbox.com etc.) timeout — WhatsApp scraper can't fetch them.
const ogImageFallback = `${siteUrl}/og-image.png?v=2`

// Fetch blog by slug server-side for metadata generation
async function getBlogBySlug(slug: string) {
  try {
    const turso = getTurso()
    const result = await turso.execute({
      sql: 'SELECT * FROM Blog WHERE slug = ? AND published = 1',
      args: [slug],
    })
    if (result.rows.length === 0) return null
    return rowToBlog(result.rows[0] as Record<string, unknown>)
  } catch {
    return null
  }
}

// Generate SEO metadata per blog slug
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    return {
      title: 'Artikel Tidak Ditemukan',
      description: 'Artikel yang Anda cari tidak ditemukan di FTRN #5.',
    }
  }

  const blogUrl = `${siteUrl}/blog/${blog.slug}`
  const description = blog.excerpt || blog.content.replace(/[#*_>\[\]()]/g, '').slice(0, 160)

  return {
    title: blog.title,
    description,
    authors: [{ name: 'FTRN ISI Yogyakarta' }],
    keywords: [
      'FTRN',
      'Festival Teater Remaja Nusantara',
      blog.category || 'teater',
      blog.title,
      'ISI Yogyakarta',
      'seni pertunjukan',
    ],
    alternates: {
      canonical: blogUrl,
    },
    openGraph: {
      title: blog.title,
      description,
      url: blogUrl,
      siteName: 'FTRN #5',
      locale: 'id_ID',
      type: 'article',
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: ['FTRN ISI Yogyakarta'],
      tags: [blog.category || 'teater', 'FTRN', 'festival'],
      images: [
        {
          url: ogImageFallback,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description,
      images: [ogImageFallback],
    },
  }
}

// Generate static params for all published blogs (for build-time pre-render)
export async function generateStaticParams() {
  try {
    const turso = getTurso()
    const result = await turso.execute({
      sql: 'SELECT slug FROM Blog WHERE published = 1',
      args: [],
    })
    return result.rows.map((row) => ({
      slug: row.slug as string,
    }))
  } catch {
    return []
  }
}

// Blog post page — server component wrapping client component
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)

  if (!blog) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-6">
          <div className="icon-circle w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🌿</span>
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">Artikel Tidak Ditemukan</h1>
          <p className="text-foreground/40 text-sm font-medium mb-6">Artikel yang Anda cari tidak tersedia.</p>
          <a
            href="/beranda"
            className="cta-button px-5 py-2.5 text-xs font-semibold inline-flex items-center gap-2"
          >
            ← Kembali ke Beranda
          </a>
        </div>
      </div>
    )
  }

  // JSON-LD structured data for Google rich results
  const blogUrl = `${siteUrl}/blog/${blog.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt || blog.content.replace(/[#*_>\[\]()]/g, '').slice(0, 160),
    image: ogImageFallback,
    url: blogUrl,
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt,
    author: {
      '@type': 'Organization',
      name: 'FTRN ISI Yogyakarta',
    },
    publisher: {
      '@type': 'Organization',
      name: 'FTRN #5',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/og-image.png?v=2`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': blogUrl,
    },
    articleSection: blog.category || 'Teater',
    inLanguage: 'id',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogPostClient blog={blog} />
    </>
  )
}
