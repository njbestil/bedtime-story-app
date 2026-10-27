import { useEffect, useRef } from 'react'
import { updateStoryProgress } from '../../../services/storyService'

type UsePersistReadingProgressOptions = {
  storyId?: string
  currentPage: number
  totalStoryPages: number
  isBookmarked: boolean
}

export function usePersistReadingProgress({
  storyId,
  currentPage,
  totalStoryPages,
  isBookmarked,
}: UsePersistReadingProgressOptions) {
  const latestProgressRef = useRef({ storyId, currentPage, totalStoryPages, isBookmarked })
  const queuedProgressRef = useRef<string | null>(null)

  useEffect(() => {
    latestProgressRef.current = { storyId, currentPage, totalStoryPages, isBookmarked }
  }, [currentPage, isBookmarked, storyId, totalStoryPages])

  useEffect(() => {
    function persistProgress() {
      const latestProgress = latestProgressRef.current

      if (!latestProgress.storyId || latestProgress.totalStoryPages < 1) {
        return
      }
     
      const isEndStory = latestProgress.currentPage === (latestProgress.totalStoryPages+1);

      const pageToSave = latestProgress.isBookmarked && !isEndStory
        ? Math.min(
            Math.max(latestProgress.currentPage, 1),
            latestProgress.totalStoryPages,
          )
        : 1
      const progressKey = `${latestProgress.storyId}:${pageToSave}`

      if (queuedProgressRef.current === progressKey) {
        return
      }

      queuedProgressRef.current = progressKey

      void updateStoryProgress(latestProgress.storyId, pageToSave, { keepalive: true }).catch(() => {
        queuedProgressRef.current = null
      })
    }

    window.addEventListener('pagehide', persistProgress)

    return () => {
      window.removeEventListener('pagehide', persistProgress)
      persistProgress()
    }
  }, [])
}
