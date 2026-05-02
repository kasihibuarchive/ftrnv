/**
 * Convert an image URL to use our server-side proxy if it's an external URL.
 * Local paths (starting with /) are returned as-is.
 * External URLs are proxied through /api/proxy-image to avoid CORS/mixed-content issues on mobile.
 */
export function proxyImageUrl(url: string | null | undefined): string {
  if (!url) return ''
  // Local paths — no proxy needed
  if (url.startsWith('/')) return url
  // External URLs — route through proxy
  return `/api/proxy-image?url=${encodeURIComponent(url)}`
}
