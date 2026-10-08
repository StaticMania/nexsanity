import type { AppErrorCode, FieldErrors } from '@/lib/errors/app-error'

export type ActionError = {
  code: AppErrorCode
  message: string
  fieldErrors?: FieldErrors
}

export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: ActionError }
