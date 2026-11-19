import PokemonGrid from '@/components/PokemonGrid'
import ThemeToggle from '@/components/ThemeToggle'

export default function App() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          Pokemon Explorer
        </h1>
        <ThemeToggle />
      </header>
      <main className="mt-6 sm:mt-8">
        <PokemonGrid />
      </main>
    </div>
  )
}
