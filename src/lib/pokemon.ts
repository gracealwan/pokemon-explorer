import type { CSSProperties } from 'react'

import statLimits from '@/data/stat-limits.json'

export type Pokemon = {
  attack: number
  defense: number
  description: string
  generation: number
  height: number
  hp: number
  id: number
  imageUrl: string
  isLegendary?: boolean
  name: string
  specialAttack: number
  specialDefense: number
  speed: number
  types: string[]
  weight: number
}

// Shared with scripts/generate-pokemon.mjs so the fixtures and the HP bar
// agree on the scale. 255 is also the highest base HP in the games.
export const MAX_HP = statLimits.maxHp

const TYPE_COLORS: Record<string, string> = {
  Bug: 'var(--color-lime-500)',
  Dark: 'var(--color-slate-800)',
  Dragon: 'var(--color-indigo-700)',
  Electric: 'var(--color-yellow-500)',
  Fairy: 'var(--color-pink-300)',
  Fighting: 'var(--color-red-700)',
  Fire: 'var(--color-red-500)',
  Flying: 'var(--color-indigo-400)',
  Ghost: 'var(--color-purple-700)',
  Grass: 'var(--color-green-500)',
  Ground: 'var(--color-amber-600)',
  Ice: 'var(--color-cyan-300)',
  Normal: 'var(--color-slate-400)',
  Poison: 'var(--color-purple-500)',
  Psychic: 'var(--color-pink-500)',
  Rock: 'var(--color-amber-700)',
  Steel: 'var(--color-slate-500)',
  Water: 'var(--color-blue-500)'
}

// White text sits under 3:1 contrast on these, so they get dark text instead.
const LIGHT_TYPES = new Set([
  'Bug',
  'Electric',
  'Fairy',
  'Grass',
  'Ice',
  'Normal'
])

export const typeColor = (type: string) =>
  TYPE_COLORS[type] ?? TYPE_COLORS.Normal

// Unknown types fall back to Normal's colour, so they need its dark text too.
export const isLightType = (type: string) =>
  LIGHT_TYPES.has(type in TYPE_COLORS ? type : 'Normal')

// A single type fades into the page background, so it follows light and dark mode.
export const typeGradient = ([first = 'Normal', second]: string[]) =>
  ({
    '--type-from': typeColor(first),
    '--type-to': second ? typeColor(second) : 'var(--background)'
  }) as CSSProperties
