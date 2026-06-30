import { Metadata } from 'next'
import { getTurso, rowToBlog } from '@/lib/turso'
import BlogPostPage from './BlogPostPage'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Fetch blog server-side for metadata
async function getBlog(slug: string) {
  const turso = getTurso()
  const result = await turso.execute({
    sql: 'SELECT * FROM Blog WHERE slug = ? AND published = 1',
    args: [slug],
  })
  if (result.rows.length === 0) return null
  return rowToBlog(result.rows[0] as Record<string, unknown>)
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    return {
      title: 'Artikel Tidak Ditemukan — FTRN #5',
      description: 'Halaman yang Anda cari tidak ditemukan.',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ftrn.space-z.ai'
  const blogUrl = `${siteUrl}/blog/${slug}`
  const coverUrl = blog.coverImage
    ? (blog.coverImage.startsWith('/') ? `${siteUrl}${blog.coverImage}` : blog.coverImage)
    : `${siteUrl}/ftrn-logo.png`

  return {
    title: `${blog.title} — FTRN #5`,
    description: blog.excerpt || blog.title,
    authors: [{ name: 'FTRN ISI Yogyakarta' }],
    openGraph: {
      title: blog.title,
      description: blog.excerpt || blog.title,
      url: blogUrl,
      type: 'article',
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
      images: [
        {
          url: coverUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
      siteName: 'FTRN #5',
      locale: 'id_ID',
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt || blog.title,
      images: [coverUrl],
    },
    alternates: {
      canonical: blogUrl,
    },
  }
}

// Generate static params for all published blogs (ISR)
export async function generateStaticParams() {
  try {
    const turso = getTurso()
    const result = await turso.execute('SELECT slug FROM Blog WHERE published = 1')
    return result.rows.map((row) => ({ slug: row.slug as string }))
  } catch {
    return []
  }
}

// Server component — renders the client component with blog data
export default async function BlogSlugPage({ params }: PageProps) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    return (
      <div className="min-h-screen nature-bg flex items-center justify-center">
        <div className="text-center py-20">
          <div className="icon-circle w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">🔍</span>
          </div>
          <p className="text-kinari/30 text-sm font-semibold">Artikel tidak ditemukan</p>
          <a href="/" className="cta-button px-4 py-2 text-xs font-semibold mt-4 inline-flex items-center gap-1.5">
            ← Kembali
          </a>
        </div>
      </div>
    )
  }

  return <BlogPostPage blog={blog} />
}
