import { NextResponse } from 'next/server'
import { createClient } from '@libsql/client'

const CREATE_BLOG_TABLE = `
  CREATE TABLE IF NOT EXISTS Blog (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)) || '-' || hex(randomblob(4)) || '-' || hex(randomblob(4)) || '-' || hex(randomblob(4)) || '-' || hex(randomblob(12)))),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    coverImage TEXT,
    isHighlight INTEGER NOT NULL DEFAULT 0,
    highlightType TEXT,
    category TEXT,
    published INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  )
`

const CREATE_ADMIN_SESSION_TABLE = `
  CREATE TABLE IF NOT EXISTS AdminSession (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)) || '-' || hex(randomblob(4)) || '-' || hex(randomblob(4)) || '-' || hex(randomblob(4)) || '-' || hex(randomblob(12)))),
    token TEXT NOT NULL UNIQUE,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    expiresAt TEXT NOT NULL
  )
`

const SEED_BLOGS = [
  {
    id: 'clxpendaftaran001',
    title: 'Pendaftaran FTRN #5 Dibuka!!',
    slug: 'pendaftaran-ftrn-5-dibuka',
    content: `# Pendaftaran FTRN #5 Dibuka!!

🎉 **Festival Tari Tradisional Nasional ke-5** telah resmi dibuka!

## Tentang FTRN #5

FTRN (Festival Tari Tradisional Nasional) adalah ajang tahunan yang diselenggarakan oleh Institut Seni Indonesia (ISI) Yogyakarta untuk melestarikan dan mengembangkan seni tari tradisional Indonesia.

## Cara Mendaftar

1. **Online**: Kunjungi halaman pendaftaran resmi
2. **Email**: Kirim formulir pendaftaran ke ftrn@students.isi.ac.id
3. **WhatsApp**: Hubungi Dinda di +62 882-1244-7588

## Persyaratan

- Peserta merupakan mahasiswa aktif atau komunitas tari
- Mengisi formulir pendaftaran dengan lengkap
- Menyerahkan dokumen yang diperlukan

## Timeline

- **Pendaftaran dibuka**: Sekarang!
- **Batas pendaftaran**: Segera diumumkan
- **Technical meeting**: Segera diumumkan
- **Pelaksanaan FTRN #5**: Segera diumumkan

> Jangan lewatkan kesempatan untuk berpartisipasi dalam festival tari tradisional terbesar di ISI Yogyakarta!

Hubungi kami untuk informasi lebih lanjut. Mari bersama merayakan kekayaan budaya tari Nusantara! 🌿`,
    excerpt: 'Festival Tari Tradisional Nasional ke-5 telah resmi dibuka! Segera daftarkan diri Anda dan komunitas tari Anda.',
    isHighlight: 1,
    highlightType: 'headline',
    category: 'pendaftaran',
    published: 1,
  },
  {
    id: 'clxinformasi002',
    title: 'Informasi Seputar FTRN #5',
    slug: 'informasi-seputar-ftrn-5',
    content: `# Informasi Seputar FTRN #5

Berikut adalah informasi penting yang perlu Anda ketahui tentang Festival Tari Tradisional Nasional ke-5.

## Apa itu FTRN?

FTRN adalah singkatan dari **Festival Tari Tradisional Nasional**, sebuah ajang prestisius yang mempertemukan para penari dan koreografer dari berbagai daerah di Indonesia.

## Tema FTRN #5

Tema FTRN #5 mengangkat nilai-nilai **kearifan lokal** dan **keberlanjutan budaya** dalam konteks modern. Melalui festival ini, kami berharap tari tradisional Indonesia tetap hidup dan berkembang di tengah arus globalisasi.

## Kategori Pertandingan

### Tari Tradisional Murni
Pertunjukan tari yang mempertahankan keaslian bentuk dan gerakan tradisional dari daerah asalnya.

### Tari Kreasi Baru
Karya tari baru yang mengambil inspirasi dari gerak dan nilai tradisional dengan sentuhan kontemporer.

## Lokasi

Institut Seni Indonesia (ISI) Yogyakarta
Jl. Parangtritis Km. 6.5, Yogyakarta

## Kontak

Untuk informasi lebih lanjut, silakan hubungi:
- Email: ftrn@students.isi.ac.id
- Instagram: @ftrn.isijogja
- WhatsApp: +62 882-1244-7588 (Dinda)

> FTRN #5 mengajak kita semua untuk menjaga dan melestarikan warisan budaya tari Nusantara. 🌿`,
    excerpt: 'Informasi lengkap seputar Festival Tari Tradisional Nasional ke-5: tema, kategori, lokasi, dan cara menghubungi panitia.',
    isHighlight: 1,
    highlightType: 'featured',
    category: 'informasi',
    published: 1,
  },
  {
    id: 'clxjuklak003',
    title: 'Juklak FTRN #5',
    slug: 'juklak-ftrn-5',
    content: `# Juklak FTRN #5 (Petunjuk Pelaksanaan)

Berikut adalah petunjuk pelaksanaan untuk peserta Festival Tari Tradisional Nasional ke-5.

## Ketentuan Umum

1. Peserta merupakan perorangan atau kelompok dari institusi pendidikan atau komunitas tari
2. Setiap peserta wajib mendaftar sesuai dengan prosedur yang telah ditentukan
3. Peserta wajib mematuhi seluruh peraturan yang berlaku selama pelaksanaan festival

## Kategori dan Syarat

### Tari Tradisional Murni

- **Durasi**: 5-15 menit
- **Peserta**: Minimum 3 orang
- **Musik**: Menggunakan iringan musik tradisional (live atau rekaman)
- **Kostum**: Menggunakan kostum tradisional sesuai daerah asal tari

### Tari Kreasi Baru

- **Durasi**: 5-12 menit
- **Peserta**: Minimum 3 orang
- **Musik**: Bebas (tradisional, modern, atau kombinasi)
- **Kostum**: Bebas dengan tetap menghargai nilai estetika dan budaya

## Penilaian

Penilaian dilakukan oleh dewan juri yang kompeten di bidang seni tari, meliputi aspek:

| Aspek | Bobot |
|-------|-------|
| Teknik gerak | 30% |
| Iringan musik | 20% |
| Kostum dan tata rias | 20% |
| Koreografi | 20% |
| Penampilan keseluruhan | 10% |

## Timeline Penting

- **Pendaftaran**: Dibuka sekarang
- **Batas pendaftaran**: Segera diumumkan
- **Technical meeting**: Segera diumumkan
- **Gladi bersih**: Segera diumumkan
- **Pelaksanaan**: Segera diumumkan

## Hal-hal yang Perlu Diperhatikan

> Peserta diharapkan membawa perlengkapan yang diperlukan sesuai dengan ketentuan di atas. Panitia tidak bertanggung jawab atas kehilangan barang pribadi.

Untuk pertanyaan lebih lanjut, silakan hubungi panitia melalui kontak yang tersedia.

*Petunjuk pelaksanaan ini dapat berubah sewaktu-waktu. Pantau terus informasi terbaru dari FTRN #5.* 🌿`,
    excerpt: 'Petunjuk pelaksanaan lengkap untuk peserta FTRN #5: ketentuan umum, kategori, syarat, penilaian, dan timeline penting.',
    isHighlight: 1,
    highlightType: 'featured',
    category: 'juklak',
    published: 1,
  },
]

