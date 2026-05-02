import { db } from '@/lib/db'

let seeded = false

export async function autoSeed() {
  if (seeded) return
  seeded = true

  try {
    const existing = await db.blog.findFirst()
    if (existing) return

    await db.blog.createMany({
      data: [
        {
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
          isHighlight: true,
          highlightType: 'headline',
          category: 'pendaftaran',
          published: true,
        },
        {
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
          isHighlight: true,
          highlightType: 'featured',
          category: 'informasi',
          published: true,
        },
        {
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
          isHighlight: true,
          highlightType: 'featured',
          category: 'juklak',
          published: true,
        },
      ],
    })

    console.log('✅ Auto-seed: 3 blogs created')
  } catch (error) {
    console.error('Auto-seed failed:', error)
  }
}
