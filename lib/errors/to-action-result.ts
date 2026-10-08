import type { ActionResult } from '@/lib/errors/action-result'
import { AppError, appErrorCodes } from '@/lib/errors/app-error'

type ActionContext = {
  action: string
}

export function toActionResult(error: unknown, context: ActionContext): ActionResult<never> {
  if (error instanceof AppError) {
    if (error.status >= 500) {
      console.error({ ...context, code: error.code, cause: error.cause })
    }
    return {
      ok: false,
      error: { code: error.code, message: error.message, fieldErrors: error.fieldErrors },
    }
  }

  console.error({ ...context, code: appErrorCodes.unexpected, error })
  return {
    ok: false,
    error: {
      code: appErrorCodes.unexpected,
      message: 'Something went wrong. Please try again in a moment.',
    },
  }
}
