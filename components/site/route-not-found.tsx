import { ButtonLink } from '@/components/ui/button-link'

type RouteNotFoundProps = {
  heading?: string
  description?: string
  backHref?: string
  backLabel?: string
}

export function RouteNotFound({
  heading = 'Page not found',
  description = 'The page you are looking for has moved or no longer exists.',
  backHref = '/',
  backLabel = 'Go to Home',
}: RouteNotFoundProps) {
  return (
    <section
      aria-labelledby="not-found-heading"
      className="grid min-h-[80svh] w-full place-items-center overflow-hidden py-24"
    >
      <div className="main-container grid place-items-center">
        <p
          aria-hidden="true"
          className="col-start-1 row-start-1 text-[clamp(10rem,40vw,30rem)] leading-none font-bold tracking-tighter text-ink/5 select-none"
        >
          404
        </p>
        <div className="col-start-1 row-start-1 flex max-w-md flex-col items-center text-center">
          <h1
            id="not-found-heading"
            className="text-4xl font-medium tracking-tight text-balance md:text-5xl"
          >
            {heading}
          </h1>
          <p className="mt-4 text-pretty text-muted">{description}</p>
          <ButtonLink href={backHref} size="large" className="mt-8">
            {backLabel}
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
