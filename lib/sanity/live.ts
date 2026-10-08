import 'server-only'

import { defineLive } from 'next-sanity/live'

import { serverEnv } from '@/lib/env/server-env'
import { sanityClient } from '@/lib/sanity/client'

export const { sanityFetch, SanityLive } = defineLive({
  client: sanityClient,
  serverToken: serverEnv.sanityApiReadToken ?? false,
  browserToken: serverEnv.sanityApiBrowserToken ?? false,
})
