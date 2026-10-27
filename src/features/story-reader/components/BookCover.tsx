import { useState, type TransitionEvent } from 'react'
import Loading from '../../../components/Loading'
import type { StorySummary } from '../../../types/story'

type BookCoverProps = {
  story: StorySummary | null
  isLoading: boolean
  isReady: boolean
  errorMessage?: string
  onRetry?: () => void
  onDismiss: () => void
}

function BookCover({
  story,
  isLoading,
  isReady,
  errorMessage,
  onRetry,
  onDismiss,
}: BookCoverProps) {
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [loadedImageUrl, setLoadedImageUrl] = useState<string | null>(null)
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null)
  const coverImageUrl = story?.coverImageUrl ?? null
  const hasResolvedImage =
    coverImageUrl === null ||
    loadedImageUrl === coverImageUrl ||
    failedImageUrl === coverImageUrl
  const canDismiss = isReady && hasResolvedImage && !errorMessage
  const isPreparing = isLoading || (story !== null && !hasResolvedImage)
  const statusMessage = errorMessage
    ? ''
    : !story
      ? 'Opening your story…'
      : !isReady
        ? 'Preparing your story…'
        : !hasResolvedImage
          ? 'Preparing the book cover…'
          : 'Ready to begin'

  function handleDismiss() {
    if (!canDismiss || isFadingOut) {
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDismiss()
      return
    }

    setIsFadingOut(true)
  }

  function handleTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (
      isFadingOut &&
      event.currentTarget === event.target &&
      event.propertyName === 'opacity'
    ) {
      onDismiss()
    }
  }

  return (
    <div
      className={`overlay-screen bg-app-background transition-opacity duration-300 ease-out motion-reduce:transition-none ${isFadingOut ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
      aria-busy={isPreparing ? 'true' : 'false'}
      onTransitionEnd={handleTransitionEnd}
    >
      {coverImageUrl && failedImageUrl !== coverImageUrl ? (
        <img
          src={coverImageUrl}
          alt={story?.coverImageAltText ?? ''}
          className="absolute inset-0 z-0 h-full w-full object-cover"
          onLoad={() => setLoadedImageUrl(coverImageUrl)}
          onError={() => setFailedImageUrl(coverImageUrl)}
        />
      ) : null}

      <div className="bg-app-background/30 pointer-events-none relative z-10 flex h-full w-full flex-col items-center justify-center text-center">
        {story ? (
          <>
            <p className="type-overline text-content-muted">{story.genre}</p>
            <h2 className="type-pirate-heading text-brand-accent mt-1 capitalize">
              {story.title}
            </h2>
          </>
        ) : (
          <p className="type-pirate-heading text-brand-accent">Preparing the voyage…</p>
        )}
      </div>

      <button
        type="button"
        className="absolute inset-0 z-20 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-0.25rem] focus-visible:outline-brand-accent disabled:cursor-not-allowed"
        aria-label={story ? `Open ${story.title}` : 'Open story'}
        disabled={!canDismiss}
        onClick={handleDismiss}
      />

      <p
        className="type-caption text-content-primary pointer-events-none absolute inset-x-0 bottom-6 z-30 text-center"
        role="status"
      >
        {statusMessage}
      </p>

      <Loading
        isLoading={isLoading && story === null}
        message="Opening your story…"
        errorMessage={errorMessage}
        onRetry={onRetry}
      />
    </div>
  )
}

export default BookCover
