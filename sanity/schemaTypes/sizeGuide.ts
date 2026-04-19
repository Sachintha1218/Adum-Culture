import { defineType, defineField } from 'sanity';

export const sizeGuide = defineType({
  name: 'sizeGuide',
  title: 'Size Guide',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'e.g. "Men\'s T-Shirt Size Guide", "Women\'s Hoodie Size Guide"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Size Guide Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
  ],
});
