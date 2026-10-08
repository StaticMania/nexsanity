import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

type SanityDocument = { _id: string; _type: string; [field: string]: unknown }
type ImageValue = { _type: 'image'; _sanityAsset: string; alt: string; isDecorative: boolean }
type Reference = { _type: 'reference'; _ref: string; _key?: string }

const seedDirectory = dirname(fileURLToPath(import.meta.url))
let keyCounter = 0

const documents: SanityDocument[] = []

const clientLogos = [
  {
    id: 'client-halden',
    name: 'Halden Architects',
    mark: 'circle',
    websiteUrl: 'https://example.com',
  },
  {
    id: 'client-terra-kiln',
    name: 'Terra & Kiln',
    mark: 'arch',
    websiteUrl: 'https://example.com',
  },
  { id: 'client-paperline', name: 'Paperline', mark: 'lines', websiteUrl: 'https://example.com' },
  {
    id: 'client-quillstack',
    name: 'Quillstack',
    mark: 'diamond',
    websiteUrl: 'https://example.com',
  },
  { id: 'client-fernway', name: 'Fernway', mark: 'leaf', websiteUrl: 'https://example.com' },
  { id: 'client-orbitly', name: 'Orbitly', mark: 'orbit', websiteUrl: 'https://example.com' },
] as const

const logoMarks = {
  circle: '<circle cx="16" cy="16" r="11" fill="none" stroke="#111" stroke-width="3"/>',
  arch: '<path d="M6 28V16a10 10 0 0 1 20 0v12" fill="none" stroke="#111" stroke-width="3"/>',
  lines:
    '<path d="M6 9h20M6 16h20M6 23h13" stroke="#111" stroke-width="3" stroke-linecap="round"/>',
  diamond: '<path d="M16 4l12 12-12 12L4 16z" fill="#111"/>',
  leaf: '<path d="M6 26C6 12 14 6 27 5c-1 13-7 21-21 21z" fill="#111"/>',
  orbit:
    '<circle cx="16" cy="16" r="5" fill="#111"/><ellipse cx="16" cy="16" rx="13" ry="6" fill="none" stroke="#111" stroke-width="2.5"/>',
} as const

main()

function main(): void {
  writeClientLogos()
  addTaxonomy()
  addPeople()
  addClientsAndPlans()
  addCaseStudies()
  addPosts()
  addPages()
  addSettings()

  const ndjson = documents.map((document) => JSON.stringify(document)).join('\n')
  writeFileSync(join(seedDirectory, 'demo-content.ndjson'), `${ndjson}\n`)
  console.warn(`Wrote ${documents.length} documents to seed/demo-content.ndjson`)
}

function nextKey(): string {
  keyCounter += 1
  return `k${keyCounter.toString(36).padStart(4, '0')}`
}

function image(fileName: string, alt: string): ImageValue {
  return {
    _type: 'image',
    _sanityAsset: `image@file://./images/${fileName}`,
    alt,
    isDecorative: false,
  }
}

function reference(id: string, isArrayItem = false): Reference {
  return isArrayItem
    ? { _type: 'reference', _ref: id, _key: nextKey() }
    : { _type: 'reference', _ref: id }
}

function slug(current: string): { _type: 'slug'; current: string } {
  return { _type: 'slug', current }
}

function internalLink(label: string, documentId: string) {
  return {
    _type: 'link',
    _key: nextKey(),
    label,
    linkType: 'internal',
    internalReference: reference(documentId),
  }
}

function pathLink(label: string, path: string) {
  return { _type: 'link', _key: nextKey(), label, linkType: 'external', externalUrl: path }
}

function cta(
  label: string,
  link: ReturnType<typeof internalLink> | ReturnType<typeof pathLink>,
  variant: 'primary' | 'secondary' = 'primary',
) {
  return { _type: 'cta', _key: nextKey(), label, link: { ...link, _key: undefined }, variant }
}

function blockOptions(background: 'light' | 'muted' | 'dark' = 'light', spacing = 'default') {
  return { _type: 'blockOptions', background, spacing, hasAnimation: true }
}

function block(text: string, style: 'normal' | 'h2' | 'h3' | 'blockquote' = 'normal') {
  return {
    _type: 'block',
    _key: nextKey(),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: nextKey(), text, marks: [] }],
  }
}

function bullet(text: string) {
  return { ...block(text), listItem: 'bullet', level: 1 }
}

function writeClientLogos(): void {
  const logoDirectory = join(seedDirectory, 'images', 'logos')
  mkdirSync(logoDirectory, { recursive: true })
  for (const client of clientLogos) {
    const textWidth = client.name.length * 13 + 12
    const svg = [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${44 + textWidth}" height="32" viewBox="0 0 ${44 + textWidth} 32">`,
      logoMarks[client.mark],
      `<text x="42" y="22" font-family="Helvetica, Arial, sans-serif" font-size="20" font-weight="600" letter-spacing="-0.5" fill="#111">${client.name.replace('&', '&amp;')}</text>`,
      '</svg>',
    ].join('')
    writeFileSync(join(logoDirectory, `${client.id}.svg`), `${svg}\n`)
  }
}

function addTaxonomy(): void {
  documents.push(
    {
      _id: 'category-design',
      _type: 'category',
      title: 'Design',
      slug: slug('design'),
      description: 'Notes on visual systems, typography and interface craft.',
    },
    {
      _id: 'category-engineering',
      _type: 'category',
      title: 'Engineering',
      slug: slug('engineering'),
      description: 'How we build fast, accessible sites with Next.js and Sanity.',
    },
    {
      _id: 'category-growth',
      _type: 'category',
      title: 'Growth',
      slug: slug('growth'),
      description: 'Positioning, conversion and content that compounds.',
    },
  )
}

function addClientsAndPlans(): void {
  for (const client of clientLogos) {
    documents.push({
      _id: client.id,
      _type: 'client',
      name: client.name,
      websiteUrl: client.websiteUrl,
      logo: image(`logos/${client.id}.svg`, `${client.name} logo`),
    })
  }

  const planFeatures = [
    'Sanity Studio setup',
    'Responsive page templates',
    'Two rounds of design revisions',
    'Launch support',
    'Blog and case study collections',
    'Visual Editing and live preview',
    'Performance and SEO audit',
    'Dedicated design and engineering pod',
    'Monthly experiments and reporting',
    'Design system in Figma and code',
  ]

  const plans = [
    [
      'plan-launch',
      'Launch',
      'For early-stage teams',
      'For early teams that need a credible site, fast.',
      490000,
      410000,
      false,
      4,
    ],
    [
      'plan-scale',
      'Scale',
      'For growing teams',
      'For growing teams that publish every week and need room to experiment.',
      990000,
      840000,
      true,
      7,
    ],
    [
      'plan-partner',
      'Partner',
      'For established companies',
      'An embedded studio for ambitious product teams, with a dedicated pod and monthly experiments.',
      1890000,
      1590000,
      false,
      10,
    ],
  ] as const

  for (const [
    id,
    name,
    tagline,
    description,
    monthlyPriceCents,
    yearlyPriceCents,
    isFeatured,
    featureCount,
  ] of plans) {
    documents.push({
      _id: id,
      _type: 'pricingPlan',
      name,
      tagline,
      description,
      monthlyPriceCents,
      yearlyPriceCents,
      isFeatured,
      features: planFeatures.slice(0, featureCount),
      cta: cta(
        isFeatured ? 'Start with Scale' : 'Talk to us',
        internalLink('Contact', 'page-contact'),
      ),
    })
  }
}

type RichTextPart =
  | readonly ['h2' | 'h3' | 'p' | 'quote' | 'bullet' | 'number', string]
  | readonly ['image', string, string, string]

function richText(parts: readonly RichTextPart[]) {
  return parts.map((part) => {
    switch (part[0]) {
      case 'h2':
      case 'h3': {
        return block(part[1], part[0])
      }
      case 'quote': {
        return block(part[1], 'blockquote')
      }
      case 'bullet': {
        return bullet(part[1])
      }
      case 'number': {
        return { ...block(part[1]), listItem: 'number', level: 1 }
      }
      case 'image': {
        return {
          ...image(part[1], part[2]),
          _type: 'inlineImage',
          _key: nextKey(),
          caption: part[3],
        }
      }
      default: {
        return block(part[1])
      }
    }
  })
}

