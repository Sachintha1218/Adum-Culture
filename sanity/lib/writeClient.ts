import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';

/**
 * Sanity write client — used ONLY in server-side API routes.
 * Requires SANITY_API_WRITE_TOKEN in environment variables.
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});
