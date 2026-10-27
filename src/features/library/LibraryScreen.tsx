import pirateBoySearching from '../../assets/pirate-boy-searching.png'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import type { StorySummary } from '../../types/story'
import StorySearchSection from './components/StorySearchSection'
import StoryInventorySection from './components/StoryInventorySection'
import type { LibraryInventoryStatus } from './library.types'
import { ApiClientError } from '../../services/apiClient'
import { getSavedStories } from '../../services/storyService'

type LibraryLocationState = {
  initialStories?: StorySummary[]
}

function getInventoryErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message
  }

  return 'Unable to load your saved stories. Please try again.'
}

function LibraryScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const initialStories = (location.state as LibraryLocationState | null)?.initialStories
  const hasInitialStories = initialStories !== undefined
  const [stories, setStories] = useState<StorySummary[]>(() => initialStories ?? [])
  const [inventoryStatus, setInventoryStatus] = useState<LibraryInventoryStatus>(() =>
    hasInitialStories ? 'ready' : 'loading',
  )
  const [inventoryError, setInventoryError] = useState('')

  useEffect(() => {
    if (hasInitialStories) {
      return
    }

    const controller = new AbortController()

    void getSavedStories(controller.signal)
      .then((savedStories) => {
        if (controller.signal.aborted) {
          return
        }

        setStories(savedStories)
        setInventoryStatus('ready')
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        setInventoryStatus('error')
        setInventoryError(getInventoryErrorMessage(error))
      })

    return () => {
      controller.abort()
    }
  }, [hasInitialStories])

  function handleRetry() {
    setInventoryStatus('loading')
    setInventoryError('')

    void getSavedStories()
      .then((savedStories) => {
        setStories(savedStories)
        setInventoryStatus('ready')
      })
      .catch((error: unknown) => {
        setInventoryStatus('error')
        setInventoryError(getInventoryErrorMessage(error))
      })
  }

  function handleNavigate(path: string) {
    navigate(path, { viewTransition: true })
  }

  return (
    <>
      <StorySearchSection imgSrc={pirateBoySearching} navigate={handleNavigate} />
      <StoryInventorySection
        stories={stories}
        status={inventoryStatus}
        errorMessage={inventoryError}
        onRetry={handleRetry}
      />
    </>
  )
}

export default LibraryScreen
