import { defineType, defineField } from 'sanity';

export const heroSlide = defineType({
  name: 'heroSlide',
  title: 'Hero Slide',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: 'Slide Order',
      description: 'Lower numbers appear first (1, 2, 3…)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      description: 'Short description of the slide for accessibility and SEO.',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'desktopImage',
      title: 'Desktop Image',
      description: 'Landscape format — recommended 1920×1080px or 2880×1620px.',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mobileImage',
      title: 'Mobile Image',
      description: 'Portrait format — recommended 768×1024px or 1080×1350px.',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'active',
      title: 'Active',
      description: 'Uncheck to hide this slide without deleting it.',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Slide Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'alt',
      order: 'order',
      media: 'desktopImage',
    },
    prepare({ title, order, media }) {
      return {
        title: `Slide ${order ?? '?'}: ${title ?? 'Untitled'}`,
        media,
      };
    },
  },
});