async function runSetup() {
  const libsql = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  })

  // Create tables
  await libsql.execute(CREATE_BLOG_TABLE)
  await libsql.execute(CREATE_ADMIN_SESSION_TABLE)

  // Check if data already exists
  const existing = await libsql.execute('SELECT id FROM Blog LIMIT 1')
  if (existing.rows.length > 0) {
    const count = (await libsql.execute('SELECT COUNT(*) as count FROM Blog')).rows[0].count
    return { message: 'Tables exist and data already seeded', blogCount: count, isNew: false }
  }

  // Seed data
  const now = new Date().toISOString()

  for (const blog of SEED_BLOGS) {
    await libsql.execute({
      sql: `INSERT INTO Blog (id, title, slug, content, excerpt, isHighlight, highlightType, category, published, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        blog.id,
        blog.title,
        blog.slug,
        blog.content,
        blog.excerpt,
        blog.isHighlight,
        blog.highlightType,
        blog.category,
        blog.published,
        now,
        now,
      ],
    })
  }

  const count = (await libsql.execute('SELECT COUNT(*) as count FROM Blog')).rows[0].count
  return { message: 'Setup complete! Tables created and data seeded.', blogCount: count, isNew: true }
}

export async function POST() {
  try {
    const result = await runSetup()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Setup failed:', error)
    return NextResponse.json({
      error: 'Setup failed',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const result = await runSetup()
    return NextResponse.json(result)
  } catch (error) {
    console.error('Setup failed:', error)
    return NextResponse.json({
      error: 'Setup failed',
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 })
  }
}
