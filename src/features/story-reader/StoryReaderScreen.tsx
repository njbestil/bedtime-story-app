import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import Pagination from '../../components/Pagination'
import { ApiClientError } from '../../services/apiClient'
import { getStory } from '../../services/storyService'
import type { Story, StorySummary } from '../../types/story'
import { APP_PATHS } from '../../routes/paths'
import BookCover from './components/BookCover'
import { usePersistReadingProgress } from './hooks/usePersistReadingProgress'
import { useReadingProgressContext } from './hooks/useReadingProgressContext'
import { splitStoryIntoParagraphs } from './utils/splitStoryIntoParagraphs'

type ReaderStatus = 'loading' | 'ready' | 'error'
type StoryReaderLocationState = {
  storyPreview?: StorySummary
}

const PAGE_FADE_DURATION_MS = 180

function getReaderErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message
  }

  return 'We could not open this story. Please try again.'
}

function getStoryPreview(state: unknown, storyId?: string): StorySummary | null {
  if (!state || typeof state !== 'object') {
    return null
  }

  const preview = (state as StoryReaderLocationState).storyPreview

  if (
    !preview ||
    preview.id !== storyId ||
    typeof preview.title !== 'string' ||
    typeof preview.genre !== 'string'
  ) {
    return null
  }

  return preview
}