function addPeople(): void {
  documents.push(
    {
      _id: 'author-maya',
      _type: 'author',
      name: 'Maya Lindqvist',
      slug: slug('maya-lindqvist'),
      role: 'Design Director',
      avatar: image('author-1.jpg', 'Portrait of Maya Lindqvist'),
      bio: 'Maya leads design at NexSanity. Before joining, she spent eight years shaping brands and product interfaces for SaaS teams across Stockholm and Berlin. She cares about type, restraint and work that ages well.',
    },
    {
      _id: 'author-daniel',
      _type: 'author',
      name: 'Daniel Okafor',
      slug: slug('daniel-okafor'),
      role: 'Engineering Lead',
      avatar: image('author-2.jpg', 'Portrait of Daniel Okafor'),
      bio: 'Daniel builds the systems behind our sites, from content models in Sanity to performance budgets in Next.js. He has shipped more than sixty production sites and still reads every Lighthouse report.',
    },
    {
      _id: 'author-elena',
      _type: 'author',
      name: 'Elena Marsh',
      slug: slug('elena-marsh'),
      role: 'Founder & Strategy',
      avatar: image('author-3.jpg', 'Portrait of Elena Marsh'),
      bio: 'Elena founded NexSanity after a decade leading growth at product companies. She runs our discovery workshops and makes sure every page has a job to do.',
    },
  )

  const teamMembers = [
    [
      'author-priya',
      'Priya Raman',
      'Senior Product Designer',
      'author-4.jpg',
      'Priya designs the page-builder blocks our clients use every day, and tests each one with real editors before it ships.',
    ],
    [
      'author-james',
      'James Whitfield',
      'Senior Engineer',
      'author-5.jpg',
      'James looks after the Next.js side of every build, from caching and image pipelines to the last accessibility check.',
    ],
    [
      'author-amara',
      'Amara Nwosu',
      'Content Strategist',
      'author-6.jpg',
      'Amara turns interviews and sales calls into messaging, and writes the first draft of every page we design.',
    ],
    [
      'author-mateo',
      'Mateo Ruiz',
      'Motion Designer',
      'author-7.jpg',
      'Mateo choreographs the motion on our sites, keeping every animation quick, purposeful and kind to reduced-motion users.',
    ],
    [
      'author-mei',
      'Mei Lin Chen',
      'Head of Delivery',
      'author-8.jpg',
      'Mei Lin runs our weekly demos and keeps every project on time, on budget and free of status reports.',
    ],
    [
      'author-oliver',
      'Oliver Hart',
      'SEO & Performance Lead',
      'author-9.jpg',
      'Oliver audits search, speed and analytics before launch, then keeps an eye on them for months after.',
    ],
  ] as const

  for (const [id, name, role, fileName, bio] of teamMembers) {
    documents.push({
      _id: id,
      _type: 'author',
      name,
      slug: slug(name.toLowerCase().replaceAll(' ', '-')),
      role,
      avatar: image(fileName, `Portrait of ${name}`),
      bio,
    })
  }

  const testimonials = [
    [
      'testimonial-1',
      'NexSanity rebuilt our site in six weeks and our demo requests doubled the following quarter. The team never once needed a developer to publish a page.',
      'Aiko Tanaka',
      'Head of Marketing',
      'Paperline',
    ],
    [
      'testimonial-2',
      'They understood our brand better than we did. The new site finally feels like the product we have been building for five years.',
      'Grace Lim',
      'Co-founder',
      'Quillstack',
    ],
    [
      'testimonial-3',
      'Clear process, sharp design, and an engineering team that cares about performance as much as we do. Rare combination.',
      'Marco Alvarez',
      'CTO',
      'Orbitly',
    ],
    [
      'testimonial-4',
      'Our editors love the Studio. We ship landing pages for campaigns in an afternoon instead of a sprint.',
      'Hannah Becker',
      'Content Lead',
      'Fernway',
    ],
    [
      'testimonial-5',
      'The most thoughtful agency we have worked with. Every decision came with a reason, and the results followed.',
      'Richard Hale',
      'Managing Partner',
      'Halden Architects',
    ],
    [
      'testimonial-6',
      'Our online store went from an afterthought to our biggest channel. Conversion is up and returns are down.',
      'Tom Whitaker',
      'Founder',
      'Terra & Kiln',
    ],
  ] as const

  testimonials.forEach(([avatarFile, quote, authorName, authorRole, company], index) => {
    documents.push({
      _id: `testimonial-${index + 1}`,
      _type: 'testimonial',
      quote,
      authorName,
      authorRole,
      company,
      avatar: image(`${avatarFile}.jpg`, `Portrait of ${authorName}`),
    })
  })
}

