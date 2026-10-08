import 'server-only'

import { defineEnableDraftMode } from 'next-sanity/draft-mode'

import { serverEnv } from '@/lib/env/server-env'
import { appErrorCodes } from '@/lib/errors/app-error'
import { sanityClient } from '@/lib/sanity/client'

type DraftModeHandler = (request: Request) => Promise<Response>

export const enableDraftMode: DraftModeHandler = serverEnv.sanityApiReadToken
  ? defineEnableDraftMode({
      client: sanityClient.withConfig({ token: serverEnv.sanityApiReadToken, useCdn: false }),
    }).GET
  : respondDraftModeUnavailable

async function respondDraftModeUnavailable(): Promise<Response> {
  return Response.json(
    {
      ok: false,
      error: {
        code: appErrorCodes.serviceUnavailable,
        message: 'Draft mode is not configured. Add SANITY_API_READ_TOKEN to enable previews.',
      },
    },
    { status: 503 },
  )
}
