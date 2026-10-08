import { stegaClean } from 'next-sanity'

import { buildCtaItem } from '@/lib/content/build-cta-items'
import { buildNavigationItems, splitNavigationItems } from '@/lib/content/build-navigation-items'
import type { NavigationItem } from '@/lib/content/build-navigation-items'

import { AnimatedHeader } from '@/components/site/animated-header'
import { MobileNavigation } from '@/components/site/mobile-navigation'
import { NavigationLink } from '@/components/site/navigation-link'
import { SiteLogo } from '@/components/site/site-logo'
import { ButtonLink } from '@/components/ui/button-link'

import type { SiteSettings } from '@/types/content'

type SiteHeaderProps = {
  settings: SiteSettings
}

type HeaderNavigationProps = {
  label: string
  items: readonly NavigationItem[]
}

export function SiteHeader({ settings }: SiteHeaderProps) {
  const siteTitle = stegaClean(settings?.siteTitle) ?? 'NexSanity'
  const navigationItems = buildNavigationItems(settings?.primaryNavigation)
  const { leadingItems, trailingItems } = splitNavigationItems(navigationItems)
  const headerCta = buildCtaItem(settings?.headerCta)

  return (
    <AnimatedHeader>
      <div className="main-container">
        <div className="flex h-20 items-center justify-between gap-6">
          <div className="hidden flex-1 basis-0 lg:block">
            <HeaderNavigation label="Primary" items={leadingItems} />
          </div>
          <div data-header-item>
            <SiteLogo siteTitle={siteTitle} logo={settings?.logo} />
          </div>
          <div className="flex flex-1 basis-0 items-center justify-end gap-8">
            <div className="hidden lg:block">
              <HeaderNavigation label="Secondary" items={trailingItems} />
            </div>
            {headerCta && (
              <div data-header-item className="hidden sm:block">
                <ButtonLink href={headerCta.href} size="small">
                  {headerCta.label}
                </ButtonLink>
              </div>
            )}
            <div data-header-item className="lg:hidden">
              <MobileNavigation items={navigationItems} cta={headerCta} />
            </div>
          </div>
        </div>
      </div>
    </AnimatedHeader>
  )
}

function HeaderNavigation({ label, items }: HeaderNavigationProps) {
  if (items.length === 0) return null

  return (
    <nav aria-label={label}>
      <ul className="flex items-center gap-7">
        {items.map((item) => (
          <li key={item.key} data-header-item>
            <NavigationLink
              href={item.href}
              className="text-sm text-ink transition-opacity hover:opacity-60"
              activeClassName="underline decoration-ink/30 underline-offset-8"
            >
              {item.label}
            </NavigationLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
