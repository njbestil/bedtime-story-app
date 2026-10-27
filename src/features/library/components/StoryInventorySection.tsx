import type { StorySummary } from '../../../types/story'
import type { LibraryInventoryStatus } from '../library.types'
import { getStoryReaderPath } from '../../../routes/paths'
import { Link } from 'react-router'
import Loading from '../../../components/Loading'

type StoryInventorySectionProps = {
  stories: StorySummary[]
  status: LibraryInventoryStatus
  errorMessage: string
  onRetry: () => void
}

function StoryInventorySection({
  stories,
  status,
  errorMessage,
  onRetry,
}: StoryInventorySectionProps) {
  
  return (
    <section className="border-outline-muted border-t pt-5 pb-7" aria-labelledby="saved-stories-title">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="type-overline text-content-muted">
            Saved discoveries
          </p>
          <h2
            id="saved-stories-title"
            className="type-pirate-section text-brand-accent mt-1"
          >
            Story book inventory
          </h2>
        </div>
        <p className="type-micro text-content-muted pb-0.5 tracking-wide">
          2 columns
        </p>
      </div>

      <Loading
        isLoading={status === 'loading'}
        message="Loading saved discoveries…"
        errorMessage={status === 'error' ? errorMessage : undefined}
        onRetry={onRetry}
      />

      {status === 'ready' && stories.length === 0 && (
        <p className="type-caption text-content-muted mt-5" role="status">
          Your saved story inventory is ready for its first adventure.
        </p>
      )}

      {status === 'ready' && stories.length > 0 && (
        <ul className="mt-5 grid grid-cols-2 gap-3" aria-label="Saved stories">
          {stories.map((story) => (
          <li
            key={story.id}
          >
            <Link
              to={getStoryReaderPath(story.id)}
              state={{ storyPreview: story }}
              viewTransition
              className="border-outline-strong block overflow-hidden rounded-2xl border bg-app-surface text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              <div
                className="type-micro border-outline-muted text-content-muted flex h-24 items-center justify-center border-b border-dashed"
                role="img"
                aria-label={`${story.title} book cover placeholder`}
              >
                <img src={`${story.coverImageUrl}`} alt={`${story.coverImageAltText}`} />
              </div>
              <div className="p-2.5">
                <h3 className="type-card-title text-brand-accent">
                  {story.title}
                </h3>
                <p className="type-caption text-content-muted mt-0.5">
                  {story.genre}
                </p>
              </div>
            </Link>
          </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default StoryInventorySection
