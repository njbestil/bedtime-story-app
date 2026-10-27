import { useEffect, useRef, useState } from 'react'

type LoadingVisibilityOptions = {
  showDelayMs?: number
  minimumVisibleMs?: number
  initiallyVisible?: boolean
}

export function useLoadingVisibility(
  isLoading: boolean,
  {
    showDelayMs = 200,
    minimumVisibleMs = 400,
    initiallyVisible = false,
  }: LoadingVisibilityOptions = {},
) {
  const [isVisible, setIsVisible] = useState(() => isLoading && initiallyVisible)
  const shownAtRef = useRef<number | null>(null)

  useEffect(() => {
    if (isLoading) {
      if (isVisible) {
        if (shownAtRef.current === null) {
          shownAtRef.current = performance.now()
        }

        return
      }

      const showTimer = window.setTimeout(() => {
        shownAtRef.current = performance.now()
        setIsVisible(true)
      }, showDelayMs)

      return () => window.clearTimeout(showTimer)
    }

    if (!isVisible || shownAtRef.current === null) {
      return
    }

    const elapsedMs = performance.now() - shownAtRef.current
    const remainingVisibleMs = Math.max(0, minimumVisibleMs - elapsedMs)
    const hideTimer = window.setTimeout(() => {
      shownAtRef.current = null
      setIsVisible(false)
    }, remainingVisibleMs)

    return () => window.clearTimeout(hideTimer)
  }, [isLoading, isVisible, minimumVisibleMs, showDelayMs])

  return isVisible
}
