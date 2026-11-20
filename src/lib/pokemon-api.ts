import { infiniteQueryOptions, keepPreviousData } from '@tanstack/react-query'

import type { Pokemon } from './pokemon'

// Divisible by 2, 3 and 4, so every grid width ends a page on a full row.
export const PAGE_SIZE = 24

type PokemonPage = {
  data: Pokemon[]
  pagination: {
    hasNext: boolean
    hasPrev: boolean
    limit: number
    page: number
    total: number
    totalPages: number
  }
}

async function fetchPokemonPage({
  page,
  search,
  signal
}: {
  page: number
  search: string
  signal: AbortSignal
}): Promise<PokemonPage> {
  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    page: String(page)
  })
  if (search) params.set('search', search)

  const response = await fetch(`/api/pokemon?${params}`, { signal })
  if (!response.ok) {
    throw new Error(`Pokemon request failed with ${response.status}`)
  }
  return (await response.json()) as PokemonPage
}

// Module level so its identity is stable and TanStack Query memoizes the result.
const flattenPages = ({ pages }: { pages: PokemonPage[] }) => ({
  pokemon: pages.flatMap(page => page.data),
  total: pages[0]?.pagination.total ?? 0
})

export function pokemonSearchQuery(rawSearch: string) {
  // The server matches case-insensitively, so "Fire " and "fire" share a cache entry.
  const search = rawSearch.trim().toLowerCase()

  return infiniteQueryOptions({
    getNextPageParam: lastPage =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    initialPageParam: 1,
    // Keep showing the previous results while a new search loads, instead of
    // collapsing the grid to a skeleton on every keystroke.
    placeholderData: keepPreviousData,
    queryFn: ({ pageParam, signal }) =>
      fetchPokemonPage({ page: pageParam, search, signal }),
    queryKey: ['pokemon', 'search', search],
    select: flattenPages
  })
}
