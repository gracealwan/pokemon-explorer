// scripts/generate-pokemon.mjs imports this file directly through Node's type
// stripping, so keep it self-contained: no `@/` imports and no TypeScript
// syntax that needs compiling, such as enums.

// Highest base HP in the games. The fixtures are generated up to it and the
// HP bar is drawn against it.
export const MAX_HP = 255
