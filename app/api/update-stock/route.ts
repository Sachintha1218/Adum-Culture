import { NextRequest, NextResponse } from 'next/server';
import { writeClient } from '@/sanity/lib/writeClient';

interface OrderItem {
  productId: string;   // Sanity _id
  selectedSize: string; // e.g. "M"  (display format like "UK10 - M" is stripped to raw size key)
  quantity: number;
}

/**
 * Strips the display mapping prefix (e.g. "UK10 - M" → "M", "UK08 - S" → "S").
 * If no " - " separator is found, returns the string as-is.
 */
function rawSize(displaySize: string): string {
  const parts = displaySize.split(' - ');
  return parts.length > 1 ? parts[parts.length - 1] : displaySize;
}

export async function POST(req: NextRequest) {
  // Verify that a write token is configured
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'Stock update is not configured (missing write token).' },
      { status: 500 }
    );
  }

  let items: OrderItem[];
  try {
    const body = await req.json();
    items = body.items;
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided.' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const errors: string[] = [];

  for (const item of items) {
    const { productId, selectedSize, quantity } = item;
    const sizeKey = rawSize(selectedSize);

    try {
      // Fetch current sizeStocks for this product
      const product = await writeClient.fetch<{
        _id: string;
        sizeStocks?: { _key: string; size: string; quantity: number }[];
      }>(
        `*[_type == "product" && _id == $id][0]{ _id, sizeStocks[]{ _key, size, quantity } }`,
        { id: productId }
      );

      if (!product) {
        errors.push(`Product ${productId} not found.`);
        continue;
      }

      const stocks = product.sizeStocks ?? [];
      const entry = stocks.find((s) => s.size === sizeKey);

      if (!entry) {
        // Size doesn't exist in sizeStocks — nothing to deduct
        errors.push(`Size "${sizeKey}" not found in stock for product ${productId}.`);
        continue;
      }

      const newQuantity = Math.max(0, entry.quantity - quantity);

      // Patch the specific array item by its _key
      await writeClient
        .patch(productId)
        .dec({ [`sizeStocks[_key=="${entry._key}"].quantity`]: quantity })
        .commit();

      // Ensure quantity never goes below 0 (double safety)
      if (newQuantity === 0) {
        await writeClient
          .patch(productId)
          .set({ [`sizeStocks[_key=="${entry._key}"].quantity`]: 0 })
          .commit();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Failed to update stock for product ${productId}, size ${sizeKey}: ${msg}`);
    }
  }

  if (errors.length > 0) {
    return NextResponse.json(
      { success: false, errors },
      { status: 207 } // Multi-status: some may have succeeded
    );
  }

  return NextResponse.json({ success: true });
}
