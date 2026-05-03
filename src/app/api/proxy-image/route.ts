import { NextRequest, NextResponse } from 'next/server'

/**
 * Check if a hostname resolves to a private/internal IP address.
 * Prevents SSRF attacks by blocking requests to internal network ranges.
 */
async function isPrivateHost(hostname: string): Promise<boolean> {
  // Block obvious localhost patterns
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0' || hostname === '::1') {
    return true
  }

  // Block common cloud metadata hostname
  if (hostname === '169.254.169.254' || hostname.endsWith('.internal') || hostname.endsWith('.local')) {
    return true
  }

  // Resolve DNS and check the resulting IP
  try {
    const { lookup } = await import('dns').then(m => m.promises ?? m)
    const addresses = await lookup(hostname)
    const ip = typeof addresses === 'string' ? addresses : addresses.address

    // Check private IP ranges
    const ipParts = ip.split('.').map(Number)

    // IPv4 checks
    if (ipParts.length === 4 && ipParts.every(n => !isNaN(n) && n >= 0 && n <= 255)) {
      // 127.0.0.0/8 - Loopback
      if (ipParts[0] === 127) return true
      // 10.0.0.0/8 - Private Class A
      if (ipParts[0] === 10) return true
      // 172.16.0.0/12 - Private Class B
      if (ipParts[0] === 172 && ipParts[1] >= 16 && ipParts[1] <= 31) return true
      // 192.168.0.0/16 - Private Class C
      if (ipParts[0] === 192 && ipParts[1] === 168) return true
      // 169.254.0.0/16 - Link-local / Cloud metadata
      if (ipParts[0] === 169 && ipParts[1] === 254) return true
      // 0.0.0.0/8 - "This network"
      if (ipParts[0] === 0) return true
      // 100.64.0.0/10 - Carrier-grade NAT
      if (ipParts[0] === 100 && ipParts[1] >= 64 && ipParts[1] <= 127) return true
      // 198.18.0.0/15 - Benchmark testing
      if (ipParts[0] === 198 && ipParts[1] >= 18 && ipParts[1] <= 19) return true
      // 224.0.0.0/4 - Multicast
      if (ipParts[0] >= 224 && ipParts[0] <= 239) return true
      // 240.0.0.0/4 - Reserved
      if (ipParts[0] >= 240) return true
    }

    // IPv6 checks
    if (ip.includes(':')) {
      const lower = ip.toLowerCase()
      if (lower.startsWith('::1') || lower.startsWith('fe80:') || lower.startsWith('fc') || lower.startsWith('fd')) {
        return true
      }
    }
  } catch {
    // If DNS resolution fails, be safe and block
    return true
  }

  return false
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 })
  }

  // Only allow http/https URLs
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  // Block non-standard ports (only allow 80 for http and 443 for https)
  const port = parsedUrl.port ? parseInt(parsedUrl.port, 10) : (parsedUrl.protocol === 'https:' ? 443 : 80)
  if (parsedUrl.port && port !== 80 && port !== 443) {
    return NextResponse.json({ error: 'Non-standard ports are not allowed' }, { status: 400 })
  }

  // Block URLs with userinfo (e.g. http://evil@internal/)
  if (parsedUrl.username || parsedUrl.password) {
    return NextResponse.json({ error: 'URLs with credentials are not allowed' }, { status: 400 })
  }

  // SSRF protection: check if the hostname resolves to a private IP
  const hostname = parsedUrl.hostname
  if (await isPrivateHost(hostname)) {
    return NextResponse.json({ error: 'Access to internal resources is not allowed' }, { status: 400 })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; FTRN-Proxy/1.0)',
        'Accept': 'image/*,*/*',
      },
      signal: AbortSignal.timeout(10000), // 10s timeout
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: response.status })
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Proxy image error:', error)
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 })
  }
}
