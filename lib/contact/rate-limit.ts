import 'server-only'

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

import { serverEnv } from '@/lib/env/server-env'
import { AppError, appErrorCodes } from '@/lib/errors/app-error'

const contactRateLimit =
  serverEnv.upstashRedisRestUrl && serverEnv.upstashRedisRestToken
    ? new Ratelimit({
        redis: new Redis({
          url: serverEnv.upstashRedisRestUrl,
          token: serverEnv.upstashRedisRestToken,
        }),
        limiter: Ratelimit.slidingWindow(5, '10 m'),
        prefix: 'nexsanity:contact',
      })
    : null

export async function assertContactRateLimit(clientIp: string): Promise<void> {
  if (!contactRateLimit) {
    throw new AppError({
      code: appErrorCodes.serviceUnavailable,
      message: 'The contact form is not available right now. Please email us instead.',
      status: 503,
      cause: 'Upstash Redis is not configured',
    })
  }

  const { success: isAllowed } = await contactRateLimit.limit(clientIp)
  if (!isAllowed) {
    throw new AppError({
      code: appErrorCodes.rateLimited,
      message: 'You have sent several messages already. Please try again in a few minutes.',
      status: 429,
    })
  }
}
