type RollTextProps = {
  children: string
}

const characterDelayMilliseconds = 12

export function RollText({ children }: RollTextProps) {
  const characters = Array.from(children).map((character, position) => ({
    character,
    key: `${position}-${character}`,
    delay: position * characterDelayMilliseconds,
  }))

  return (
    <>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="relative block overflow-hidden leading-tight">
        {characters.map(({ character, key, delay }) => (
          <span
            key={key}
            style={{ transitionDelay: `${delay}ms` }}
            className="inline-block whitespace-pre transition-transform duration-400 ease-in-out roll-shadow group-hover/roll:-translate-y-full group-focus-visible/roll:-translate-y-full motion-reduce:transition-none motion-reduce:group-hover/roll:translate-y-0 motion-reduce:group-focus-visible/roll:translate-y-0"
          >
            {character}
          </span>
        ))}
      </span>
    </>
  )
}
