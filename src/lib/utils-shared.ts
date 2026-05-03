/**
 * Shared utility functions for the FTRN #5 website.
 * Extracted from duplicated code across components.
 */

/**
 * Returns a human-readable relative time string in Indonesian.
 * Duplicated in BerandaPage and BlogPage — now shared here.
 */
export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Hari ini'
  if (days === 1) return 'Kemarin'
  if (days < 7) return `${days} hari lalu`
  if (days < 30) return `${Math.floor(days / 7)} minggu lalu`
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

/**
 * Estimate reading time for text content.
 * Based on average Indonesian reading speed of ~200 words/minute.
 * Returns a string like "3 menit baca" or "1 menit baca".
 */
export function readingTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} menit baca`
}
