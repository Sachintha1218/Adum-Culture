// ─── Sanity Image ──────────────────────────────────────────────────────────
export interface SanityImage {
  asset: { url: string };
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface SizeStock {
  size: string;
  quantity: number;
}

export interface ColorVariant {
  colorHex: string;
  colorName?: string;
  sku?: string | null;
  images?: string[];          // URL strings for variable product per-color images
  sizes: { size: string; stock: number }[];
}

export interface SizeGuide {
  name?: string;
  image: SanityImage;
}

export interface SizeGuideData {
  name: string;
  note?: string | null;
  unit: string;
  columns: string[];
  rows: { size: string; values: string[] }[];
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
  sizes: SizeStock[];
  colors: string[];
  productType?: string;       // 'single' | 'variable'
  colorVariants?: ColorVariant[];
  sizeGuideData?: SizeGuideData | null;
  newArrival?: boolean;
  bestSeller?: boolean;
  slug: string | { current: string };
  itemCode?: string;
  /** @deprecated Use sizes for per-size stock. Kept for legacy compatibility. */
  stock?: number;
  modelDetails?: string;
  material?: string;
  careInstructions?: string | string[];
  styleGuide?: string[];
  shippingInfo?: string[];
  returnInfo?: string[];
  displayOrder?: number;
  createdAt?: string;
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
  selectedColor?: string | null;
}