function addCaseStudies(): void {
  const caseStudies = [
    {
      id: 'case-study-halden',
      title: 'A portfolio that sells the space before the first visit',
      slug: 'halden-architects',
      client: 'client-halden',
      cover: image('case-halden.jpg', 'Timber house cantilevered over a rocky coastline'),
      summary:
        'We gave Halden Architects an editorial portfolio their team updates weekly, turning project pages into their best source of qualified leads.',
      industry: 'Architecture',
      services: ['Brand refresh', 'Website design', 'Sanity CMS', 'Photography direction'],
      duration: '10 weeks',
      metrics: [
        ['+64%', 'qualified enquiries in six months'],
        ['1.1s', 'largest contentful paint on mobile'],
        ['3x', 'time spent on project pages'],
      ],
      testimonial: 'testimonial-5',
      publishedAt: '2026-08-12T09:00:00Z',
      gallery: [
        ['hero-arches.jpg', 'Sculptural arches in a warm terracotta corridor'],
        ['hero-sunlit-room.jpg', 'A sunlit room with a wooden table and linen curtains'],
        ['post-concrete.jpg', 'A white concrete building against a clear sky'],
      ],
      body: [
        ['h2', 'The challenge'],
        [
          'p',
          'Halden Architects had won two national awards in three years, yet their website still looked like the template they launched with in 2016. Project pages were a single gallery and a paragraph of text. Prospective clients told the partners they had almost not called because the site did not match the quality of the buildings.',
        ],
        [
          'p',
          'Updating anything meant emailing a freelancer and waiting a week. As a result, the newest and best work was missing entirely.',
        ],
        ['h2', 'Our approach'],
        [
          'p',
          'We spent the first two weeks in the studio, interviewing partners, project architects and three recent clients. One pattern stood out: people hired Halden for how they think about light and landscape, not for a style. The site needed to tell that story project by project.',
        ],
        ['bullet', 'A content model built around projects, places and ideas rather than pages'],
        ['bullet', 'An editorial layout system with full-bleed photography and long-form captions'],
        ['bullet', 'A light, typographic brand refresh that lets the buildings lead'],
        [
          'image',
          'hero-arches.jpg',
          'Sculptural arches in a warm terracotta corridor',
          'Project pages open with a single, full-bleed image and the idea behind the building.',
        ],
        ['h2', 'The solution'],
        [
          'p',
          'Every project is now a story with chapters: the site, the brief, the idea and the result. The team adds new projects in the Studio in under an hour, with Visual Editing showing each change in context before it goes live.',
        ],
        [
          'quote',
          'For the first time, the website explains why our buildings look the way they do.',
        ],
        ['h2', 'The results'],
        [
          'p',
          'Six months after launch, qualified enquiries were up 64 percent and the average visitor spent three times longer on project pages. Two of the studio’s largest commissions this year started with a contact form submission that quoted a project page word for word.',
        ],
        ['h3', 'What is next'],
        [
          'p',
          'We are now working with Halden on a journal of short essays about materials and craft, published monthly by the team itself.',
        ],
      ],
    },
    {
      id: 'case-study-terra-kiln',
      title: 'Turning a ceramics studio into a direct-to-consumer brand',
      slug: 'terra-and-kiln',
      client: 'client-terra-kiln',
      cover: image('case-terracotta.jpg', 'Terracotta vases and stools in soft window light'),
      summary:
        'A new storefront and story-led product pages helped Terra & Kiln grow online revenue while cutting returns.',
      industry: 'E-commerce & craft',
      services: ['E-commerce strategy', 'Product page design', 'Next.js storefront', 'Sanity CMS'],
      duration: '12 weeks',
      metrics: [
        ['+118%', 'online revenue year over year'],
        ['-22%', 'product returns'],
        ['4.8', 'average review score'],
      ],
      testimonial: 'testimonial-6',
      publishedAt: '2026-07-02T09:00:00Z',
      gallery: [
        ['hero-warm-vessels.jpg', 'Clay vessels and books arranged on a warm shelf'],
        ['hero-white-vase.jpg', 'A white ceramic vase on a cream backdrop'],
        ['cta-ceramics.jpg', 'Ceramic objects and marble on soft linen'],
      ],
      body: [
        ['h2', 'The challenge'],
        [
          'p',
          'Terra & Kiln makes every piece by hand in a small studio outside Bristol. Most of their sales came from markets and two stockists. Their online shop converted poorly, and one in five orders came back because customers were surprised by the size, weight or glaze.',
        ],
        ['h2', 'Our approach'],
        [
          'p',
          'We treated returns as a content problem. If customers knew exactly what they were buying, they would keep it. We photographed every piece in hands and in real rooms, measured everything, and wrote product copy with the makers.',
        ],
        ['number', 'Interview the makers and record the story behind each collection'],
        ['number', 'Design product pages that answer size, weight and care questions up front'],
        ['number', 'Build a fast storefront with Next.js and manage every product in Sanity'],
        [
          'image',
          'hero-warm-vessels.jpg',
          'Clay vessels and books on a warm shelf',
          'Collections are introduced with the story of how they were made.',
        ],
        ['h2', 'The solution'],
        [
          'p',
          'Each collection now opens with a short film still and a note from the maker. Product pages show the piece next to everyday objects for scale, list exact dimensions, and explain how the glaze changes with use.',
        ],
        [
          'quote',
          'Customers now tell us the pieces are exactly what they expected, which is the best review we could ask for.',
        ],
        ['h2', 'The results'],
        [
          'p',
          'Online revenue more than doubled in the first year and returns fell by 22 percent. The studio now sells more online than at markets, and has hired two new makers to keep up.',
        ],
      ],
    },
    {
      id: 'case-study-paperline',
      title: 'Repositioning Paperline for enterprise buyers',
      slug: 'paperline',
      client: 'client-paperline',
      cover: image('case-blueprints.jpg', 'Architectural drawings and stationery on a sunlit desk'),
      summary:
        'New messaging, a modular design system and a Sanity-powered site let Paperline launch campaigns without engineering help.',
      industry: 'B2B SaaS',
      services: ['Positioning', 'Design system', 'Website design', 'Next.js & Sanity build'],
      duration: '6 weeks',
      metrics: [
        ['2x', 'demo requests within one quarter'],
        ['6 weeks', 'from kickoff to launch'],
        ['40+', 'pages built by marketing since launch'],
      ],
      testimonial: 'testimonial-1',
      publishedAt: '2026-05-20T09:00:00Z',
      gallery: [
        ['bento-interface.jpg', 'A desktop computer showing a colourful product interface'],
        ['bento-wireframes.jpg', 'Hands sketching wireframes around a laptop'],
        ['bento-laptop.jpg', 'A laptop, notebook and coffee on a grey desk'],
      ],
      body: [
        ['h2', 'The challenge'],
        [
          'p',
          'Paperline started as a tool for small design teams and grew into a document platform used by companies with thousands of employees. The website still spoke to freelancers. Enterprise buyers could not find security information, and sales had to explain the product from scratch on every call.',
        ],
        [
          'p',
          'Every new landing page also needed an engineer, so campaigns launched weeks late or not at all.',
        ],
        ['h2', 'Our approach'],
        [
          'p',
          'We ran a one-week positioning sprint with sales, product and three customers. The new story moved from “a better editor” to “the system of record for every document your company publishes”.',
        ],
        ['bullet', 'A message hierarchy for buyers, champions and IT reviewers'],
        ['bullet', 'A design system of twelve page-builder blocks in Figma and code'],
        ['bullet', 'Dedicated pages for security, compliance and integrations'],
        [
          'image',
          'bento-wireframes.jpg',
          'Hands sketching wireframes around a laptop',
          'We designed every block in Figma and code at the same time, so nothing was lost in handoff.',
        ],
        ['h2', 'The solution'],
        [
          'p',
          'The new site launched six weeks after kickoff. Marketing builds campaign pages from the same blocks the home page uses, previews them live, and publishes without a ticket.',
        ],
        ['quote', 'We shipped more pages in the first month than in the previous year.'],
        ['h2', 'The results'],
        [
          'p',
          'Demo requests doubled within a quarter, and the average deal size grew as larger companies found the security pages on their own. The marketing team has now built more than forty pages without engineering help.',
        ],
      ],
    },
    {
      id: 'case-study-quillstack',
      title: 'Giving a writing tool the calm, confident brand it deserved',
      slug: 'quillstack',
      client: 'client-quillstack',
      cover: image('case-quillstack.jpg', 'An open notebook and pencil on a warm linen desk'),
      summary:
        'A new brand voice, product storytelling and a self-serve signup flow helped Quillstack turn curious visitors into paying teams.',
      industry: 'Productivity SaaS',
      services: ['Brand voice', 'Website design', 'Signup flow', 'Next.js & Sanity build'],
      duration: '8 weeks',
      metrics: [
        ['+71%', 'trial signups in the first quarter'],
        ['38%', 'trial-to-paid conversion'],
        ['0.9s', 'largest contentful paint on mobile'],
      ],
      testimonial: 'testimonial-2',
      publishedAt: '2026-09-18T09:00:00Z',
      gallery: [
        ['case-quillstack-notes.jpg', 'Hands writing notes in an open notebook beside a laptop'],
        ['bento-sketches.jpg', 'Interface sketches pinned to a studio wall'],
        ['hero-sunlit-desk.jpg', 'A sunlit desk with a laptop and a small plant'],
      ],
      body: [
        ['h2', 'The challenge'],
        [
          'p',
          'Quillstack helps teams write, review and publish long documents together. Users loved the product, but the website described it as “an AI-powered collaborative workspace”, which could mean anything. Visitors bounced from the home page, and the few who signed up rarely invited their team.',
        ],
        [
          'p',
          'The founders also felt the brand had drifted. Every launch added a new colour, a new tone of voice and a new illustration style.',
        ],
        ['h2', 'Our approach'],
        [
          'p',
          'We interviewed twelve customers about the moment Quillstack clicked for them. Almost all of them described the same feeling: finally, a quiet place to think. That became the centre of the brand.',
        ],
        ['bullet', 'A calm, editorial voice with a short glossary of words to use and avoid'],
        ['bullet', 'Product pages built around real documents customers write every week'],
        ['bullet', 'A signup flow that asks one question at a time and invites the team early'],
        [
          'image',
          'case-quillstack-notes.jpg',
          'Hands writing notes in an open notebook beside a laptop',
          'We built every page around a real document, so visitors could picture their own work.',
        ],
        ['h2', 'The solution'],
        [
          'p',
          'The new site opens with a single document being written, reviewed and published in under a minute. Each use case has its own page with templates people can open straight from the site. The marketing team publishes new templates from Sanity every week.',
        ],
        ['quote', 'It finally sounds like us on our best day, and our customers noticed first.'],
        ['h2', 'The results'],
        [
          'p',
          'Trial signups rose 71 percent in the first quarter. More importantly, teams that started from a template converted to paid at 38 percent, nearly twice the previous rate.',
        ],
        ['h3', 'What is next'],
        [
          'p',
          'We are helping Quillstack launch a public template gallery, written and curated by their own community.',
        ],
      ],
    },
    {
      id: 'case-study-fernway',
      title: 'A travel journal that books cabins while you read',
      slug: 'fernway',
      client: 'client-fernway',
      cover: image(
        'case-fernway.jpg',
        'A warm timber cabin interior with tall windows onto the forest',
      ),
      summary:
        'We rebuilt Fernway around stories from the places they rent, turning an editorial journal into their highest-converting booking channel.',
      industry: 'Travel & hospitality',
      services: ['Content strategy', 'Editorial design', 'Booking integration', 'Sanity CMS'],
      duration: '14 weeks',
      metrics: [
        ['+52%', 'direct bookings year over year'],
        ['31%', 'of bookings start on a journal story'],
        ['4 hrs', 'to publish a new destination guide'],
      ],
      testimonial: 'testimonial-4',
      publishedAt: '2026-06-10T09:00:00Z',
      gallery: [
        ['case-fernway-lake.jpg', 'A small cabin on a misty lake surrounded by pine trees'],
        ['hero-dried-branches.jpg', 'Dried branches in a stoneware vase by a window'],
        ['hero-sunlit-room.jpg', 'A sunlit room with a wooden table and linen curtains'],
      ],
      body: [
        ['h2', 'The challenge'],
        [
          'p',
          'Fernway rents forty small cabins across Scandinavia and Scotland. Most guests found them through booking platforms that took a large commission and hid the stories that made each place special. Fernway had a beautiful journal, but it lived on a separate blog with no way to book.',
        ],
        ['h2', 'Our approach'],
        [
          'p',
          'We merged the journal and the shop into one site. Every story is linked to the cabins it mentions, and every cabin page shows the stories written about it. Editors plan content around seasons, so we built the content model around them too.',
        ],
        ['number', 'Map every cabin to its region, season and nearby walks'],
        ['number', 'Design story pages with availability and prices beside the text'],
        ['number', 'Connect the booking engine so editors never touch prices or dates'],
        [
          'image',
          'case-fernway-lake.jpg',
          'A small cabin on a misty lake surrounded by pine trees',
          'Stories show live availability for every cabin they mention.',
        ],
        ['h2', 'The solution'],
        [
          'p',
          'Readers move from a story about autumn on a Norwegian lake straight into the cabin’s calendar. Destination guides are assembled from reusable blocks in the Studio, so the content team publishes a new guide in an afternoon.',
        ],
        [
          'quote',
          'Our journal used to be a nice extra. Now it is the reason people book with us directly.',
        ],
        ['h2', 'The results'],
        [
          'p',
          'Direct bookings grew 52 percent in a year, and almost a third of them now start on a journal story. Fernway has reduced its reliance on third-party platforms for the first time since launching.',
        ],
      ],
    },
    {
      id: 'case-study-orbitly',
      title: 'Explaining a complex developer platform in one scroll',
      slug: 'orbitly',
      client: 'client-orbitly',
      cover: image(
        'case-orbitly.jpg',
        'A calm office reception with timber panels and soft lighting',
      ),
      summary:
        'Interactive product stories and a documentation hub helped Orbitly win over engineering leaders without adding to the sales team.',
      industry: 'Developer tools',
      services: [
        'Product storytelling',
        'Interactive design',
        'Docs platform',
        'Next.js & Sanity build',
      ],
      duration: '11 weeks',
      metrics: [
        ['3.4x', 'self-serve signups from engineering leads'],
        ['-45%', 'time to first successful deploy'],
        ['98', 'Lighthouse performance score'],
      ],
      testimonial: 'testimonial-3',
      publishedAt: '2026-04-08T09:00:00Z',
      gallery: [
        ['case-orbitly-office.jpg', 'A bright open-plan office with plants and long desks'],
        ['bento-interface.jpg', 'A desktop computer showing a colourful product interface'],
        ['hero-lamp-desk.jpg', 'A desk lamp and laptop on a minimal wooden desk'],
      ],
      body: [
        ['h2', 'The challenge'],
        [
          'p',
          'Orbitly lets engineering teams ship background jobs and scheduled workflows without managing servers. The product is powerful, but the website tried to say everything at once. Engineering leaders, the people who sign the contract, left before they understood what Orbitly replaced.',
        ],
        [
          'p',
          'Documentation lived in a separate tool with its own design, search and navigation, so the journey from “interesting” to “working” broke halfway.',
        ],
        ['h2', 'Our approach'],
        [
          'p',
          'We sat in on twenty sales calls and noted every question engineers asked. The answers became a single scrolling story: the problem, the architecture, a live example and the cost, in that order.',
        ],
        ['bullet', 'One interactive diagram that builds the architecture as you scroll'],
        ['bullet', 'Copy written for engineering leaders first and developers second'],
        ['bullet', 'Documentation moved into the same Next.js app, managed in Sanity'],
        [
          'image',
          'bento-interface.jpg',
          'A desktop computer showing a colourful product interface',
          'The architecture diagram builds itself step by step as visitors scroll.',
        ],
        ['h2', 'The solution'],
        [
          'p',
          'Visitors now understand what Orbitly does before the first scroll ends, and can copy a working example into their terminal from the home page. The docs share the same components, search and design, and the developer relations team edits them in the Studio.',
        ],
        [
          'quote',
          'Prospects arrive on calls already knowing how it works. We just talk about scale.',
        ],
        ['h2', 'The results'],
        [
          'p',
          'Self-serve signups from engineering leads grew 3.4 times, and new users reached their first successful deploy 45 percent faster. The site scores 98 for performance on mobile despite the interactive diagram.',
        ],
      ],
    },
  ] as const

  for (const caseStudy of caseStudies) {
    documents.push({
      _id: caseStudy.id,
      _type: 'caseStudy',
      title: caseStudy.title,
      slug: slug(caseStudy.slug),
      client: reference(caseStudy.client),
      coverImage: caseStudy.cover,
      summary: caseStudy.summary,
      industry: caseStudy.industry,
      services: [...caseStudy.services],
      duration: caseStudy.duration,
      metrics: caseStudy.metrics.map(([value, label]) => ({
        _type: 'metric',
        _key: nextKey(),
        value,
        label,
      })),
      body: richText(caseStudy.body),
      gallery: caseStudy.gallery.map(([fileName, alt]) => ({
        ...image(fileName, alt),
        _key: nextKey(),
      })),
      testimonial: reference(caseStudy.testimonial),
      publishedAt: caseStudy.publishedAt,
    })
  }
}

