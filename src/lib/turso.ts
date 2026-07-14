import { createClient, type Client } from '@libsql/client'

let _client: Client | null = null

export function getTurso(): Client {
  if (!_client) {
    _client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    })
  }
  return _client
}

// Convert row from libsql (which returns values as string|null) to a proper object
export function rowToBlog(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    content: row.content as string,
    excerpt: row.excerpt as string | null,
    coverImage: row.coverImage as string | null,
    isHighlight: Number(row.isHighlight) === 1,
    highlightType: row.highlightType as string | null,
    category: row.category as string | null,
    published: Number(row.published) === 1,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  }
}

export function rowToMerch(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string | null,
    price: row.price as number,
    imageUrl: row.imageUrl as string | null,
    category: row.category as string,
    is3D: Number(row.is3D) === 1,
    modelUrl: row.modelUrl as string | null,
    published: Number(row.published) === 1,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  }
}

export function rowToSession(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    token: row.token as string,
    createdAt: row.createdAt as string,
    expiresAt: row.expiresAt as string,
  }
}
