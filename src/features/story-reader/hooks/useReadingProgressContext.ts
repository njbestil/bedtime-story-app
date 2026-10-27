import { useContext } from 'react'
import { ReadingProgressContext } from '../contexts/readingProgress.context'

export function useReadingProgressContext() {
  const context = useContext(ReadingProgressContext)

  if (context === null) {
    throw new Error('useReadingProgressContext must be used within ReadingProgressProvider')
  }

  return context
}
