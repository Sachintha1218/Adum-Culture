import { groq } from 'next-sanity'

// ─── Product Queries ────────────────────────────────────────────────────
export const ALL_PRODUCTS_QUERY = groq`
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    slug,
    description,
    price,
    originalPrice,
    "category": category->slug.current,
    "categoryName": category->name,
    images[] {
      asset->{url},
      hotspot,
      crop
    },
    sizes,
    colors,
    newArrival,
    bestSeller,
    itemCode,
    stock,
    modelDetails,
    material,
    careInstructions
  }
`

export const PRODUCT_BY_SLUG_QUERY = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    price,
    originalPrice,
    "category": category->slug.current,
    "categoryName": category->name,
    images[] {
      asset->{url},
      hotspot,
      crop
    },
    sizes,
    colors,
    newArrival,
    bestSeller,
    itemCode,
    stock,
    modelDetails,
    material,
    careInstructions
  }
`

export const BEST_SELLERS_QUERY = groq`
  *[_type == "product" && bestSeller == true] | order(_createdAt desc) [0...4] {
    _id,
    name,
    slug,
    description,
    price,
    originalPrice,
    "category": category->slug.current,
    images[] {
      asset->{url},
      hotspot,
      crop
    },
    sizes,
    colors,
    newArrival,
    bestSeller,
    itemCode,
    stock
  }
`

export const NEW_ARRIVALS_QUERY = groq`
  *[_type == "product" && newArrival == true] | order(_createdAt desc) [0...8] {
    _id,
    name,
    slug,
    description,
    price,
    originalPrice,
    "category": category->slug.current,
    images[] {
      asset->{url},
      hotspot,
      crop
    },
    sizes,
    colors,
    newArrival,
    bestSeller,
    itemCode,
    stock
  }
`

export const RELATED_PRODUCTS_QUERY = groq`
  *[_type == "product" && category->slug.current == $category && slug.current != $currentSlug] | order(_createdAt desc) [0...4] {
    _id,
    name,
    slug,
    description,
    price,
    originalPrice,
    "category": category->slug.current,
    images[] {
      asset->{url},
      hotspot,
      crop
    },
    sizes,
    colors,
    newArrival,
    bestSeller,
    itemCode,
    stock
  }
`

export const ALL_PRODUCT_SLUGS_QUERY = groq`
  *[_type == "product"] { "slug": slug.current }
`

// ─── Category Queries ─────────────────────────────────────────────────
export const ALL_CATEGORIES_QUERY = groq`
  *[_type == "category"] | order(_createdAt asc) {
    _id,
    name,
    slug,
    description,
    image {
      asset->{url},
      hotspot,
      crop
    }
  }
`

export const FEATURED_CATEGORIES_QUERY = groq`
  *[_type == "category"] | order(_createdAt asc) [0...3] {
    _id,
    name,
    slug,
    description,
    image {
      asset->{url},
      hotspot,
      crop
    }
  }
`