function addPosts(): void {
  const posts = [
    {
      id: 'post-content-models',
      title: 'Designing content models editors actually enjoy',
      slug: 'content-models-editors-enjoy',
      excerpt: 'Good content models read like the way your team talks. Here is how we design them.',
      cover: image('post-dried-grass.jpg', 'Dried grasses in a ceramic vase on a sunlit shelf'),
      author: 'author-daniel',
      categories: ['category-engineering'],
      publishedAt: '2026-09-28T09:00:00Z',
      body: [
        [
          'p',
          'Most CMS projects fail quietly. The site launches, the team publishes for a month, and then everything goes back to the engineers because editing is slow, confusing or risky. The cause is almost always the content model.',
        ],
        ['h2', 'Start with the people who publish'],
        [
          'p',
          'Before we draw a single schema, we sit with the editors. We watch how they work today, collect the documents they already write, and note the words they use. If the marketing team calls them “customer stories”, the schema should not call them “case studies”.',
        ],
        ['bullet', 'Shadow two or three publishing sessions before you design anything'],
        ['bullet', 'Collect real content, not lorem ipsum, to test every field'],
        ['bullet', 'Write field descriptions in the team’s own language'],
        ['h2', 'Model the content, not the page'],
        [
          'p',
          'Pages change every quarter. Content lasts years. We model the durable things, such as people, products, customers and ideas, as documents, and use a small page builder to arrange them. That way a testimonial written once can appear on five pages and stay correct everywhere.',
        ],
        [
          'image',
          'post-dried-grass.jpg',
          'Dried grasses in a vase on a sunlit shelf',
          'Durable content lives in documents; pages just arrange it.',
        ],
        ['h2', 'Constraints are a feature'],
        [
          'p',
          'A small set of well-designed blocks beats an endless toolbox. Fewer choices mean faster publishing and a site that stays coherent over time. NexSanity ships with sixteen blocks, and most pages only need five of them.',
        ],
        [
          'quote',
          'Good systems disappear. Editors should think about the story, not the software.',
        ],
        ['h2', 'Validate early, in the Studio'],
        [
          'p',
          'Validation rules are documentation that cannot go out of date. Required alt text, sensible length limits and helpful warnings catch problems while the editor is still thinking about them, not after a page goes live.',
        ],
        ['h3', 'What we measure'],
        [
          'p',
          'We track time to publish, the number of pages shipped without engineering help, and how often editors ask for support. When those numbers move the right way, the content model is working.',
        ],
      ],
    },
    {
      id: 'post-typography',
      title: 'The quiet power of a two-typeface system',
      slug: 'two-typeface-system',
      excerpt:
        'Why we pair one expressive serif with one hard-working sans on almost every project.',
      cover: image('post-orchid.jpg', 'A white orchid in a minimal ceramic pot'),
      author: 'author-maya',
      categories: ['category-design'],
      publishedAt: '2026-09-15T09:00:00Z',
      body: [
        [
          'p',
          'Typography is the brand most people never notice. It sets the tone of every sentence before anyone reads a word. After years of experiments, we keep coming back to a simple system: one expressive serif, one hard-working sans.',
        ],
        ['h2', 'Give each typeface a job'],
        [
          'p',
          'The serif carries the voice. We use it for a single line in a headline, for pull quotes and for large numbers. The sans does the work: navigation, body copy, buttons and data. When each typeface has a clear job, the page feels considered instead of decorated.',
        ],
        ['bullet', 'Serif for moments: hero lines, quotes, big numbers'],
        ['bullet', 'Sans for everything people need to read quickly'],
        ['bullet', 'Never more than two families, and rarely more than three weights'],
        ['h2', 'Contrast beats variety'],
        [
          'p',
          'A headline that pairs a light serif line with a medium sans line has more character than five fonts fighting for attention. Contrast in style, size and weight creates hierarchy; variety just creates noise.',
        ],
        [
          'image',
          'post-orchid.jpg',
          'A white orchid in a minimal pot',
          'Restraint gives the few expressive moments room to breathe.',
        ],
        ['h2', 'Set it up once, in tokens'],
        [
          'p',
          'We define type sizes as tokens with their own line heights and letter spacing, so a display size always looks right. Editors never choose a font size; they choose a block, and the block knows how to set its type.',
        ],
        [
          'quote',
          'The best typography is the one nobody comments on, because everything simply reads well.',
        ],
        ['h2', 'Test with real copy'],
        [
          'p',
          'Long German compound words, short punchy headlines and two-line product names all behave differently. We test every display size with the client’s real copy before we sign off on the system.',
        ],
      ],
    },
    {
      id: 'post-positioning',
      title: 'Positioning before pixels',
      slug: 'positioning-before-pixels',
      excerpt: 'The best-performing pages we have shipped started with a sentence, not a sketch.',
      cover: image('post-gallery.jpg', 'A minimal gallery room with a single black artwork'),
      author: 'author-elena',
      categories: ['category-growth'],
      publishedAt: '2026-08-30T09:00:00Z',
      body: [
        [
          'p',
          'Clients often come to us asking for a redesign. What most of them need first is a clearer story. A beautiful page that says the wrong thing still converts badly.',
        ],
        ['h2', 'Write the sentence first'],
        [
          'p',
          'Before any design work, we write one sentence that explains who the product is for, what it replaces and why it is better. If the team cannot agree on that sentence, no layout will fix it.',
        ],
        ['number', 'Who is this for, specifically?'],
        ['number', 'What do they use today instead?'],
        ['number', 'What changes for them on day one?'],
        ['h2', 'Talk to customers, not just stakeholders'],
        [
          'p',
          'Internal teams describe the product by its features. Customers describe it by the problem it solved. We interview five to eight customers on every project and use their words in headlines wherever we can.',
        ],
        [
          'image',
          'post-gallery.jpg',
          'A minimal gallery room with a single artwork',
          'One clear idea, given room, is more persuasive than a wall of features.',
        ],
        [
          'quote',
          'If a customer said it, it belongs in a headline. If only the product team says it, it belongs in the docs.',
        ],
        ['h2', 'Design to the message hierarchy'],
        [
          'p',
          'Once the story is clear, the page structure almost designs itself. The hero states the promise, the next section proves it, and every block after that answers the next objection a buyer would raise.',
        ],
        ['h3', 'A quick test'],
        [
          'p',
          'Show the hero to someone outside the company for five seconds, then ask what the product does. If they cannot answer, go back to the sentence.',
        ],
      ],
    },
    {
      id: 'post-performance',
      title: 'A performance budget for marketing sites',
      slug: 'performance-budget-marketing-sites',
      excerpt: 'The numbers we hold ourselves to, and the habits that keep every page fast.',
      cover: image('post-concrete.jpg', 'A white concrete building against a clear sky'),
      author: 'author-daniel',
      categories: ['category-engineering', 'category-growth'],
      publishedAt: '2026-08-12T09:00:00Z',
      body: [
        [
          'p',
          'Speed is a feature, and for marketing sites it is often the most important one. A slow page loses visitors before they read the headline. We set a performance budget on day one and check it on every pull request.',
        ],
        ['h2', 'The numbers we hold ourselves to'],
        ['bullet', 'Largest contentful paint under 1.5 seconds on a mid-range phone'],
        ['bullet', 'Cumulative layout shift below 0.05'],
        ['bullet', 'Under 150 KB of JavaScript on the home page'],
        ['bullet', 'A Lighthouse performance score of 95 or more'],
        ['h2', 'Server first, client last'],
        [
          'p',
          'With the Next.js App Router, almost everything renders on the server. We only add client JavaScript at the leaves: a carousel, a toggle, a form. Animations load with the blocks that use them, and turn off entirely when a block does not need them.',
        ],
        [
          'image',
          'post-concrete.jpg',
          'A white concrete building against a clear sky',
          'Fewer moving parts, faster pages.',
        ],
        ['h2', 'Images do most of the work'],
        [
          'p',
          'Images are usually the heaviest thing on a page. Sanity’s image pipeline serves modern formats at exactly the size each layout needs, with a blurred placeholder while the full image loads.',
        ],
        ['quote', 'Every kilobyte has to earn its place on the page.'],
        ['h2', 'Make it a habit'],
        [
          'p',
          'Budgets only work if someone checks them. We run Lighthouse in CI, review bundle sizes in every pull request, and share a short performance report with clients each month.',
        ],
      ],
    },
    {
      id: 'post-motion',
      title: 'Motion that earns its place',
      slug: 'motion-that-earns-its-place',
      excerpt: 'Animation should explain, not decorate. A short guide to restraint.',
      cover: image('post-bowl.jpg', 'A single ceramic bowl on a pale surface'),
      author: 'author-maya',
      categories: ['category-design'],
      publishedAt: '2026-07-25T09:00:00Z',
      body: [
        [
          'p',
          'Animation is easy to add and hard to get right. Done well, it guides attention and makes an interface feel alive. Done badly, it slows people down and makes them feel sick.',
        ],
        ['h2', 'Ask what the motion explains'],
        [
          'p',
          'Every animation should answer a question. Where did this come from? What changed? What can I do next? If it does not answer one, it is decoration, and decoration has a cost.',
        ],
        ['bullet', 'Reveal content in reading order, so the eye knows where to go'],
        [
          'bullet',
          'Use movement to show cause and effect, like a price spinning when you switch plans',
        ],
        ['bullet', 'Keep durations short, usually under 600 milliseconds'],
        ['h2', 'Respect reduced motion'],
        [
          'p',
          'Some people get dizzy or distracted by movement. Every animation in NexSanity checks the reduced-motion setting and falls back to a calm, static version. It is not optional, and it is not hard.',
        ],
        [
          'image',
          'post-bowl.jpg',
          'A single ceramic bowl on a pale surface',
          'Stillness is a design choice too.',
        ],
        ['quote', 'The best motion feels inevitable. You only notice it when it is missing.'],
        ['h2', 'Let editors turn it off'],
        [
          'p',
          'Every block has an animation switch in the Studio. Editors can keep a page calm for a sensitive announcement, and the block then loads without any animation code at all.',
        ],
      ],
    },
    {
      id: 'post-studio-notes',
      title: 'Notes from our studio: how we run a project',
      slug: 'how-we-run-a-project',
      excerpt: 'From kickoff to launch in six weeks, without the chaos.',
      cover: image(
        'post-studio-wall.jpg',
        'A studio desk with sketches pinned to the wall behind a laptop',
      ),
      author: 'author-elena',
      categories: ['category-growth', 'category-design'],
      publishedAt: '2026-07-08T09:00:00Z',
      body: [
        [
          'p',
          'People are often surprised that we launch most sites in six to eight weeks. There is no secret. We keep teams small, decisions fast and work visible from the first day.',
        ],
        ['h2', 'Week one: discovery'],
        [
          'p',
          'We interview stakeholders and customers, audit existing content and agree on the one sentence the site must communicate. By Friday, everyone has read the same short brief.',
        ],
        ['h2', 'Weeks two and three: design'],
        [
          'p',
          'We design the most important page first, usually the home page, then extract a small set of blocks from it. Every block is designed and built at the same time, so there is no handoff gap.',
        ],
        [
          'image',
          'post-studio-wall.jpg',
          'A studio desk with sketches pinned to the wall',
          'Sketches stay on the wall until launch day.',
        ],
        ['h2', 'Weeks four and five: build and content'],
        ['number', 'Build every block in Next.js and Sanity'],
        ['number', 'Move real content into the Studio with the client’s team'],
        ['number', 'Review pages together in Visual Editing every Thursday'],
        ['h2', 'Week six: launch and learn'],
        [
          'p',
          'We launch on a Tuesday, never a Friday. Then we watch the numbers, fix the small things and train the team to run the site without us.',
        ],
        ['quote', 'Weekly demos beat status reports. Everyone sees the real thing, every week.'],
        ['h3', 'After launch'],
        [
          'p',
          'Most clients stay on a light monthly partnership. We run experiments, build new pages and keep the site fast as it grows.',
        ],
      ],
    },
    {
      id: 'post-visual-editing',
      title: 'Visual Editing changed how our clients publish',
      slug: 'visual-editing-changed-publishing',
      excerpt:
        'Click any text on the page, edit it in place, and see the result before it goes live.',
      cover: image('hero-sunlit-desk.jpg', 'A plant and laptop on a desk in afternoon light'),
      author: 'author-daniel',
      categories: ['category-engineering'],
      publishedAt: '2026-06-24T09:00:00Z',
      body: [
        [
          'p',
          'For years, editing a website meant filling in a form and hoping the page looked right afterwards. Visual Editing in Sanity removes that guesswork. Editors see the real page, click the thing they want to change, and the right field opens beside it.',
        ],
        ['h2', 'Why forms alone were never enough'],
        [
          'p',
          'A form shows fields; a page shows meaning. When editors cannot see how a headline wraps or how an image crops, they either publish mistakes or ask a developer to check. Both slow everything down.',
        ],
        ['bullet', 'Headlines that broke awkwardly on mobile'],
        ['bullet', 'Images cropped in ways nobody expected'],
        ['bullet', 'Pages published with blocks in the wrong order'],
        ['h2', 'How it works in NexSanity'],
        [
          'p',
          'Every page is wired to the Presentation tool. Open a page in the Studio, and the live site appears next to the document. Draft changes show up instantly, and nothing goes public until someone presses publish.',
        ],
        [
          'image',
          'hero-sunlit-desk.jpg',
          'A plant and laptop on a desk in afternoon light',
          'Editors work on the real page, not an abstract form.',
        ],
        ['h2', 'What changed for our clients'],
        [
          'p',
          'Teams that used to batch changes into a weekly release now publish small improvements every day. Review cycles got shorter because everyone looks at the same page instead of describing it in comments.',
        ],
        [
          'quote',
          'Our editors stopped asking “what will this look like?” because they can simply see it.',
        ],
        ['h2', 'A few practical tips'],
        ['number', 'Give every block a clear preview title in the Studio'],
        ['number', 'Keep a separate, read-only token for previews'],
        ['number', 'Train editors on drafts and releases in the first week'],
      ],
    },
    {
      id: 'post-headlines',
      title: 'Writing headlines that sell without shouting',
      slug: 'headlines-that-sell-without-shouting',
      excerpt:
        'Clear beats clever. A practical guide to headlines for product and studio websites.',
      cover: image('hero-dried-branches.jpg', 'Dried branches in copper vessels'),
      author: 'author-elena',
      categories: ['category-growth'],
      publishedAt: '2026-06-10T09:00:00Z',
      body: [
        [
          'p',
          'Most visitors read the headline, glance at the image, and decide whether to scroll. That gives a headline about three seconds to do its job. Shouting does not help; clarity does.',
        ],
        ['h2', 'Say what changes for the reader'],
        [
          'p',
          'Strong headlines describe an outcome the reader wants, in words they already use. “Launch campaign pages without engineering” beats “The future of content” every time.',
        ],
        ['bullet', 'Lead with the outcome, not the feature'],
        ['bullet', 'Use the customer’s vocabulary, not internal jargon'],
        ['bullet', 'Keep it under twelve words where you can'],
        ['h2', 'Pair a feeling with a fact'],
        [
          'p',
          'We often split a hero headline into two lines: one that sets a tone, set in a serif, and one that states the promise plainly. The first line earns attention; the second earns the scroll.',
        ],
        [
          'image',
          'hero-dried-branches.jpg',
          'Dried branches in copper vessels',
          'A calm, confident tone usually outperforms urgency.',
        ],
        ['h2', 'Test with people, not opinions'],
        [
          'p',
          'Internal debates about headlines rarely end well. Instead, we show two or three options to five people from the target audience and ask them to explain what the company does. The headline they understand fastest wins.',
        ],
        ['quote', 'If you need an exclamation mark, the sentence is not doing its job.'],
        ['h2', 'Support the headline below the fold'],
        [
          'p',
          'A good headline makes a promise. The sections below must keep it, with proof, examples and numbers. Otherwise even the best headline turns into a bounce.',
        ],
      ],
    },
    {
      id: 'post-design-systems',
      title: 'Building a design system clients can actually extend',
      slug: 'design-systems-clients-can-extend',
      excerpt:
        'Design systems fail when only the agency understands them. Here is how we hand them over.',
      cover: image('hero-walnut-desk.jpg', 'A walnut desk and chair in a warm, minimal study'),
      author: 'author-maya',
      categories: ['category-design', 'category-engineering'],
      publishedAt: '2026-05-27T09:00:00Z',
      body: [
        [
          'p',
          'Every studio promises a design system. Few clients can use one six months after launch. The problem is rarely the components; it is that the system was designed for the people who built it, not the people who inherit it.',
        ],
        ['h2', 'Fewer, better parts'],
        [
          'p',
          'We design a small set of blocks that cover every real page, then stop. Twelve to sixteen well-documented blocks are easier to learn than sixty clever ones, and they keep the site consistent as it grows.',
        ],
        ['h2', 'One source of truth for tokens'],
        [
          'p',
          'Colours, type sizes, spacing and radii live in one place in code, with matching styles in Figma. When a brand colour changes, it changes everywhere at once, including in the Studio theme settings.',
        ],
        ['bullet', 'Name tokens by role, such as canvas, ink and accent, not by colour'],
        ['bullet', 'Give every type size its own line height and spacing'],
        ['bullet', 'Keep dark mode in the same tokens, not in separate classes'],
        [
          'image',
          'hero-walnut-desk.jpg',
          'A walnut desk and chair in a warm study',
          'A system should feel like a well-organised room: everything has a place.',
        ],
        ['h2', 'Document decisions, not just components'],
        [
          'p',
          'A screenshot of a button tells you what it looks like. A sentence explaining when to use the secondary style tells you how to think. We write short decision notes for every block and keep them next to the code.',
        ],
        [
          'quote',
          'A design system is a set of decisions the next person does not have to make again.',
        ],
        ['h2', 'Hand over in person'],
        [
          'p',
          'Before we leave, we pair with the client’s designers and developers to build a new page together using only the system. Whatever slows them down becomes our final round of fixes.',
        ],
      ],
    },
  ] as const

  for (const post of posts) {
    documents.push({
      _id: post.id,
      _type: 'post',
      title: post.title,
      slug: slug(post.slug),
      excerpt: post.excerpt,
      coverImage: post.cover,
      author: reference(post.author),
      categories: post.categories.map((categoryId) => reference(categoryId, true)),
      publishedAt: post.publishedAt,
      body: richText(post.body),
      seo: { _type: 'seo', isIndexable: true },
    })
  }
}

