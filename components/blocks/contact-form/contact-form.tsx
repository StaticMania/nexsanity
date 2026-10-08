'use client'

import { ArrowRight, CircleCheck } from 'lucide-react'
import { useActionState, useId, useState } from 'react'
import type { FormEvent } from 'react'

import { cn } from '@/lib/cn'
import { submitContactMessage } from '@/lib/contact/contact-action'
import { collectContactFieldErrors, readContactFormData } from '@/lib/contact/parse-contact-form'
import type { FieldErrors } from '@/lib/errors/app-error'
import {
  buttonArrowClassName,
  buttonArrowIconClassName,
  buttonClassName,
} from '@/lib/ui/button-class-name'
import type { ContactFieldName } from '@/lib/validations/contact-schema'

import { RollText } from '@/components/ui/roll-text'

type ContactFormProps = {
  successMessage: string
}

type ContactFieldProps = {
  name: ContactFieldName
  label: string
  type?: 'text' | 'email'
  autoComplete?: string
  isRequired?: boolean
  isMultiline?: boolean
  error?: string
}

const fieldClassName =
  'mt-1 block w-full border-b border-line bg-transparent px-0 py-3 text-ink placeholder:text-muted/50 focus:border-ink focus:outline-none transition-colors'

export function ContactForm({ successMessage }: ContactFormProps) {
  const [formState, formAction, isPending] = useActionState(submitContactMessage, null)
  const [clientFieldErrors, setClientFieldErrors] = useState<FieldErrors | null>(null)
  const serverError = formState?.ok === false ? formState.error : null
  const fieldErrors = clientFieldErrors ?? serverError?.fieldErrors ?? {}

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const errors = collectContactFieldErrors(readContactFormData(new FormData(event.currentTarget)))
    setClientFieldErrors(errors)
    if (errors) event.preventDefault()
  }

  if (formState?.ok) {
    return (
      <p
        role="status"
        className="flex items-start gap-3 rounded-panel bg-surface p-8 text-lg text-ink"
      >
        <CircleCheck aria-hidden="true" className="mt-1 size-5 shrink-0 text-accent" />
        {successMessage}
      </p>
    )
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-6 sm:grid-cols-2"
    >
      <ContactField
        name="name"
        label="Your Name"
        autoComplete="name"
        isRequired
        error={fieldErrors.name}
      />
      <ContactField
        name="email"
        label="Your Email"
        type="email"
        autoComplete="email"
        isRequired
        error={fieldErrors.email}
      />
      <div className="sm:col-span-2">
        <ContactField name="subject" label="Your Subject" error={fieldErrors.subject} />
      </div>
      <div className="sm:col-span-2">
        <ContactField
          name="message"
          label="Message"
          isRequired
          isMultiline
          error={fieldErrors.message}
        />
      </div>
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-col gap-4 pt-2 sm:col-span-2 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={isPending}
          className={buttonClassName({ size: 'large', hasArrow: true, className: 'group/roll' })}
        >
          <RollText>{isPending ? 'Sending…' : 'Send Message'}</RollText>
          <span aria-hidden="true" className={buttonArrowClassName({ size: 'large' })}>
            <ArrowRight className={buttonArrowIconClassName} />
          </span>
        </button>
        {serverError && !serverError.fieldErrors && (
          <p role="alert" className="text-sm text-danger">
            {serverError.message}
          </p>
        )}
      </div>
    </form>
  )
}

function ContactField({
  name,
  label,
  type = 'text',
  autoComplete,
  isRequired = false,
  isMultiline = false,
  error,
}: ContactFieldProps) {
  const fieldId = useId()
  const errorId = `${fieldId}-error`
  const sharedProps = {
    id: fieldId,
    name,
    required: isRequired,
    autoComplete,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className: cn(fieldClassName, error && 'border-danger'),
  }

  return (
    <div>
      <label htmlFor={fieldId} className="text-xs font-medium tracking-wide text-muted">
        {label}
      </label>
      {isMultiline ? (
        <textarea {...sharedProps} rows={4} className={cn(sharedProps.className, 'resize-y')} />
      ) : (
        <input {...sharedProps} type={type} />
      )}
      {error && (
        <p id={errorId} className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
