import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/cn'
import { buildImageProps } from '@/lib/sanity/build-image-props'

import type { ProjectedImage } from '@/types/sanity-image'

type SiteLogoProps = {
  siteTitle: string
  logo: ProjectedImage | null | undefined
  tone?: 'theme' | 'dark'
  className?: string
}

const brandLogoWidth = 1000
const brandLogoHeight = 181

export function SiteLogo({ siteTitle, logo, tone = 'theme', className }: SiteLogoProps) {
  const logoImage = buildImageProps(logo, { width: 280 })

  return (
    <Link
      href="/"
      aria-label={`${siteTitle} home`}
      className={cn('inline-flex items-center', className)}
    >
      {logoImage ? (
        <Image {...logoImage} alt={siteTitle} className="h-8 w-auto" preload />
      ) : (
        <>
          <Image
            src={tone === 'dark' ? '/brand/logo-on-dark.webp' : '/brand/logo-on-light.webp'}
            alt={siteTitle}
            width={brandLogoWidth}
            height={brandLogoHeight}
            className={cn('h-8 w-auto', tone === 'theme' && 'theme-dark:hidden')}
            preload={tone === 'theme'}
          />
          {tone === 'theme' && (
            <Image
              src="/brand/logo-on-dark.webp"
              alt=""
              width={brandLogoWidth}
              height={brandLogoHeight}
              className="hidden h-8 w-auto theme-dark:block"
            />
          )}
        </>
      )}
    </Link>
  )
}
