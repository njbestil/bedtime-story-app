import { useCallback, useState } from 'react'
import type { ReactNode } from 'react'
import { ReadingProgressContext } from './readingProgress.context'

type ReadingProgressProviderProps = {
  children: ReactNode
}

export function ReadingProgressProvider({ children }: ReadingProgressProviderProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const toggleBookmarked = useCallback(() => setIsBookmarked((currentValue) => !currentValue), [])
  const setBookmarked = useCallback((nextValue: boolean) => setIsBookmarked(nextValue), [])

  return (
    <ReadingProgressContext.Provider value={{ isBookmarked, toggleBookmarked, setBookmarked }}>
      {children}
    </ReadingProgressContext.Provider>
  )
}
