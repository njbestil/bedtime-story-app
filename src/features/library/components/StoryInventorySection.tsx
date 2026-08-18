import type { LibraryStory } from '../library.types'
import { getStoryReaderPath } from '../../../routes/paths'
import { Link } from 'react-router'

type StoryInventorySectionProps = {
  stories: LibraryStory[]
}

function StoryInventorySection({ stories }: StoryInventorySectionProps) {
  
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

      <ul className="mt-5 grid grid-cols-2 gap-3" aria-label="Saved stories">
        {stories.map((story) => (
          <li
            key={story.id}
          >
            <Link
              to={getStoryReaderPath(story.id)}
              className="border-outline-strong block overflow-hidden rounded-2xl border bg-app-surface text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
            >
              <div
                className="type-micro border-outline-muted text-content-muted flex h-24 items-center justify-center border-b border-dashed"
                role="img"
                aria-label={`${story.title} book cover placeholder`}
              >
                Book image
              </div>
              <div className="p-2.5">
                <h3 className="type-card-title text-brand-accent">
                  {story.title}
                </h3>
                <p className="type-caption text-content-muted mt-0.5">
                  {story.category}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default StoryInventorySection
