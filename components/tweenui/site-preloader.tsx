'use client'

import { useEffect, useRef, useState } from 'react'

import { prefersReducedMotion } from '@/lib/animation/prefers-reduced-motion'
import { hasSeenPreloader, markPreloaderSeen } from '@/lib/animation/preloader-session'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '@/lib/animation/register-gsap'
import { announcePreloaderDone } from '@/lib/animation/wait-for-preloader'

type SitePreloaderProps = {
  wordmark: string
  credit: string
}

const minimumCountSeconds = 1.4
const assetTimeoutMilliseconds = 4000
const easeOut = 'power3.out'
const easeInOut = 'power3.inOut'

export function SitePreloader({ wordmark, credit }: SitePreloaderProps) {
  const [isDone, setIsDone] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLParagraphElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const sheet = sheetRef.current
      const word = wordRef.current
      const line = lineRef.current
      const track = trackRef.current
      const fill = fillRef.current
      const count = countRef.current
      const meta = metaRef.current
      if (!root || !sheet || !word || !line || !track || !fill || !count || !meta) return

      if (prefersReducedMotion() || hasSeenPreloader()) {
        announcePreloaderDone(root)
        setIsDone(true)
        return
      }

      const page = document.getElementById('main-content')
      const html = document.documentElement
      html.style.overflow = 'hidden'

      const split = SplitText.create(word, { type: 'chars', mask: 'chars', aria: 'none' })
      const progress = { value: 0 }
      const hole = { width: 0, height: 0 }

      const renderProgress = () => {
        const ratio = progress.value / 100
        fill.style.transform = `scaleX(${ratio})`
        count.textContent = `${String(Math.round(progress.value)).padStart(3, '0')}%`
        count.style.left = `${Math.max(count.offsetWidth, ratio * line.offsetWidth)}px`
      }

      const renderHole = () => {
        const [left, right] = [50 - 51 * hole.width, 50 + 51 * hole.width]
        const [top, bottom] = [50 - 51 * hole.height, 50 + 51 * hole.height]
        sheet.style.clipPath = `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${left}% ${top}%, ${right}% ${top}%, ${right}% ${bottom}%, ${left}% ${bottom}%, ${left}% ${top}%)`
      }

      renderProgress()
      gsap.set(word, { opacity: 1 })
      if (page) gsap.set(page, { scale: 1.12, filter: 'brightness(0.4)' })

      const intro = gsap
        .timeline({ defaults: { ease: easeOut } })
        .fromTo(split.chars, { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.06 }, 0.15)
        .fromTo([meta, count], { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.35)
        .fromTo(
          track,
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: easeInOut, transformOrigin: 'left center' },
          0.2,
        )

      const counting = gsap.to(progress, {
        value: 90,
        duration: minimumCountSeconds,
        delay: 0.4,
        ease: 'power2.inOut',
        onUpdate: renderProgress,
      })

      let outro: gsap.core.Timeline | null = null
      let finish: gsap.core.Tween | null = null
      let isMounted = true

      const exit = () => {
        const sheetBox = sheet.getBoundingClientRect()
        const lineBox = line.getBoundingClientRect()
        const toMiddle = sheetBox.top + sheetBox.height / 2 - (lineBox.top + lineBox.height / 2)
        outro = gsap
          .timeline({
            onComplete: () => {
              html.style.overflow = ''
              ScrollTrigger.refresh()
              setIsDone(true)
            },
          })
          .to(split.chars, { yPercent: -110, duration: 0.7, stagger: 0.04, ease: easeInOut }, 0)
          .to([meta, count], { autoAlpha: 0, y: 10, duration: 0.4, ease: 'power2.in' }, 0)
          .to(track, { autoAlpha: 0, duration: 0.4 }, 0.1)
          .to(line, { y: toMiddle, duration: 0.9, ease: easeInOut }, 0.15)
          .to(fill, { scaleX: 0, transformOrigin: '50% 50%', duration: 0.6, ease: easeInOut }, 1)
          .add('open', 1.25)
          .to(hole, { width: 1, duration: 1.3, ease: easeInOut, onUpdate: renderHole }, 'open')
          .to(
            hole,
            { height: 1, duration: 1.3, ease: easeInOut, onUpdate: renderHole },
            'open+=0.1',
          )
          .call(
            () => {
              markPreloaderSeen()
              announcePreloaderDone(root)
            },
            undefined,
            'open',
          )
        if (page) {
          outro.to(
            page,
            {
              scale: 1,
              filter: 'brightness(1)',
              duration: 2.2,
              ease: 'expo.out',
              clearProps: 'transform,filter',
            },
            'open',
          )
        }
      }

      void Promise.all([waitForPageAssets(page), counting.then()]).then(() => {
        if (!isMounted) return
        finish = gsap.to(progress, {
          value: 100,
          duration: 0.45,
          ease: 'power2.out',
          onUpdate: renderProgress,
          onComplete: exit,
        })
      })

      return () => {
        isMounted = false
        ;[intro, counting, finish, outro].forEach((tween) => tween?.kill())
        split.revert()
        if (page) gsap.set(page, { clearProps: 'transform,filter' })
        html.style.overflow = ''
      }
    },
    { scope: rootRef },
  )

  if (isDone) return null

  return (
    <div
      ref={rootRef}
      data-preloader="active"
      data-lenis-prevent
      aria-hidden="true"
      className="@container fixed inset-0 z-60 preloader-failsafe"
    >
      <div ref={sheetRef} className="absolute inset-0 overflow-hidden bg-inverse">
        <span className="footer-glow-outer" />
      </div>

      <div className="absolute inset-0 grid place-items-center">
        <p
          ref={wordRef}
          className="pb-1 preloader-wordmark font-semibold whitespace-nowrap text-inverse-ink uppercase opacity-0"
        >
          {wordmark}
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 px-5 pb-8 sm:px-8 md:px-12 md:pb-12">
        <div ref={lineRef} className="relative h-px w-full">
          <div ref={trackRef} className="absolute inset-0 bg-inverse-line" />
          <div ref={fillRef} className="absolute inset-0 origin-left scale-x-0 bg-tan" />
          <span
            ref={countRef}
            className="absolute bottom-3 left-0 -translate-x-full font-mono text-xs tracking-widest text-tan tabular-nums opacity-0"
          >
            000%
          </span>
        </div>
        <div
          ref={metaRef}
          className="mt-4 flex justify-between gap-6 font-mono text-xs tracking-widest text-inverse-muted uppercase opacity-0"
        >
          <span>
            Local time {'//'} <LocalClock />
          </span>
          <span>{credit}</span>
        </div>
      </div>
    </div>
  )
}

function LocalClock() {
  const [time, setTime] = useState('--:--')

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
    let timerId = 0
    const tick = () => {
      setTime(formatter.format(new Date()))
      timerId = window.setTimeout(tick, 1000 - (Date.now() % 1000) + 5)
    }
    tick()
    return () => window.clearTimeout(timerId)
  }, [])

  return <time className="tabular-nums">{time}</time>
}

function waitForPageAssets(page: HTMLElement | null): Promise<unknown> {
  const images = Array.from(
    page?.querySelectorAll('img[loading="eager"], img[fetchpriority="high"]') ?? [],
  ).map((image) =>
    image instanceof HTMLImageElement ? image.decode().catch(() => undefined) : undefined,
  )
  return Promise.race([
    Promise.all([document.fonts.ready, ...images]),
    new Promise((resolve) => setTimeout(resolve, assetTimeoutMilliseconds)),
  ])
}
