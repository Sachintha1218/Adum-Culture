import { urlForImage } from '@/sanity/lib/image'
import { SanityImage } from '@/types'

/**
 * Resolves a product/category image to a string URL.
 * Handles both Sanity image objects and plain URL strings (legacy static data).
 */
export function resolveImageUrl(
  image: SanityImage | string | undefined,
  width = 800
): string {
  if (!image) return '/placeholder.jpg'

  // Plain URL string (legacy Unsplash links or deployed URLs)
  if (typeof image === 'string') return image

  // Sanity image object
  if (image?.asset?.url) {
    return urlForImage(image).width(width).url()
  }

  return '/placeholder.jpg'
}

/**
 * Resolves the first image from a product/category images array.
 */
export function resolveFirstImage(
  images: (SanityImage | string)[] | undefined,
  width = 800
): string {
  if (!images || images.length === 0) return '/placeholder.jpg'
  return resolveImageUrl(images[0], width)
}

/**
 * Normalizes a slug whether it's a Sanity { current: string } object or a plain string.
 */
export function resolveSlug(slug: string | { current: string } | undefined): string {
  if (!slug) return ''
  if (typeof slug === 'string') return slug
  return slug.current
}

/**
 * Normalizes a product/category ID across Sanity (_id) and legacy (id) formats.
 */
export function resolveId(item: { _id?: string; id?: string }): string {
  return item._id ?? item.id ?? ''
}
