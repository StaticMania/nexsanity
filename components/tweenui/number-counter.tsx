'use client'

import NumberFlow from '@number-flow/react'
import { useRef, useState } from 'react'

import { prefersReducedMotion } from '@/lib/animation/prefers-reduced-motion'
import { ScrollTrigger, gsap, useGSAP } from '@/lib/animation/register-gsap'

type NumberCounterProps = {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  delay?: number
  duration?: number
}

const defaultDurationSeconds = 1.8

export function NumberCounter({
  value,
  prefix,
  suffix,
  decimals = 0,
  delay = 0,
  duration = defaultDurationSeconds,
}: NumberCounterProps) {
  const rootRef = useRef<HTMLSpanElement>(null)
  const [displayValue, setDisplayValue] = useState(0)
  const [isReduced, setIsReduced] = useState(false)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      if (prefersReducedMotion()) {
        setIsReduced(true)
        setDisplayValue(value)
        return
      }

      let startCall: gsap.core.Tween | null = null
      const trigger = ScrollTrigger.create({
        trigger: root,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          startCall = gsap.delayedCall(delay, () => setDisplayValue(value))
        },
      })

      return () => {
        startCall?.kill()
        trigger.kill()
      }
    },
    { scope: rootRef, dependencies: [value, delay] },
  )

  const durationMs = isReduced ? 0 : duration * 1000

  return (
    <span ref={rootRef}>
      <NumberFlow
        value={displayValue}
        prefix={prefix}
        suffix={suffix}
        format={{
          useGrouping: true,
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }}
        trend={0}
        transformTiming={{ duration: durationMs, easing: 'ease-out' }}
        spinTiming={{ duration: durationMs, easing: 'ease-out' }}
        opacityTiming={{
          duration: isReduced ? 0 : Math.max(250, duration * 450),
          easing: 'ease-out',
        }}
      />
    </span>
  )
}