function addPages(): void {
  const contactLink = internalLink('Contact', 'page-contact')
  const faqQuestions = [
    [
      'How long does a project take?',
      'Most sites launch in six to eight weeks. Larger engagements run in two-week sprints so you see progress from the first week.',
    ],
    [
      'Can my team edit the site without a developer?',
      'Yes. Every page is built from blocks in Sanity Studio, with live preview, so your team can publish on their own.',
    ],
    [
      'Do you work with existing brands?',
      'Often. We can evolve an existing identity or build a new one, and we always start from the content you already have.',
    ],
    [
      'What happens after launch?',
      'Every plan includes launch support. Many clients stay on a monthly partnership for experiments and new pages.',
    ],
  ] as const
  const faqBlock = (background: 'light' | 'muted' = 'light') => ({
    _type: 'faqBlock',
    _key: nextKey(),
    heading: 'Questions, answered',
    questions: faqQuestions.map(([question, answer]) => ({
      _type: 'faqItem',
      _key: nextKey(),
      question,
      answer,
    })),
    blockOptions: blockOptions(background),
  })
  const ctaBlock = (background: 'light' | 'muted' = 'muted') => ({
    _type: 'ctaBlock',
    _key: nextKey(),
    heading: 'Let’s build something people remember',
    text: 'Tell us about your product and we will reply within one business day with next steps.',
    ctas: [
      cta('Start a project', contactLink),
      cta('See pricing', internalLink('Pricing', 'page-pricing'), 'secondary'),
    ],
    images: [
      ['cta-ceramics.jpg', 'Ceramic objects and marble on soft linen'],
      ['hero-white-vase.jpg', 'A white ceramic vase on a cream backdrop'],
      ['hero-warm-vessels.jpg', 'Clay vessels and books on a warm shelf'],
      ['case-terracotta.jpg', 'Terracotta vases in soft window light'],
      ['post-orchid.jpg', 'A white orchid in a minimal pot'],
    ].map(([fileName = '', alt = '']) => ({ ...image(fileName, alt), _key: nextKey() })),
    blockOptions: blockOptions(background),
  })
  const pricingBlock = (heading: string, background: 'light' | 'muted' = 'muted') => ({
    _type: 'pricingBlock',
    _key: nextKey(),
    heading,
    intro: 'Clear, fixed pricing. Switch to yearly billing to save on a monthly partnership.',
    plans: ['plan-launch', 'plan-scale', 'plan-partner'].map((planId) => reference(planId, true)),
    hasBillingToggle: true,
    blockOptions: blockOptions(background),
  })
  const testimonialsBlock = (background: 'light' | 'muted' = 'muted') => ({
    _type: 'testimonialsBlock',
    _key: nextKey(),
    heading: 'Teams who trusted us with their story',
    testimonials: [1, 2, 3, 4, 5, 6].map((number) => reference(`testimonial-${number}`, true)),
    blockOptions: blockOptions(background),
  })
  const statsBlock = () => ({
    _type: 'statsBlock',
    _key: nextKey(),
    heading: 'Small studio, measurable results',
    stats: [
      ['120+', 'sites launched'],
      ['98%', 'client retention'],
      ['3.2x', 'average conversion lift'],
      ['14', 'days to first prototype'],
    ].map(([value, label]) => ({ _type: 'stat', _key: nextKey(), value, label })),
    blockOptions: blockOptions('dark'),
  })

  const servicesBlock = (background: 'light' | 'muted' = 'muted') => ({
    _type: 'servicesBlock',
    _key: nextKey(),
    heading: 'Services built for SaaS teams',
    intro: 'Pick a single service or the whole studio. Every engagement is run by senior people.',
    services: (
      [
        ['Brand strategy', 'Positioning and messaging'],
        ['Website design', 'Editorial, accessible UI'],
        ['Sanity development', 'Content models and Studio'],
        ['Next.js engineering', 'Fast, SEO-ready builds'],
        ['Growth partnership', 'Experiments and new pages'],
      ] as const
    ).map(([title, label]) => ({
      _type: 'service',
      _key: nextKey(),
      title,
      label,
      link: { ...internalLink(title, 'page-contact'), _key: undefined },
    })),
    blockOptions: blockOptions(background),
  })
  const processBlock = (background: 'light' | 'muted' = 'muted') => ({
    _type: 'processBlock',
    _key: nextKey(),
    heading: 'From first call to launch in six weeks',
    intro: 'A simple, visible process. You see real work every Thursday, never a status report.',
    steps: (
      [
        [
          'Discover',
          'Interviews with your team and customers, a content audit, and the one sentence your site must say.',
          'bento-sketches.jpg',
          'Logo sketches and glasses on a white desk',
        ],
        [
          'Design',
          'We design the most important page first, then turn it into a small set of reusable blocks.',
          'bento-wireframes.jpg',
          'Hands sketching wireframes around a laptop',
        ],
        [
          'Build',
          'Every block is built in Next.js and Sanity as it is designed, with your real content from day one.',
          'bento-laptop.jpg',
          'A laptop, notebook and coffee on a grey desk',
        ],
        [
          'Launch and grow',
          'We launch on a Tuesday, train your team, and keep improving the site with monthly experiments.',
          'hero-lamp-desk.jpg',
          'A mushroom lamp and laptop on a curved desk',
        ],
      ] as const
    ).map(([title, description, fileName, alt]) => ({
      _type: 'processStep',
      _key: nextKey(),
      title,
      description,
      image: image(fileName, alt),
    })),
    blockOptions: blockOptions(background),
  })
  const teamBlock = (background: 'light' | 'muted' = 'muted') => ({
    _type: 'teamBlock',
    _key: nextKey(),
    heading: 'The people behind the work',
    intro:
      'A small, senior team. The people you meet on the first call are the people who build your site.',
    members: [
      'author-elena',
      'author-maya',
      'author-daniel',
      'author-priya',
      'author-james',
      'author-amara',
      'author-mateo',
      'author-mei',
      'author-oliver',
    ].map((authorId) => reference(authorId, true)),
    blockOptions: blockOptions(background),
  })
  const latestPostsBlock = (background: 'light' | 'muted' = 'light') => ({
    _type: 'latestPostsBlock',
    _key: nextKey(),
    heading: 'Notes from the studio',
    intro:
      'What we are learning about design, engineering and growth, written by the people doing the work.',
    blockOptions: blockOptions(background),
  })

  documents.push({
    _id: 'page-home',
    _type: 'page',
    title: 'Home',
    slug: slug('home'),
    seo: {
      _type: 'seo',
      metaTitle: 'NexSanity — Design and engineering studio',
      metaDescription:
        'NexSanity designs and builds websites for ambitious SaaS teams, edited entirely in Sanity.',
      isIndexable: true,
    },
    pageBuilder: [
      {
        _type: 'heroBlock',
        _key: nextKey(),
        eyebrowLine: 'Thoughtful websites,',
        headline: 'built to grow with you',
        subheadline:
          'NexSanity is a design and engineering studio for SaaS teams. We build fast, beautiful sites your marketing team can run on its own.',
        ctas: [
          cta('Start a project', contactLink),
          cta('See our work', pathLink('Customers', '/customers'), 'secondary'),
        ],
        carouselImages: (
          [
            ['hero-walnut-desk.jpg', 'A walnut desk and chair in a warm, minimal study'],
            ['hero-white-vase.jpg', 'A white ceramic vase on a cream backdrop'],
            ['hero-lamp-desk.jpg', 'A mushroom lamp and laptop on a curved desk'],
            ['hero-warm-vessels.jpg', 'Clay vessels and books arranged on a warm shelf'],
            ['hero-sunlit-room.jpg', 'A sunlit room with a wooden table and linen curtains'],
            ['hero-arches.jpg', 'Sculptural arches in a terracotta corridor'],
            ['hero-dried-branches.jpg', 'Dried branches in copper vessels'],
            ['hero-sunlit-desk.jpg', 'A plant and laptop on a desk in afternoon light'],
          ] as const
        ).map(([fileName, alt]) => ({ ...image(fileName, alt), _key: nextKey() })),
        hasAutoScroll: true,
        blockOptions: blockOptions('light', 'compact'),
      },
      {
        _type: 'featureColumnsBlock',
        _key: nextKey(),
        heading: 'What we do',
        isHeadingVisible: false,
        features: [
          [
            'Strategy',
            'Positioning, messaging and information architecture grounded in what your buyers actually ask.',
          ],
          [
            'Design',
            'Editorial, accessible interfaces with a design system your team can extend without us.',
          ],
          [
            'Engineering',
            'Next.js and Sanity, tuned for speed, SEO and an editing experience people enjoy.',
          ],
        ].map(([title, description]) => ({
          _type: 'feature',
          _key: nextKey(),
          title,
          description,
        })),
        blockOptions: blockOptions('light', 'tight'),
      },
      servicesBlock('muted'),
      {
        _type: 'bentoGridBlock',
        _key: nextKey(),
        heading: 'Everything your site needs, from one studio',
        intro:
          'From the first workshop to the hundredth page, we design the system and hand you the keys.',
        cards: [
          {
            title: 'Brand and art direction',
            text: 'Typography, colour and photography that make your product unmistakable.',
            image: image('bento-sketches.jpg', 'Logo sketches and glasses on a white desk'),
            imageStyle: 'cover',
            tone: 'dark',
            size: 'wide',
          },
          {
            title: 'Product storytelling',
            text: 'Pages that explain complex products in plain language, so buyers get it in one scroll.',
            tone: 'muted',
            size: 'narrow',
          },
          {
            title: 'Design systems',
            text: 'Components in Figma and code, documented and ready to scale with your team.',
            tone: 'tan',
            size: 'narrow',
          },
          {
            title: 'Editing your team will love',
            text: 'Visual Editing, live preview and a page builder that keeps everything on brand.',
            image: image(
              'bento-interface.jpg',
              'A desktop computer showing a colourful online store',
            ),
            imageStyle: 'inset',
            tone: 'accent',
            size: 'wide',
          },
        ].map((card) => ({ _type: 'bentoCard', _key: nextKey(), ...card })),
        blockOptions: blockOptions('light'),
      },
      processBlock('muted'),
      statsBlock(),
      {
        _type: 'resultsBlock',
        _key: nextKey(),
        heading: 'Proven results',
        intro: 'A few of the teams we have helped launch, grow and stand out.',
        caseStudies: ['case-study-quillstack', 'case-study-halden', 'case-study-terra-kiln'].map(
          (caseStudyId) => reference(caseStudyId, true),
        ),
        blockOptions: blockOptions('light'),
      },
      teamBlock('muted'),
      testimonialsBlock('light'),
      pricingBlock('Simple plans for every stage', 'muted'),
      latestPostsBlock('light'),
      faqBlock('muted'),
      ctaBlock('light'),
    ],
  })

  documents.push({
    _id: 'page-about',
    _type: 'page',
    title: 'About',
    slug: slug('about'),
    seo: {
      _type: 'seo',
      metaDescription: 'A small, senior studio of designers and engineers.',
      isIndexable: true,
    },
    pageBuilder: [
      {
        _type: 'heroBlock',
        _key: nextKey(),
        layout: 'showcase',
        proofLabel: 'Trusted by 60+ product teams',
        proofAvatars: [1, 2, 3].map((index) => ({
          ...image(`testimonial-${index}.jpg`, ''),
          isDecorative: true,
          _key: nextKey(),
        })),
        eyebrowLine: 'Small studio.',
        headline: 'Serious about craft.',
        subheadline:
          'We are designers, engineers and strategists who believe the best websites are built with, not for, the people who run them.',
        ctas: [
          cta('Work with us', contactLink),
          cta('See our work', pathLink('See our work', '/customers'), 'secondary'),
        ],
        floatingStats: (
          [
            ['12', 'Senior specialists', 'author-4.jpg', 'Portrait of Priya Raman'],
            [
              '60+',
              'Sites launched',
              'bento-laptop.jpg',
              'A laptop, notebook and coffee on a desk',
            ],
          ] as const
        ).map(([value, label, fileName, alt]) => ({
          _type: 'floatingStat',
          _key: nextKey(),
          value,
          label,
          image: image(fileName, alt),
        })),
        showcaseCards: (
          [
            [
              '94% client retention',
              'Most clients come back for a second project',
              'author-3.jpg',
              'Portrait of Elena Marsh',
            ],
            [
              'Weekly demos, never status reports',
              'How every NexSanity project runs',
              'bento-wireframes.jpg',
              'Hands sketching wireframes around a laptop',
            ],
            [
              '60+ sites shipped',
              'For product teams on two continents',
              'author-2.jpg',
              'Portrait of Daniel Okafor',
            ],
          ] as const
        ).map(([title, caption, fileName, alt]) => ({
          _type: 'showcaseCard',
          _key: nextKey(),
          title,
          caption,
          image: image(fileName, alt),
        })),
        blockOptions: blockOptions('light'),
      },
      servicesBlock('muted'),
      processBlock('light'),
      statsBlock(),
      teamBlock('muted'),
      testimonialsBlock('light'),
      ctaBlock('muted'),
    ],
  })

  documents.push({
    _id: 'page-pricing',
    _type: 'page',
    title: 'Pricing',
    slug: slug('pricing'),
    seo: {
      _type: 'seo',
      metaDescription: 'Fixed-price plans for launching and growing your site.',
      isIndexable: true,
    },
    pageBuilder: [
      pricingBlock('Pricing that scales with you', 'light'),
      faqBlock('muted'),
      ctaBlock('light'),
    ],
  })

  documents.push({
    _id: 'page-contact',
    _type: 'page',
    title: 'Contact',
    slug: slug('contact'),
    seo: { _type: 'seo', metaDescription: 'Tell us about your project.', isIndexable: true },
    pageBuilder: [
      {
        _type: 'contactFormBlock',
        _key: nextKey(),
        heading: 'Tell us about your project',
        intro:
          'Share a few details and we will get back to you within one business day. Prefer email? Write to hello@example.com.',
        contactDescription: 'Say hello, or book a call. We reply within one business day.',
        contactPhone: '+1 (555) 014-2398',
        contactEmail: 'hello@example.com',
        contactAddress: '214 Mercer Street, New York, NY',
        successMessage: 'Thanks! We’ll get back to you within one business day.',
        blockOptions: blockOptions('light'),
      },
      faqBlock('muted'),
    ],
  })

  for (const [id, title, pageSlug] of [
    ['page-privacy', 'Privacy policy', 'privacy'],
    ['page-terms', 'Terms of service', 'terms'],
  ] as const) {
    documents.push({
      _id: id,
      _type: 'page',
      title,
      slug: slug(pageSlug),
      seo: { _type: 'seo', isIndexable: false },
      pageBuilder: [
        {
          _type: 'richTextBlock',
          _key: nextKey(),
          heading: title,
          body: [
            block(
              'This page is demo content for the NexSanity template. Replace it with your own policy before you launch.',
            ),
            block('Information we collect', 'h2'),
            block(
              'We only collect the information you choose to send us through the contact form: your name, email address, company and message.',
            ),
            block('How we use it', 'h2'),
            block(
              'We use your details to reply to your enquiry. We never sell your information or share it with third parties for marketing.',
            ),
            block('Contact', 'h2'),
            block('Questions about this page? Email hello@example.com.'),
          ],
          blockOptions: blockOptions('light'),
        },
      ],
    })
  }
}

