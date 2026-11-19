import { X } from 'lucide-react'

import type { Pokemon } from '@/lib/pokemon'

import pokemonData from '@/data/pokemon.json'

import PokemonCard from './PokemonCard'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from './ui/input-group'

// Temporary card preview until the real list lands: one card with an image,
// then two whose images fail so the type gradient fallback shows.
const PREVIEW_POKEMON: Pokemon[] = [
  pokemonData[3],
  { ...pokemonData[1], imageUrl: '/missing-image.png' },
  { ...pokemonData[2], imageUrl: '/missing-image.png' }
]

export default function PokemonGrid() {
  return (
    <div>
      {/* A native form reset clears the field, and the clear button hides
          itself via :placeholder-shown, so no React state is needed. */}
      <form onSubmit={event => event.preventDefault()} role="search">
        <InputGroup className="h-11">
          <InputGroupInput
            aria-label="Search Pokemon"
            className="peer h-full md:text-base [&::-webkit-search-cancel-button]:appearance-none"
            name="search"
            placeholder="Search by name, type, or description…"
            type="search"
          />
          <InputGroupAddon
            align="inline-end"
            className="peer-placeholder-shown:hidden"
          >
            <InputGroupButton
              aria-label="Clear search"
              className="cursor-pointer rounded-full transition-none hover:bg-transparent hover:text-foreground dark:hover:bg-transparent"
              // The button hides once the field is empty, so hand focus back
              // to the input instead of letting it drop to <body>.
              onClick={event => {
                const input =
                  event.currentTarget.form?.elements.namedItem('search')
                if (input instanceof HTMLInputElement) input.focus()
              }}
              size="icon-xs"
              type="reset"
            >
              <X />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
      <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] sm:gap-5">
        {PREVIEW_POKEMON.map(pokemon => (
          <li key={pokemon.id}>
            <PokemonCard pokemon={pokemon} />
          </li>
        ))}
      </ul>
    </div>
  )
}
