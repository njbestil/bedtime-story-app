import { useRef, useState } from 'react'
import { FaBookSkull, FaBookmark, FaRegBookmark } from 'react-icons/fa6'
import Pagination from '../../components/Pagination'
import AppHeader from '../../components/layouts/AppHeader'
import { APP_PATHS } from '../../routes/paths'
import { useNavigate } from 'react-router'
import { MOONLIT_MAP_STORY } from './storyReader.constants'
import { useStoryPagination } from './hooks/useStoryPagination'

function StoryReaderScreen() {
  const navigate = useNavigate()
  const [isBookmarked, setIsBookmarked] = useState(MOONLIT_MAP_STORY.isBookmark)
  const [selectedPage, setSelectedPage] = useState(1)
  const storyContentRef = useRef<HTMLDivElement>(null)
  const storyPages = useStoryPagination(MOONLIT_MAP_STORY.story, storyContentRef)

  const totalPages = storyPages.length
  const currentPage = Math.min(selectedPage, totalPages)
  const storyPage = storyPages[currentPage - 1] ?? []
  const pageStatus =
    currentPage === 1 ? 'Beginning' : currentPage === totalPages ? 'The End' : 'Reading...'

  function handleLibraryClick() {
    navigate(APP_PATHS.library)
  }

  function handleBookMarkClick() {
    setIsBookmarked((isBookmarked) => !isBookmarked)
  }

  function handlePreviousPage() {
    setSelectedPage((page) => Math.max(page - 1, 1))
  }

  function handleNextPage() {
    setSelectedPage((page) => Math.min(page + 1, totalPages))
  }

  const headerStart = (
    <button
      type="button"
      className="text-content-primary flex items-center gap-1 text-sm"
      aria-label="Library"
      onClick={handleLibraryClick}
    >
      <FaBookSkull aria-hidden="true" />
      <span>Library</span>
    </button>
  )

  const headerEnd = (
    <button
      type="button"
      className="text-brand-highlight flex items-center gap-1 text-sm"
      aria-label={isBookmarked ? 'Remove bookmark' : 'Save story'}
      onClick={handleBookMarkClick}
    >
      {isBookmarked ? <FaBookmark aria-hidden="true" /> : <FaRegBookmark aria-hidden="true" />}
    </button>
  )

  return (
    <>
      <AppHeader start={headerStart} end={headerEnd} />

      <section
        className="flex h-[calc(100svh-2.75rem)] flex-col pb-[calc(6rem+env(safe-area-inset-bottom))]"
        aria-labelledby="reader-title"
      >
          <div className="mb-5 aspect-[4/3] w-full overflow-hidden sm:aspect-video lg:aspect-[21/9]">
            <img src={MOONLIT_MAP_STORY.img} alt="Moonlit map beside a quiet harbor" className="h-full w-full object-cover" />
          </div>

          <p className="type-overline text-content-muted">{MOONLIT_MAP_STORY.category}</p>
          <h1 id="reader-title" className="type-pirate-heading text-brand-accent mt-1 capitalize">
            {MOONLIT_MAP_STORY.title}
          </h1>

          <div ref={storyContentRef} className="type-body text-brand-accent mt-5 min-h-0 flex-1 space-y-3 overflow-hidden">
            {storyPage.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <footer className="fixed inset-x-0 bottom-0 z-30">
        <Pagination
          className="pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          currentPage={currentPage}
          totalPages={totalPages}
          status={pageStatus}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
        />
      </footer>
    </>
  )
}

export default StoryReaderScreen
