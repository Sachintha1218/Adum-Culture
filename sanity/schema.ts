import { type SchemaTypeDefinition } from 'sanity'

import { product } from './schemaTypes/product'
import { category } from './schemaTypes/category'
import { heroSlide } from './schemaTypes/heroSlide'
import { sizeGuide } from './schemaTypes/sizeGuide'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, category, heroSlide, sizeGuide],
}
