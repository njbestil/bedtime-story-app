import { createContext } from 'react'

export type ReadingProgressContextValue = {
  isBookmarked: boolean
  toggleBookmarked: () => void
  setBookmarked: (isBookmarked: boolean) => void
}

export const ReadingProgressContext = createContext<ReadingProgressContextValue | null>(null)
