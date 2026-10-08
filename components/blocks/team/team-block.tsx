import { buildSectionClassName, isAnimatedBlock } from '@/lib/content/block-options'
import type { HeadingLevel } from '@/lib/content/heading-levels'
import { toSubheadingLevel } from '@/lib/content/heading-levels'
import { buildImageProps } from '@/lib/sanity/build-image-props'

import type { TeamMember } from '@/components/blocks/team/team-member-card'
import { TeamMemberCard } from '@/components/blocks/team/team-member-card'

import type { BlockOfType } from '@/types/content'

type TeamBlockProps = {
  block: BlockOfType<'teamBlock'>
  headingLevel: HeadingLevel
}

export function TeamBlock({ block, headingLevel: HeadingTag }: TeamBlockProps) {
  const subheadingLevel = toSubheadingLevel(HeadingTag)
  const members: TeamMember[] = block.members.map((member) => ({
    key: member._id,
    name: member.name,
    role: member.role,
    portrait: buildImageProps(member.avatar, { width: 520, aspectRatio: 3 / 4 }),
  }))
  const memberItems = members.map((member) => (
    <li key={member.key} className="shrink-0">
      <TeamMemberCard member={member} headingLevel={subheadingLevel} />
    </li>
  ))

  return (
    <section
      aria-labelledby={`${block._key}-heading`}
      className={buildSectionClassName(block.blockOptions)}
    >
      <div className="main-container">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <HeadingTag
            id={`${block._key}-heading`}
            className="text-headline font-medium text-balance"
          >
            {block.heading}
          </HeadingTag>
          {block.intro && <p className="mt-5 text-lg text-pretty opacity-70">{block.intro}</p>}
        </div>
      </div>
      {isAnimatedBlock(block.blockOptions) ? (
        <div className="group/marquee overflow-hidden motion-reduce:overflow-x-auto">
          <div className="flex w-max animate-marquee group-hover/marquee:animation-paused motion-reduce:animate-none">
            <ul className="flex gap-4 pr-4">{memberItems}</ul>
            <ul aria-hidden="true" inert className="flex gap-4 pr-4 motion-reduce:hidden">
              {memberItems}
            </ul>
          </div>
        </div>
      ) : (
        <ul className="flex snap-x gap-4 overflow-x-auto pb-4 *:snap-start">{memberItems}</ul>
      )}
    </section>
  )
}
