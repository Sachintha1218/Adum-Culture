import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

// Use for individual document lookups — bypasses CDN so newly-published
// content is always found immediately (CDN may lag for specific slug queries).
export const freshClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})
