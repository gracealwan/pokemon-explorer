import { X } from 'lucide-react'
import { useRef } from 'react'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from './ui/input-group'

const SEARCH_DEBOUNCE_MS = 250

// The input stays uncontrolled: the DOM owns what's typed, and only the
// debounced term reaches React, so keystrokes don't re-render the grid.
export default function PokemonSearch({
  defaultValue,
  onSearch
}: {
  defaultValue: string
  onSearch: (search: string) => void
}) {
  const pendingSearchRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const scheduleSearch = (search: string) => {
    clearTimeout(pendingSearchRef.current)
    pendingSearchRef.current = setTimeout(
      () => onSearch(search),
      SEARCH_DEBOUNCE_MS
    )
  }

  const searchNow = (search: string) => {
    clearTimeout(pendingSearchRef.current)
    onSearch(search)
  }

  return (
    // The clear button hides itself via :placeholder-shown, so no React state
    // tracks whether the field is empty.
    <form
      onSubmit={event => {
        event.preventDefault()
        const search = new FormData(event.currentTarget).get('search')
        searchNow(typeof search === 'string' ? search : '')
      }}
      role="search"
    >
      <InputGroup className="h-11">
        <InputGroupInput
          aria-label="Search Pokemon"
          className="peer h-full md:text-base [&::-webkit-search-cancel-button]:appearance-none"
          defaultValue={defaultValue}
          enterKeyHint="search"
          name="search"
          onChange={event => scheduleSearch(event.currentTarget.value)}
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
            // Not type="reset": a reset restores the default value, which is
            // the search the page loaded with from the URL, not an empty field.
            // The button hides once the field is empty, so focus goes back to
            // the input instead of dropping to <body>.
            onClick={event => {
              const input =
                event.currentTarget.form?.elements.namedItem('search')
              if (!(input instanceof HTMLInputElement)) return
              input.value = ''
              input.focus()
              searchNow('')
            }}
            size="icon-xs"
            type="button"
          >
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
