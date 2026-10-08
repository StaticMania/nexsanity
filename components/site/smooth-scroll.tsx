'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'

import { ScrollTrigger } from '@/lib/animation/register-gsap'

const refreshDelayMilliseconds = 150

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, anchors: true })
    lenis.on('scroll', ScrollTrigger.update)

    let refreshTimer = 0
    let lastHeight = document.documentElement.scrollHeight
    const resizeObserver = new ResizeObserver(() => {
      const height = document.documentElement.scrollHeight
      if (height === lastHeight) return
      lastHeight = height
      window.clearTimeout(refreshTimer)
      refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), refreshDelayMilliseconds)
    })
    resizeObserver.observe(document.body)

    return () => {
      window.clearTimeout(refreshTimer)
      resizeObserver.disconnect()
      lenis.destroy()
    }
  }, [])

  return null
}
