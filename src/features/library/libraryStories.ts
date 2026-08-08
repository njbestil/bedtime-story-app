export type LibraryStory = {
  id: string
  title: string
  category: string
}

export const SAVED_STORIES: LibraryStory[] = [
  {
    id: 'moonlit-map',
    title: 'The Moonlit Map',
    category: 'Bedtime adventure',
  },
  {
    id: 'captains-compass',
    title: "Captain's Compass",
    category: 'Sea mystery',
  },
  {
    id: 'starboard-stars',
    title: 'Starboard Stars',
    category: 'Dream voyage',
  },
  {
    id: 'treasure-island',
    title: 'Treasure Island',
    category: 'Pirate tale',
  },
]
