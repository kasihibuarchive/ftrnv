import { NextResponse } from 'next/server'
import { getTurso } from '@/lib/turso'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { namaLengkap, namaGrup, email, whatsapp, kategori, judulPertunjukan, durasi, nomorSurat } = body

    // Validate required fields
    if (!namaLengkap || !namaGrup || !email || !whatsapp || !kategori || !judulPertunjukan || !durasi) {
      return NextResponse.json(
        { error: 'Mohon lengkapi semua field yang wajib diisi' },
        { status: 400 }
      )
    }

    // Validate kategori
    const validKategori = ['Teater Tradisional Murni', 'Teater Kreasi Baru']
    if (!validKategori.includes(kategori)) {
      return NextResponse.json(
        { error: 'Kategori pertunjukan tidak valid' },
        { status: 400 }
      )
    }

    // Validate durasi
    const validDurasi = ['5 menit', '7 menit', '10 menit', '12 menit', '15 menit']
    if (!validDurasi.includes(durasi)) {
      return NextResponse.json(
        { error: 'Durasi pertunjukan tidak valid' },
        { status: 400 }
      )
    }

    const db = getTurso()

    // Ensure table exists
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Pendaftaran (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)) || '-' || hex(randomblob(4)) || '-' || hex(randomblob(4)) || '-' || hex(randomblob(4)) || '-' || hex(randomblob(12)))),
        namaLengkap TEXT NOT NULL,
        namaGrup TEXT NOT NULL,
        email TEXT NOT NULL,
        whatsapp TEXT NOT NULL,
        kategori TEXT NOT NULL,
        judulPertunjukan TEXT NOT NULL,
        durasi TEXT NOT NULL,
        nomorSurat TEXT,
        createdAt TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `)

    // Insert registration
    await db.execute({
      sql: `INSERT INTO Pendaftaran (namaLengkap, namaGrup, email, whatsapp, kategori, judulPertunjukan, durasi, nomorSurat) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        namaLengkap,
        namaGrup,
        email,
        whatsapp,
        kategori,
        judulPertunjukan,
        durasi,
        nomorSurat || null,
      ],
    })

    return NextResponse.json({
      message: 'Pendaftaran berhasil dikirim! Kami akan menghubungi Anda untuk konfirmasi.',
      success: true,
    })
  } catch (error) {
    console.error('Pendaftaran failed:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses pendaftaran. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const db = getTurso()

    // Ensure table exists
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Pendaftaran (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(8)) || '-' || hex(randomblob(4)) || '-' || hex(randomblob(4)) || '-' || hex(randomblob(4)) || '-' || hex(randomblob(12)))),
        namaLengkap TEXT NOT NULL,
        namaGrup TEXT NOT NULL,
        email TEXT NOT NULL,
        whatsapp TEXT NOT NULL,
        kategori TEXT NOT NULL,
        judulPertunjukan TEXT NOT NULL,
        durasi TEXT NOT NULL,
        nomorSurat TEXT,
        createdAt TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `)

    const result = await db.execute('SELECT * FROM Pendaftaran ORDER BY createdAt DESC')
    const registrations = result.rows.map((row) => ({
      id: row.id as string,
      namaLengkap: row.namaLengkap as string,
      namaGrup: row.namaGrup as string,
      email: row.email as string,
      whatsapp: row.whatsapp as string,
      kategori: row.kategori as string,
      judulPertunjukan: row.judulPertunjukan as string,
      durasi: row.durasi as string,
      nomorSurat: row.nomorSurat as string | null,
      createdAt: row.createdAt as string,
    }))

    return NextResponse.json(registrations)
  } catch (error) {
    console.error('Fetch pendaftaran failed:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data pendaftaran' },
      { status: 500 }
    )
  }
}
