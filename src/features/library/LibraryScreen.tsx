import pirateBoySearching from '../../assets/pirate-boy-searching.png'
import { SAVED_STORIES } from './libraryStories'

function LibraryScreen() {
  return (
    <>
      <section className="pt-6 pb-5 text-center" aria-labelledby="discovery-title">
        <img
          src={pirateBoySearching}
          alt="Pirate searching for story books"
          className="w-full bg-cover"
        />

        <h1
          id="discovery-title"
          className="type-pirate-heading text-brand-accent mt-6"
        >
          What story shall we discover?
        </h1>

        <p className="type-body text-content-primary mx-auto mt-3 max-w-[310px]">
          Chart a course for treasure!
        </p>

        <button
          type="button"
          disabled
          className="type-action border-outline-strong text-brand-accent mt-3 flex min-h-14 w-full items-center justify-center gap-3 rounded-full border bg-app-surface px-6 disabled:cursor-not-allowed disabled:opacity-100"
        >
          <span className="text-content-primary text-xl leading-none" aria-hidden="true">
            ⌕
          </span>
          Search a story
        </button>
      </section>

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

        <div className="mt-5 grid grid-cols-2 gap-3" aria-label="Saved stories">
          {SAVED_STORIES.map((story) => (
            <article
              key={story.id}
              className="border-outline-strong overflow-hidden rounded-2xl border bg-app-surface text-left"
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
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default LibraryScreen
