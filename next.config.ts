import type { NextConfig } from 'next'
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants'

const baseSecurityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

function buildContentSecurityPolicy(isDevelopment: boolean): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://cdn.sanity.io",
    "font-src 'self' data:",
    "connect-src 'self' https://*.api.sanity.io wss://*.api.sanity.io https://*.apicdn.sanity.io",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join('; ')
}

export default function createNextConfig(phase: string): NextConfig {
  const contentSecurityPolicy = buildContentSecurityPolicy(phase === PHASE_DEVELOPMENT_SERVER)

  return {
    images: {
      loader: 'custom',
      loaderFile: './lib/sanity/sanity-image-loader.ts',
    },
    async headers() {
      return [
        { source: '/:path*', headers: baseSecurityHeaders },
        {
          source: '/((?!studio).*)',
          headers: [
            { key: 'Content-Security-Policy', value: contentSecurityPolicy },
            { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          ],
        },
      ]
    },
  }
}
