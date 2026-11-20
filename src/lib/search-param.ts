import { useSearchParams } from 'react-router'

const SEARCH_PARAM = 'q'

// The URL is the only copy of the search term, so it survives a refresh and
// can be shared as a link.
export function useSearchParam() {
  const [searchParams, setSearchParams] = useSearchParams()

  const setSearch = (search: string) => {
    const term = search.trim()
    setSearchParams(
      current => {
        const next = new URLSearchParams(current)
        if (term) next.set(SEARCH_PARAM, term)
        else next.delete(SEARCH_PARAM)
        return next
      },
      // A search refines the same view, so it shouldn't add a Back step for
      // every term the user settles on.
      { replace: true }
    )
  }

  return [searchParams.get(SEARCH_PARAM) ?? '', setSearch] as const
}
