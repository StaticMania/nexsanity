import { createClient } from 'next-sanity'

import { publicEnv } from '@/lib/env/public-env'

export const sanityClient = createClient({
  projectId: publicEnv.sanityProjectId,
  dataset: publicEnv.sanityDataset,
  apiVersion: publicEnv.sanityApiVersion,
  useCdn: true,
  perspective: 'published',
  stega: { studioUrl: '/studio' },
})