function StoryReaderScreen() {
  const { id: storyId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { isBookmarked, setBookmarked } = useReadingProgressContext()
  const hasStoryId = typeof storyId === 'string'
  const storyPreview = getStoryPreview(location.state, storyId)
  const [readerStatus, setReaderStatus] = useState<ReaderStatus>(() =>
    hasStoryId ? 'loading' : 'error',
  )
  const [errorMessage, setErrorMessage] = useState(() =>
    hasStoryId ? '' : 'This story is unavailable.',
  )
  const [isCoverDismissed, setIsCoverDismissed] = useState(false)
  const [isPageTransitioning, setIsPageTransitioning] = useState(false)
  const [isPageVisible, setIsPageVisible] = useState(true)
  const [selectedPage, setSelectedPage] = useState(1)
  const [story, setStory] = useState<Story | null>(null)
  const transitionTimeoutRef = useRef<number | undefined>(undefined)
  const transitionFrameRef = useRef<number | undefined>(undefined)
  const storyPageCount = story?.pages.length ?? 0
  const totalPages = storyPageCount + 1
  const currentPage = storyPageCount > 0 ? Math.min(Math.max(selectedPage, 1), totalPages) : 1

  usePersistReadingProgress({
    storyId,
    currentPage,
    totalStoryPages: storyPageCount,
    isBookmarked,
  })

  useEffect(() => {
    if (!storyId) {
      return
    }

    const controller = new AbortController()

    void getStory(storyId, controller.signal)
      .then((nextStory) => {
        if (controller.signal.aborted) {
          return
        }

        setStory(nextStory)
        setSelectedPage(Math.min(Math.max(nextStory.currentPage, 1), nextStory.pages.length))
        setBookmarked(nextStory.currentPage > 1)
        setReaderStatus('ready')
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return
        }

        setReaderStatus('error')
        setErrorMessage(getReaderErrorMessage(error))
      })

    return () => {
      controller.abort()
    }
  }, [setBookmarked, storyId])

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current !== undefined) {
        window.clearTimeout(transitionTimeoutRef.current)
      }

      if (transitionFrameRef.current !== undefined) {
        window.cancelAnimationFrame(transitionFrameRef.current)
      }
    }
  }, [])

  function handleRetry() {
    if (!storyId) {
      return
    }

    setReaderStatus('loading')
    setErrorMessage('')

    void getStory(storyId)
      .then((nextStory) => {
        setStory(nextStory)
        setSelectedPage(Math.min(Math.max(nextStory.currentPage, 1), nextStory.pages.length))
        setBookmarked(nextStory.currentPage > 1)
        setReaderStatus('ready')
      })
      .catch((error: unknown) => {
        setReaderStatus('error')
        setErrorMessage(getReaderErrorMessage(error))
      })
  }

  const hasReadableStory = readerStatus === 'ready' && story !== null && story.pages.length > 0
  const coverStory: StorySummary | null = story ?? storyPreview
  const coverErrorMessage =
    readerStatus === 'error'
      ? errorMessage
      : readerStatus === 'ready' && story?.pages.length === 0
        ? 'This story has no readable pages.'
        : undefined
  const bookCover = !isCoverDismissed ? (
    <BookCover
      story={coverStory}
      isLoading={readerStatus === 'loading'}
      isReady={hasReadableStory}
      errorMessage={coverErrorMessage}
      onRetry={hasStoryId ? handleRetry : undefined}
      onDismiss={() => setIsCoverDismissed(true)}
    />
  ) : null

  if (!hasReadableStory || !story || !isCoverDismissed) {
    return bookCover
  }

  const isEndPage = currentPage === totalPages
  const storyPage = isEndPage ? null : story.pages[currentPage - 1]
  const paragraphs = storyPage ? splitStoryIntoParagraphs(storyPage.content) : []
  const pageStatus =
    currentPage === 1 ? 'Beginning' : isEndPage ? 'The End' : 'Reading...'

  function changePage(nextPage: number) {
    if (isPageTransitioning || nextPage === currentPage) {
      return
    }

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setSelectedPage(nextPage)
      return
    }

    setIsPageTransitioning(true)
    setIsPageVisible(false)

    transitionTimeoutRef.current = window.setTimeout(() => {
      setSelectedPage(nextPage)
      transitionFrameRef.current = window.requestAnimationFrame(() => {
        setIsPageVisible(true)
        setIsPageTransitioning(false)
      })
    }, PAGE_FADE_DURATION_MS)
  }

  function handlePreviousPage() {
    changePage(Math.max(currentPage - 1, 1))
  }

  function handleNextPage() {
    changePage(Math.min(currentPage + 1, totalPages))
  }

  function handleClose() {
    navigate(APP_PATHS.library, { viewTransition: true })
  }

  return (
    <>
      {bookCover}

      <section
        className="flex h-[calc(100svh-2.75rem)] flex-col pb-[calc(6rem+env(safe-area-inset-bottom))]"
        aria-labelledby="reader-title"
      >
        <h1 id="reader-title" className="sr-only">
          {story.title}
        </h1>

        <div
          className={`flex min-h-0 flex-1 flex-col transition-opacity duration-[180ms] ease-out motion-reduce:transition-none ${
            isPageVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {isEndPage ? (
            <div className="text-brand-accent flex flex-1 flex-col items-center justify-center text-center">
              <h2 className="type-pirate-heading">
                The End
              </h2>
              <p className="type-body text-content-primary mt-3">Until the next adventure.</p>
            </div>
          ) : (
            <>
              <div className="mb-5 aspect-[4/3] w-full overflow-hidden sm:aspect-video lg:aspect-[21/9]">
                {storyPage?.imageUrl ? (
                  <img
                    src={storyPage.imageUrl}
                    alt={storyPage.imageAltText ?? ''}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="bg-app-surface text-content-muted flex h-full items-center justify-center">
                    Story illustration unavailable
                  </div>
                )}
              </div>

              <div className="type-body text-brand-accent mt-5 min-h-0 flex-1 space-y-3 overflow-hidden">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <footer className="fixed inset-x-0 bottom-0 z-30">
        <Pagination
          className="pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          currentPage={currentPage}
          totalPages={totalPages}
          status={pageStatus}
          isTransitioning={isPageTransitioning}
          finalAction={{ label: 'Close', ariaLabel: 'Close story and return to library', onClick: handleClose }}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
        />
      </footer>
    </>
  )
}

export default StoryReaderScreen
