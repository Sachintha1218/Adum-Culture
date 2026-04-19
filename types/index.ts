// ─── Sanity Image ──────────────────────────────────────────────────────────
export interface SanityImage {
  asset: { url: string };
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface SizeGuide {
  name?: string;
  image: SanityImage;
}

// ─── Product ───────────────────────────────────────────────────────────────
export interface Product {
  // Sanity uses _id; static data uses id — support both
  _id?: string;
  id?: string;
  name: string;
  description?: string | string[];
  price: number;
  originalPrice?: number;
  category: string;
  categoryName?: string;
  // images can be Sanity image objects OR plain URL strings (legacy)
  images: (SanityImage | string)[];
  sizeGuide?: SizeGuide;
  sizes: string[];
  colors: string[];
  newArrival?: boolean;
  bestSeller?: boolean;
  slug: string | { current: string };
  itemCode?: string;
  stock?: number;
  modelDetails?: string;
  material?: string;
  careInstructions?: string | string[];
  styleGuide?: string[];
  shippingInfo?: string[];
}

// ─── Category ─────────────────────────────────────────────────────────────
export interface Category {
  _id?: string;
  id?: string;
  name: string;
  slug: string | { current: string };
  image: SanityImage | string;
  description?: string;
}

// ─── Cart ─────────────────────────────────────────────────────────────────
export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}
