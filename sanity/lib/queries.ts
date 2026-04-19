import { groq } from 'next-sanity'

// ─── Product Queries ────────────────────────────────────────────────────
export const ALL_PRODUCTS_QUERY = groq`
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    name,
    "slug": slug.current,
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
    careInstructions,
    styleGuide,
    shippingInfo
  }
`

export const PRODUCT_BY_SLUG_QUERY = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
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
    "sizeGuide": sizeGuide->{
      name,
      image {
        asset->{url},
        hotspot,
        crop
      }
    },
    sizes,
    colors,
    newArrival,
    bestSeller,
    itemCode,
    stock,
    modelDetails,
    material,
    careInstructions,
    styleGuide,
    shippingInfo
  }
`

export const BEST_SELLERS_QUERY = groq`
  *[_type == "product" && bestSeller == true] | order(_createdAt desc) [0...4] {
    _id,
    name,
    "slug": slug.current,
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
    stock
  }
`

export const NEW_ARRIVALS_QUERY = groq`
  *[_type == "product" && newArrival == true] | order(_createdAt desc) [0...8] {
    _id,
    name,
    "slug": slug.current,
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
    stock
  }
`

export const RELATED_PRODUCTS_QUERY = groq`
  *[_type == "product" && category->slug.current == $category && slug.current != $currentSlug] | order(_createdAt desc) [0...4] {
    _id,
    name,
    "slug": slug.current,
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

// ─── Gallery Query — fetches best-seller product images for homepage gallery
export const GALLERY_IMAGES_QUERY = groq`
  *[_type == "product" && bestSeller == true] | order(_createdAt desc) [0...7] {
    _id,
    name,
    "slug": slug.current,
    images[] {
      asset->{url},
      hotspot,
      crop
    }
  }
`

// ─── Hero Slides Query ────────────────────────────────────────────────
export const HERO_SLIDES_QUERY = groq`
  *[_type == "heroSlide" && active == true] | order(order asc) {
    _id,
    order,
    alt,
    desktopImage {
      asset->{url},
      hotspot,
      crop
    },
    mobileImage {
      asset->{url},
      hotspot,
      crop
    }
  }
`

// ─── Category Queries ─────────────────────────────────────────────────
export const ALL_CATEGORIES_QUERY = groq`
  *[_type == "category"] | order(_createdAt asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    image {
      asset->{url},
      hotspot,
      crop
    }
  }
`

export const FEATURED_CATEGORIES_QUERY = groq`
  *[_type == "category"] | order(_createdAt asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    image {
      asset->{url},
      hotspot,
      crop
    }
  }
`
