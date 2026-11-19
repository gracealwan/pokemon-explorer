import { faker } from '@faker-js/faker'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { MAX_HP } from '../src/lib/stat-limits.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// A fixed seed makes every run produce the same fixtures.
faker.seed(1)

// Cards are at most ~300px wide, so 600px stays sharp on 2x screens while
// keeping downloads small. Picsum renders each image at the requested size.
const IMAGE_SIZE = 600

// Pokemon types for variety
const pokemonTypes = [
  'Normal',
  'Fire',
  'Water',
  'Electric',
  'Grass',
  'Ice',
  'Fighting',
  'Poison',
  'Ground',
  'Flying',
  'Psychic',
  'Bug',
  'Rock',
  'Ghost',
  'Dragon',
  'Dark',
  'Steel',
  'Fairy'
]

// Generate Pokemon data
function generatePokemon() {
  const id = faker.number.int({ max: 1000, min: 1 })
  const name = faker.person.firstName()
  const type = faker.helpers.arrayElement(pokemonTypes)
  const secondaryType = faker.helpers.maybe(
    () => faker.helpers.arrayElement(pokemonTypes.filter(t => t !== type)),
    { probability: 0.3 }
  )

  // Picsum only: LoremFlickr returns 500s. Faker otherwise picks a random size
  // up to 3999px and random grayscale and blur, so pin all four.
  const imageUrl = faker.image.urlPicsumPhotos({
    blur: 0,
    grayscale: false,
    height: IMAGE_SIZE,
    width: IMAGE_SIZE
  })

  return {
    attack: faker.number.int({ max: 190, min: 5 }),
    defense: faker.number.int({ max: 230, min: 5 }),
    description: faker.lorem.sentence(),
    generation: faker.number.int({ max: 9, min: 1 }),
    height: faker.number.float({ max: 20.0, min: 0.3, precision: 0.1 }),
    hp: faker.number.int({ max: MAX_HP, min: 20 }),
    id,
    imageUrl,
    isLegendary: faker.helpers.maybe(() => true, { probability: 0.05 }),
    name,
    specialAttack: faker.number.int({ max: 194, min: 10 }),
    specialDefense: faker.number.int({ max: 230, min: 10 }),
    speed: faker.number.int({ max: 200, min: 5 }),
    types: secondaryType ? [type, secondaryType] : [type],
    weight: faker.number.float({ max: 1000.0, min: 0.1, precision: 0.1 })
  }
}

// Generate 1000 Pokemon
const pokemonData = Array.from({ length: 1000 }, generatePokemon)

// Ensure unique IDs
pokemonData.forEach((pokemon, index) => {
  pokemon.id = index + 1
})

// Write to file
const outputPath = path.join(__dirname, '..', 'src', 'data', 'pokemon.json')
const outputDir = path.dirname(outputPath)

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

fs.writeFileSync(outputPath, JSON.stringify(pokemonData, null, 2))

console.log(
  `Generated ${pokemonData.length} Pokemon and saved to ${outputPath}`
)
console.log('Sample Pokemon:', pokemonData[0])
