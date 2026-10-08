import { Mail, MapPin, Phone } from 'lucide-react'
import { stegaClean } from 'next-sanity'

import { buildSectionClassName } from '@/lib/content/block-options'
import { getSettings } from '@/lib/content/get-settings'
import type { HeadingLevel } from '@/lib/content/heading-levels'

import { ContactForm } from '@/components/blocks/contact-form/contact-form'
import { SocialIcon } from '@/components/ui/social-icon'

import type { BlockOfType } from '@/types/content'

type ContactFormBlockProps = {
  block: BlockOfType<'contactFormBlock'>
  headingLevel: HeadingLevel
}

export async function ContactFormBlock({ block, headingLevel: HeadingTag }: ContactFormBlockProps) {
  const settings = await getSettings()
  const socials = (settings?.socialLinks ?? []).map((socialLink) => ({
    key: socialLink._key,
    platform: stegaClean(socialLink.platform),
    url: stegaClean(socialLink.url),
  }))
  const phone = stegaClean(block.contactPhone)
  const email = stegaClean(block.contactEmail)

  return (
    <section
      aria-labelledby={`${block._key}-heading`}
      className={buildSectionClassName(block.blockOptions)}
    >
      <div className="main-container">
        <div className="mx-auto max-w-2xl text-center">
          <HeadingTag
            id={`${block._key}-heading`}
            className="font-serif text-headline font-medium text-balance"
          >
            {block.heading}
          </HeadingTag>
          {block.intro && <p className="mt-5 text-lg text-pretty text-muted">{block.intro}</p>}
        </div>

        <div className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-panel bg-canvas shadow-xl ring-1 ring-line">
          <div className="grid lg:grid-cols-5">
            <div className="relative overflow-hidden rounded-panel bg-accent p-8 text-accent-ink lg:col-span-2 lg:p-10">
              <h3 className="text-xl font-semibold">Contact Information</h3>
              {block.contactDescription && (
                <p className="mt-3 text-sm leading-relaxed opacity-80">
                  {block.contactDescription}
                </p>
              )}

              <ul className="mt-10 space-y-7">
                {block.contactPhone && (
                  <li className="flex items-start gap-4">
                    <Phone aria-hidden="true" className="mt-0.5 size-5 shrink-0 opacity-80" />
                    <a
                      href={`tel:${phone?.replace(/[^\d+]/g, '')}`}
                      className="text-sm underline-offset-4 hover:underline"
                    >
                      {block.contactPhone}
                    </a>
                  </li>
                )}
                {block.contactEmail && (
                  <li className="flex items-start gap-4">
                    <Mail aria-hidden="true" className="mt-0.5 size-5 shrink-0 opacity-80" />
                    <a
                      href={`mailto:${email}`}
                      className="text-sm underline-offset-4 hover:underline"
                    >
                      {block.contactEmail}
                    </a>
                  </li>
                )}
                {block.contactAddress && (
                  <li className="flex items-start gap-4">
                    <MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0 opacity-80" />
                    <span className="text-sm">{block.contactAddress}</span>
                  </li>
                )}
              </ul>

              {socials.length > 0 && (
                <ul className="relative z-10 mt-12 flex flex-wrap gap-3">
                  {socials.map((social) => (
                    <li key={social.key}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.platform}
                        className="flex size-10 items-center justify-center rounded-full bg-accent-ink/10 transition-colors duration-300 hover:bg-accent-ink hover:text-accent"
                      >
                        <SocialIcon platform={social.platform} />
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              <div
                aria-hidden="true"
                className="absolute -right-16 -bottom-16 size-48 rounded-full opacity-15"
                style={{ background: 'currentColor' }}
              />
              <div
                aria-hidden="true"
                className="absolute -right-6 -bottom-6 size-28 rounded-full opacity-10"
                style={{ background: 'currentColor' }}
              />
            </div>

            <div className="p-8 lg:col-span-3 lg:p-10">
              <ContactForm successMessage={block.successMessage} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
