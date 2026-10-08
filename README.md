# NexSanity

An open-source Next.js and Sanity template for SaaS and studio websites. Every page is built and edited in Sanity Studio, with Visual Editing, live preview and a page builder of twelve blocks.

- **Next.js 16** (App Router, Server Components) and **Sanity 6** with the Studio embedded at `/studio`
- **Page builder** with Hero (curved GSAP carousel), Feature columns, Bento grid, Results, Logo cloud, Stats, Testimonials, Pricing, FAQ, CTA, Rich text and Contact form
- **Blog** with categories and pagination, and **customer stories**
- **Visual Editing** and the Live Content API through `next-sanity`
- **Types from GROQ** with Sanity TypeGen, so no content type is written by hand
- **Theme from the Studio**: light, dark or system colour scheme and brand colours, all as CSS variables
- **Contact form** on a Server Action, rate limited with Upstash and delivered with Resend
- **Tailwind CSS v4**, GSAP, Lenis, Lucide, Zod, strict TypeScript, ESLint and Prettier

## Quick start

pnpm is required. npm and yarn are blocked at install time.

```bash
pnpm create sanity@latest --template <github-user>/nexsanity --package-manager pnpm
```

Or clone the repository and connect it to a Sanity project yourself:

```bash
corepack enable
pnpm install
cp .env.example .env.local
```

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage), or run `pnpm dlx sanity@latest init --env .env.local`.
2. Put the project ID and dataset in `.env.local`.
3. In the project's **API** settings, add `http://localhost:3000` as a CORS origin with credentials allowed.
4. Create a **Viewer** token and save it as `SANITY_API_READ_TOKEN`. It enables draft mode and Visual Editing.
5. Optional: create a second Viewer token as `SANITY_API_BROWSER_TOKEN` for live draft updates outside the Presentation tool. It is sent to the browser while draft mode is on, so it must only ever have the Viewer role.

Import the demo content (a fictional studio, branded NexSanity) and start the dev server:

```bash
pnpm dlx sanity@latest login
pnpm seed:import
pnpm dev
```

Open [localhost:3000](http://localhost:3000) for the site and [localhost:3000/studio](http://localhost:3000/studio) for the Studio.

## Environment variables

| Variable                                             | Scope                                     | Required                     | Purpose                                  |
| ---------------------------------------------------- | ----------------------------------------- | ---------------------------- | ---------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`                      | Public                                    | Yes                          | Sanity project                           |
| `NEXT_PUBLIC_SANITY_DATASET`                         | Public                                    | No, defaults to `production` | Dataset                                  |
| `NEXT_PUBLIC_SANITY_API_VERSION`                     | Public                                    | No, defaults to `2026-10-01` | API version                              |
| `NEXT_PUBLIC_SITE_URL`                               | Public                                    | Yes in production            | Canonical URLs, sitemap, Open Graph      |
| `SANITY_API_READ_TOKEN`                              | Server                                    | For Visual Editing           | Viewer token for drafts                  |
| `SANITY_API_BROWSER_TOKEN`                           | Server, sent to the browser in draft mode | No                           | Viewer token for live draft updates      |
| `RESEND_API_KEY`                                     | Server                                    | For the contact form         | Sends contact emails                     |
| `CONTACT_TO_EMAIL`                                   | Server                                    | For the contact form         | Where enquiries are delivered            |
| `CONTACT_FROM_EMAIL`                                 | Server                                    | No                           | Sender, defaults to Resend's test sender |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Server                                    | For the contact form         | Rate limiting                            |

Every variable is parsed with Zod in `lib/env/public-env.ts` or `lib/env/server-env.ts`. `process.env` is read nowhere else. The contact form stays switched off, with a friendly message, until Resend and Upstash are both configured, so email sending is never left without a rate limit.

## Scripts

| Command                       | What it does                                                                                 |
| ----------------------------- | -------------------------------------------------------------------------------------------- |
| `pnpm dev`                    | Start the dev server                                                                         |
| `pnpm build`                  | Production build                                                                             |
| `pnpm lint` / `pnpm lint:fix` | ESLint                                                                                       |
| `pnpm typecheck`              | TypeScript                                                                                   |
| `pnpm format`                 | Prettier                                                                                     |
| `pnpm typegen`                | Extract the schema and regenerate `sanity/sanity.types.ts`                                   |
| `pnpm seed:generate`          | Rebuild `seed/demo-content.ndjson` from `seed/generate-demo-content.ts`                      |
| `pnpm seed:import`            | Import the demo content into the `production` dataset (replaces documents with the same IDs) |

## Project structure

```text
app/                   routes: (site) pages, /studio, /api/draft-mode/enable, sitemap, robots, OG image
components/blocks/     one folder per page-builder block, plus page-builder.tsx
components/blog/       post card, article, index, category filter
components/customers/  case study card, article, index
components/site/       header, footer, navigation, route states
lib/content/           everything pages call: get-page, get-posts-page, get-case-study and helpers
lib/sanity/            client, Live, queries, image URLs, link resolution
lib/contact/           Server Action, parsing, rate limit, Resend
lib/env/               the only modules that read process.env
sanity/                schema types, Studio structure, Presentation routing, generated types
seed/                  demo content and images
```

Pages are transport only: they parse params, call one function from `lib/content`, and render. The first page-builder block renders the page's single `<h1>`; every other block uses `<h2>`.

## Deploying to Vercel

1. Import the repository in Vercel. It detects pnpm from `pnpm-lock.yaml`.
2. Add the environment variables above.
3. In Sanity, add your production URL as a CORS origin with credentials allowed.

## Demo images

The demo images in `seed/images` are from [Lummi](https://www.lummi.ai) and are covered by the [Lummi license](https://www.lummi.ai/license): free for personal and commercial use, but not to be resold or bundled into a competing stock service. They are not covered by this repository's MIT license. Client logos are simple wordmarks for fictional brands made for this template.

## License

MIT for the code. See [LICENSE](LICENSE).
