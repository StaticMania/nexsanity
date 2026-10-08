import Image from 'next/image'

import type { SubheadingLevel } from '@/lib/content/heading-levels'
import type { SanityImageProps } from '@/lib/sanity/build-image-props'

export type TeamMember = {
  key: string
  name: string
  role: string | null
  portrait: SanityImageProps | null
}

type TeamMemberCardProps = {
  member: TeamMember
  headingLevel: SubheadingLevel
}

export function TeamMemberCard({ member, headingLevel: HeadingTag }: TeamMemberCardProps) {
  return (
    <article className="relative aspect-3/4 w-52 overflow-hidden rounded-card bg-surface text-inverse-ink sm:w-56 lg:w-60">
      {member.portrait && (
        <Image
          src={member.portrait.src}
          width={member.portrait.width}
          height={member.portrait.height}
          alt={member.portrait.alt}
          placeholder={member.portrait.placeholder}
          blurDataURL={member.portrait.blurDataURL}
          sizes="(min-width: 1024px) 15rem, (min-width: 640px) 14rem, 13rem"
          className="size-full object-cover"
        />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-inverse/70 via-inverse/30 to-transparent px-4 pt-4 pb-8 text-center">
        <HeadingTag className="text-sm font-medium">{member.name}</HeadingTag>
        {member.role && <p className="mt-0.5 text-xs text-inverse-ink/70">{member.role}</p>}
      </div>
    </article>
  )
}
