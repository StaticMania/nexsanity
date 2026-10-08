export const appErrorCodes = {
  validationFailed: 'VALIDATION_FAILED',
  rateLimited: 'RATE_LIMITED',
  serviceUnavailable: 'SERVICE_UNAVAILABLE',
  notFound: 'NOT_FOUND',
  unexpected: 'UNEXPECTED_ERROR',
} as const

export type AppErrorCode = (typeof appErrorCodes)[keyof typeof appErrorCodes]

export type FieldErrors = Partial<Record<string, string>>

type AppErrorOptions = {
  code: AppErrorCode
  message: string
  status: number
  fieldErrors?: FieldErrors
  cause?: unknown
}

export class AppError extends Error {
  readonly code: AppErrorCode
  readonly status: number
  readonly fieldErrors?: FieldErrors

  constructor({ code, message, status, fieldErrors, cause }: AppErrorOptions) {
    super(message, { cause })
    this.name = 'AppError'
    this.code = code
    this.status = status
    this.fieldErrors = fieldErrors
  }
}
