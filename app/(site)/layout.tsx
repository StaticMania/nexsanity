import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { stegaClean } from 'next-sanity'
import { VisualEditing } from 'next-sanity/visual-editing'
import type { ReactNode } from 'react'

import { getSettings } from '@/lib/content/get-settings'
import { SanityLive } from '@/lib/sanity/live'
import { buildRootMetadata } from '@/lib/seo/build-root-metadata'
import { buildThemeAttributes } from '@/lib/theme/build-theme-attributes'

import { PageTransition } from '@/components/site/page-transition'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { SmoothScroll } from '@/components/site/smooth-scroll'
import { SitePreloader } from '@/components/tweenui/site-preloader'

export async function generateMetadata(): Promise<Metadata> {
  return buildRootMetadata(await getSettings())
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [settings, { isEnabled: isDraftMode }] = await Promise.all([getSettings(), draftMode()])
  const siteTitle = stegaClean(settings?.siteTitle) ?? 'NexSanity'

  return (
    <div
      {...buildThemeAttributes(settings?.theme)}
      data-site-root
      className="flex min-h-dvh flex-col bg-canvas text-ink"
    >
      <Link
        href="#main-content"
        scroll={false}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-canvas"
      >
        Skip to content
      </Link>
      <SiteHeader settings={settings} />
      <main id="main-content" className="flex-1">
        <PageTransition label={siteTitle}>{children}</PageTransition>
      </main>
      <SiteFooter settings={settings} />
      {!isDraftMode && (
        <SitePreloader
          wordmark={siteTitle}
          credit={`© ${new Date().getUTCFullYear()} ${siteTitle}`}
        />
      )}
      <SmoothScroll />
      <SanityLive />
      {isDraftMode && <VisualEditing />}
    </div>
  )
}
