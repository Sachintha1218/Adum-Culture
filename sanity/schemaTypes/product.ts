import { defineType, defineField } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Add one or more lines. Multiple lines are shown as bullet points on the product page.',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'originalPrice',
      title: 'Original Price',
      type: 'number',
      description: 'Used to show a discount (strikethrough price).',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'sizes',
      title: 'Sizes & Stock',
      description: 'Add sizes and their respective stock quantities.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'sizeStock',
          title: 'Size & Stock',
          fields: [
            defineField({
              name: 'size',
              title: 'Size',
              type: 'string',
              options: {
                list: [
                  { title: 'XXS', value: 'XXS' },
                  { title: 'XS', value: 'XS' },
                  { title: 'S', value: 'S' },
                  { title: 'M', value: 'M' },
                  { title: 'L', value: 'L' },
                  { title: 'XL', value: 'XL' },
                  { title: 'XXL', value: 'XXL' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              initialValue: 0,
              validation: (Rule) => Rule.required().min(0),
            }),
          ],
          preview: {
            select: {
              title: 'size',
              subtitle: 'quantity',
            },
            prepare(selection: Record<string, unknown>) {
              const title = selection.title as string | undefined;
              const subtitle = selection.subtitle as number | undefined;
              return {
                title: `Size: ${title ?? ''}`,
                subtitle: `Qty: ${subtitle ?? 0}`,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'sizeGuide',
      title: 'Size Guide',
      type: 'reference',
      to: [{ type: 'sizeGuide' }],
      description: 'Select a previously uploaded size guide for this product (optional).',
    }),
    defineField({
      name: 'colors',
      title: 'Colors',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'newArrival',
      title: 'New Arrival',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'bestSeller',
      title: 'Best Seller',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'itemCode',
      title: 'Item Code',
      type: 'string',
    }),
    defineField({
      name: 'modelDetails',
      title: 'Model Details',
      type: 'string',
      description: 'e.g. "Model is 5\'9" and wearing size M"',
    }),
    defineField({
      name: 'material',
      title: 'Material',
      type: 'string',
    }),
    defineField({
      name: 'careInstructions',
      title: 'Care Instructions',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'styleGuide',
      title: 'Style Guide',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'shippingInfo',
      title: 'Shipping & Returns',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'images.0',
      sizes: 'sizes',
    },
    prepare(selection: any) {
      const { title, media, sizes } = selection;
      const totalStock = (sizes || []).reduce((acc: number, curr: any) => acc + (curr.quantity || 0), 0);
      return {
        title,
        media,
        subtitle: `Stock: ${totalStock} — ${totalStock > 0 ? '✅ IN STOCK' : '❌ OUT OF STOCK'}`,
      };
    },
  },
});
