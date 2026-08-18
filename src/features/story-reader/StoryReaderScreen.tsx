import { useRef, useState } from 'react'
import Pagination from '../../components/Pagination'
import { MOONLIT_MAP_STORY } from './storyReader.constants'
import { useStoryPagination } from './hooks/useStoryPagination'

function StoryReaderScreen() {
  const [selectedPage, setSelectedPage] = useState(1)
  const storyContentRef = useRef<HTMLDivElement>(null)
  const storyPages = useStoryPagination(MOONLIT_MAP_STORY.story, storyContentRef)

  const totalPages = storyPages.length
  const currentPage = Math.min(selectedPage, totalPages)
  const storyPage = storyPages[currentPage - 1] ?? []
  const pageStatus =
    currentPage === 1 ? 'Beginning' : currentPage === totalPages ? 'The End' : 'Reading...'

  function handlePreviousPage() {
    setSelectedPage((page) => Math.max(page - 1, 1))
  }

  function handleNextPage() {
    setSelectedPage((page) => Math.min(page + 1, totalPages))
  }

  return (
    <>
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
