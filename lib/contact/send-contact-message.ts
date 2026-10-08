import 'server-only'

import { Resend } from 'resend'

import { serverEnv } from '@/lib/env/server-env'
import { AppError, appErrorCodes } from '@/lib/errors/app-error'
import type { ContactInput } from '@/lib/validations/contact-schema'

const resend = serverEnv.resendApiKey ? new Resend(serverEnv.resendApiKey) : null

export async function sendContactMessage(input: ContactInput): Promise<void> {
  if (!resend || !serverEnv.contactToEmail) {
    throw new AppError({
      code: appErrorCodes.serviceUnavailable,
      message: 'The contact form is not available right now. Please email us instead.',
      status: 503,
      cause: 'Resend is not configured',
    })
  }

  const { error } = await resend.emails.send({
    from: serverEnv.contactFromEmail,
    to: serverEnv.contactToEmail,
    replyTo: input.email,
    subject: `New enquiry from ${input.name}`,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Company: ${input.company || 'Not provided'}`,
      '',
      input.message,
    ].join('\n'),
  })

  if (error) {
    throw new AppError({
      code: appErrorCodes.serviceUnavailable,
      message: 'We could not send your message. Please try again in a moment.',
      status: 502,
      cause: { name: error.name, message: error.message },
    })
  }
}
