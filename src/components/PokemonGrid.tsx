import { useInfiniteQuery } from '@tanstack/react-query'
import { SearchX } from 'lucide-react'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import { PAGE_SIZE, pokemonSearchQuery } from '@/lib/pokemon-api'
import { useSearchParam } from '@/lib/search-param'
import { cn } from '@/lib/utils'

import PokemonCard from './PokemonCard'
import PokemonSearch from './PokemonSearch'
import { Button } from './ui/button'

const NEXT_PAGE_SKELETONS = 4

// How far below the viewport to start loading, so the next page is usually
// ready before the user reaches the end of the grid.
const PRELOAD_MARGIN = '0px 0px 800px 0px'

export default function PokemonGrid() {
  const [search, setSearch] = useSearchParam()

  return (
    <div>
      <PokemonSearch defaultValue={search} onSearch={setSearch} />
      <PokemonResults search={search} />
    </div>
  )
}

function PokemonResults({ search }: { search: string }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetchNextPageError,
    isPending,
    isPlaceholderData,
    refetch
  } = useInfiniteQuery(pokemonSearchQuery(search))

  const loadMoreRef = useLoadMoreOnScroll({
    canLoadMore: hasNextPage && !isFetching && !isFetchNextPageError,
    loadMore: fetchNextPage
  })

  const total = data?.total ?? 0
  const announcement = isPending
    ? ''
    : total === 0
      ? 'No Pokemon found'
      : `${total} Pokemon found`

  return (
    <section aria-label="Results" className="mt-8">
      <p className="sr-only" role="status">
        {announcement}
      </p>

      {isPending ? (
        <ul className={GRID_CLASS_NAME}>
          <CardSkeletons count={PAGE_SIZE} />
        </ul>
      ) : !data ? (
        // Only when nothing loaded at all. A failed background refetch keeps
        // the cached results on screen, and a failed next page retries below.
        <ErrorMessage onRetry={() => void refetch()} />
      ) : total === 0 ? (
        <div className="flex flex-col items-center gap-3 py-24 text-center text-muted-foreground">
          <SearchX aria-hidden className="size-10" />
          <p className="text-lg font-medium">No Pokemon found</p>
        </div>
      ) : (
        <>
          {/* Previous results stay up, dimmed, while a new search loads. */}
          <ul
            aria-busy={isPlaceholderData}
            className={cn(
              GRID_CLASS_NAME,
              'transition-opacity aria-busy:opacity-50 motion-reduce:transition-none'
            )}
          >
            {data.pokemon.map(pokemon => (
              <li key={pokemon.id}>
                <PokemonCard pokemon={pokemon} />
              </li>
            ))}
            {isFetchingNextPage && (
              <CardSkeletons count={NEXT_PAGE_SKELETONS} />
            )}
          </ul>

          {isFetchNextPageError ? (
            <ErrorMessage onRetry={() => void fetchNextPage()} />
          ) : hasNextPage ? (
            <div aria-hidden className="h-px" ref={loadMoreRef} />
          ) : (
            <p className="mx-auto mt-16 w-fit rounded-full border px-6 py-3 text-center text-muted-foreground">
              {"You've discovered all the Pokemon!"}
            </p>
          )}
        </>
      )}
    </section>
  )
}

// Loads the next page whenever the returned ref's element is near the viewport
// and loading is allowed. Re-checking each time `canLoadMore` turns true is what
// keeps loading on a tall screen, where the element never leaves view and so
// never fires a fresh intersection change.
function useLoadMoreOnScroll({
  canLoadMore,
  loadMore
}: {
  canLoadMore: boolean
  loadMore: () => unknown
}) {
  const { inView, ref } = useInView({ rootMargin: PRELOAD_MARGIN })

  useEffect(() => {
    if (inView && canLoadMore) void loadMore()
  }, [canLoadMore, inView, loadMore])

  return ref
}

const GRID_CLASS_NAME =
  'grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] sm:gap-5'

function CardSkeletons({ count }: { count: number }) {
  return Array.from({ length: count }, (_, index) => (
    <li
      aria-hidden
      className="aspect-2/3 animate-pulse rounded-2xl bg-muted motion-reduce:animate-none sm:aspect-square sm:rounded-3xl"
      // Skeletons are interchangeable, so their position is their identity.
      key={`skeleton-${index}`}
    />
  ))
}

function ErrorMessage({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      className="mt-12 flex flex-col items-center gap-3 text-center"
      role="alert"
    >
      <p className="text-muted-foreground">
        Something went wrong loading Pokemon.
      </p>
      <Button onClick={onRetry} variant="outline">
        Try again
      </Button>
    </div>
  )
}
