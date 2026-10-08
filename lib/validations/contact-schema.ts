import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Please tell us your name.').max(120, 'Please shorten your name.'),
  email: z.email('Please enter a valid email address.').max(254),
  subject: z.string().trim().max(200, 'Please shorten the subject.').optional().default(''),
  company: z.string().trim().max(120, 'Please shorten the company name.').optional().default(''),
  message: z
    .string()
    .trim()
    .min(10, 'Please write at least 10 characters.')
    .max(5000, 'Please keep your message under 5,000 characters.'),
  website: z.string().max(200).optional().default(''),
})

export type ContactInput = z.infer<typeof contactSchema>

export type ContactFieldName = keyof ContactInput