function addSettings(): void {
  documents.push({
    _id: 'settings',
    _type: 'settings',
    siteTitle: 'NexSanity',
    primaryNavigation: [
      internalLink('About', 'page-about'),
      pathLink('Customers', '/customers'),
      pathLink('Blog', '/blog'),
      internalLink('Pricing', 'page-pricing'),
      internalLink('Contact', 'page-contact'),
    ],
    secondaryNavigation: [
      internalLink('Privacy', 'page-privacy'),
      internalLink('Terms', 'page-terms'),
    ],
    headerCta: {
      ...cta('Start a project', internalLink('Contact', 'page-contact')),
      _key: undefined,
    },
    footerTagline: 'A design and engineering studio building websites for ambitious SaaS teams.',
    footerColumns: [
      {
        _type: 'footerColumn',
        _key: nextKey(),
        title: 'Studio',
        links: [
          internalLink('About', 'page-about'),
          pathLink('Customers', '/customers'),
          internalLink('Pricing', 'page-pricing'),
        ],
      },
      {
        _type: 'footerColumn',
        _key: nextKey(),
        title: 'Journal',
        links: [
          pathLink('All posts', '/blog'),
          internalLink('Design', 'category-design'),
          internalLink('Engineering', 'category-engineering'),
        ],
      },
      {
        _type: 'footerColumn',
        _key: nextKey(),
        title: 'Contact',
        links: [
          internalLink('Start a project', 'page-contact'),
          pathLink('hello@example.com', 'mailto:hello@example.com'),
        ],
      },
    ],
    socialLinks: [
      { _type: 'socialLink', _key: nextKey(), platform: 'X', url: 'https://x.com' },
      {
        _type: 'socialLink',
        _key: nextKey(),
        platform: 'LinkedIn',
        url: 'https://www.linkedin.com',
      },
      { _type: 'socialLink', _key: nextKey(), platform: 'Dribbble', url: 'https://dribbble.com' },
    ],
    defaultSeo: {
      _type: 'seo',
      metaTitle: 'NexSanity',
      metaDescription:
        'NexSanity designs and builds websites for ambitious SaaS teams, edited entirely in Sanity.',
      isIndexable: true,
    },
    theme: { colorScheme: 'light' },
  })
}
