import type { CSSProperties, MouseEvent } from 'react'

import {
  isLightType,
  type Pokemon,
  typeColor,
  typeGradient
} from '@/lib/pokemon'
import { MAX_HP } from '@/lib/stat-limits'
import { cn } from '@/lib/utils'

export default function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  const detailsId = `pokemon-${pokemon.id}-details`
  const stats = [
    ['Attack', pokemon.attack],
    ['Defense', pokemon.defense],
    ['Sp Attack', pokemon.specialAttack],
    ['Sp Defense', pokemon.specialDefense],
    ['Height', `${pokemon.height.toFixed(1)} m`],
    ['Weight', `${pokemon.weight.toFixed(1)} kg`],
    ['Speed', pokemon.speed],
    ['Gen', pokemon.generation]
  ] as const

  return (
    <article
      className="group relative aspect-2/3 cursor-pointer overflow-hidden rounded-2xl sm:aspect-square sm:rounded-3xl ring-1 ring-black/10 transition-[translate,box-shadow] duration-200 ease-out select-none hover:-translate-y-1 hover:shadow-lg has-focus-visible:ring-3 has-focus-visible:ring-ring motion-reduce:transition-none dark:ring-white/10"
      onClick={toggle}
    >
      {/* The type gradient sits behind the image as its placeholder. The image
          marks itself loaded or failed, and CSS reads that: the gradient pulses
          until either happens, then the image fades in or the gradient stays. */}
      <div
        className="absolute inset-0 bg-linear-to-br from-(--type-from) to-(--type-to) motion-safe:has-[img:not([data-loaded]):not([data-failed])]:animate-pulse"
        style={typeGradient(pokemon.types)}
      >
        <img
          alt=""
          className="size-full object-cover opacity-0 transition-opacity duration-300 data-failed:hidden data-loaded:opacity-100"
          decoding="async"
          loading="lazy"
          onError={event => (event.currentTarget.dataset.failed = '')}
          onLoad={event => (event.currentTarget.dataset.loaded = '')}
          src={pokemon.imageUrl}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex h-16 flex-col rounded-t-2xl bg-card text-card-foreground transition-[height] duration-300 ease-out group-has-aria-expanded:h-full motion-reduce:transition-none sm:h-14 sm:rounded-t-3xl sm:group-has-aria-expanded:h-[85%]">
        {/* Phones stack the type pills under the name to fit two columns. */}
        <div className="flex h-16 shrink-0 flex-col justify-center gap-1 px-3 sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:px-4">
          <h3 className="min-w-0 truncate text-sm font-bold sm:text-lg">
            <button
              aria-controls={detailsId}
              aria-expanded="false"
              className="cursor-pointer outline-none"
              type="button"
            >
              {pokemon.name}
            </button>
          </h3>
          <ul className="flex shrink-0 gap-1">
            {pokemon.types.map(type => (
              <li
                className={cn(
                  'rounded-full bg-(--type-color) px-2 py-0.5 text-[0.6875rem] font-semibold',
                  isLightType(type) ? 'text-zinc-900' : 'text-white'
                )}
                key={type}
                style={{ '--type-color': typeColor(type) } as CSSProperties}
              >
                {type}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="invisible flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain px-3 pb-3 text-xs sm:gap-3 sm:px-4 sm:pb-4 opacity-0 transition-[opacity,visibility] duration-300 group-has-aria-expanded:visible group-has-aria-expanded:opacity-100 motion-reduce:transition-none"
          id={detailsId}
        >
          <dl className="flex items-center gap-2 sm:gap-2.5 sm:text-sm">
            <dt>HP</dt>
            <dd className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/10">
              <div
                className="h-full w-(--hp) rounded-full bg-green-400"
                style={
                  { '--hp': `${(pokemon.hp / MAX_HP) * 100}%` } as CSSProperties
                }
              />
            </dd>
            <dd className="tabular-nums">{pokemon.hp}</dd>
          </dl>

          <dl className="grid gap-x-4 gap-y-0.5 sm:grid-cols-2 sm:gap-y-1">
            {stats.map(([label, value]) => (
              <div className="flex justify-between gap-2" key={label}>
                <dt className="font-medium">{label}</dt>
                <dd className="whitespace-nowrap tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>

          <p className="text-muted-foreground">{pokemon.description}</p>
        </div>
      </div>
    </article>
  )
}

// The toggle button's aria-expanded is the single source of truth: the article
// styles itself with `group-has-aria-expanded:`, so no React state is needed.
function toggle(event: MouseEvent<HTMLElement>) {
  const button = event.currentTarget.querySelector('button')
  if (!button) return
  button.ariaExpanded = String(button.ariaExpanded !== 'true')
}
