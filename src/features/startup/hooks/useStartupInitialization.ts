import { useCallback, useEffect, useState } from 'react'
import { useLoadingVisibility } from '../../../hooks/useLoadingVisibility'
import { ApiClientError } from '../../../services/apiClient'
import { getSavedStories } from '../../../services/storyService'
import type { StorySummary } from '../../../types/story'
import { STARTUP_LOADING_VISIBILITY } from '../startup.constants'

function getStartupErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message
  }

  return 'We could not prepare your storybook. Please try again.'
}

function waitForBrowserReady(signal: AbortSignal): Promise<void> {
  if (signal.aborted) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const finish = () => {
      window.removeEventListener('load', finish)
      signal.removeEventListener('abort', finish)
      window.requestAnimationFrame(() => resolve())
    }

    if (document.readyState === 'complete') {
      finish()
      return
    }

    window.addEventListener('load', finish, { once: true })
    signal.addEventListener('abort', finish, { once: true })
  })
}

export function useStartupInitialization() {
  const [attempt, setAttempt] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')
  const [initialStories, setInitialStories] = useState<StorySummary[] | null>(null)
  const isStartupVisible = useLoadingVisibility(isLoading, STARTUP_LOADING_VISIBILITY)

  useEffect(() => {
    const controller = new AbortController()

    void (async () => {
      try {
        const stories = await getSavedStories(controller.signal)

        if (controller.signal.aborted) {
          return
        }

        setProgress(50)
        await waitForBrowserReady(controller.signal)

        if (controller.signal.aborted) {
          return
        }

        setProgress(100)
        setInitialStories(stories)
        setIsLoading(false)
      } catch (error: unknown) {
        if (controller.signal.aborted) {
          return
        }

        setIsLoading(false)
        setErrorMessage(getStartupErrorMessage(error))
      }
    })()

    return () => controller.abort()
  }, [attempt])

  const retry = useCallback(() => {
    setInitialStories(null)
    setProgress(0)
    setErrorMessage('')
    setIsLoading(true)
    setAttempt((currentAttempt) => currentAttempt + 1)
  }, [])

  return {
    isLoading,
    progress,
    errorMessage,
    initialStories,
    isReadyToNavigate: initialStories !== null && !isLoading && !isStartupVisible,
    retry,
  }
}
