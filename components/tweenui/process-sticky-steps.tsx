import Image from 'next/image'
import type { ReactNode } from 'react'

import type { SubheadingLevel } from '@/lib/content/heading-levels'
import type { SanityImageProps } from '@/lib/sanity/build-image-props'

export type ProcessStep = {
  key: string
  title: string
  description: string
  image: SanityImageProps | null
}

type ProcessStickyStepsProps = {
  header: ReactNode
  steps: readonly ProcessStep[]
  headingLevel: SubheadingLevel
}

export function ProcessStickySteps({
  header,
  steps,
  headingLevel: HeadingTag,
}: ProcessStickyStepsProps) {
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-7">
        <div className="lg:sticky lg:top-32">{header}</div>
      </div>

      <ol className="space-y-6 lg:col-span-5">
        {steps.map((step, index) => (
          <li
            key={step.key}
            className="overflow-hidden rounded-panel bg-canvas p-3 ring-1 ring-line"
          >
            {step.image && (
              <div className="overflow-hidden rounded-card bg-surface">
                <Image
                  src={step.image.src}
                  width={step.image.width}
                  height={step.image.height}
                  alt={step.image.alt}
                  placeholder={step.image.placeholder}
                  blurDataURL={step.image.blurDataURL}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="aspect-16/9 w-full object-cover"
                />
              </div>
            )}
            <div className="flex gap-4 px-2 pt-5 pb-2">
              <span className="font-serif text-2xl leading-none text-accent tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <HeadingTag className="text-xl font-medium tracking-tight">{step.title}</HeadingTag>
                <p className="mt-2 text-sm text-pretty text-muted">{step.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
