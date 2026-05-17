// Replaces Sanity GROQ queries — fetches from ADMIN_PANEL public API

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:3002'

async function apiFetch(path: string) {
  const res = await fetch(`${ADMIN_URL}${path}`, { next: { revalidate: 60 } })
  if (!res.ok) return null
  return res.json()
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function getAllProducts() {
  const data = await apiFetch('/api/public/products')
  return data?.data?.products ?? []
}

export async function getProductBySlug(slug: string) {
  const data = await apiFetch(`/api/public/products/${slug}`)
  return data?.data?.product ?? null
}

export async function getBestSellers(limit = 4) {
  const data = await apiFetch(`/api/public/products?bestSeller=true&limit=${limit}`)
  return data?.data?.products ?? []
}

export async function getNewArrivals(limit = 8) {
  const data = await apiFetch(`/api/public/products?newArrival=true&limit=${limit}`)
  return data?.data?.products ?? []
}

export async function getProductsByCategory(categorySlug: string) {
  const data = await apiFetch(`/api/public/products?category=${categorySlug}`)
  return data?.data?.products ?? []
}

export async function getRelatedProducts(categorySlug: string, currentSlug: string, limit = 4) {
  const products = await getProductsByCategory(categorySlug)
  return products.filter((p: { slug: string }) => p.slug !== currentSlug).slice(0, limit)
}

export async function getAllProductSlugs() {
  const products = await getAllProducts()
  return products.map((p: { slug: string }) => ({ slug: p.slug }))
}

export async function getGalleryImages(limit = 7) {
  const data = await apiFetch(`/api/public/products?bestSeller=true&limit=${limit}`)
  return data?.data?.products ?? []
}

// ── Collections / Categories ──────────────────────────────────────────────────

export async function getAllCollections() {
  const data = await apiFetch('/api/public/collections')
  return data?.data?.collections ?? []
}

// ── Hero Slides ───────────────────────────────────────────────────────────────

export async function getHeroSlides() {
  const data = await apiFetch('/api/public/hero-slides')
  return data?.data?.slides ?? []
}

// ── Page Content ──────────────────────────────────────────────────────────────

export async function getPageContent(key: string): Promise<{ title: string; body: string; imageUrl?: string } | null> {
  const data = await apiFetch(`/api/public/content/${key}`)
  return data?.data?.content ?? null
}
