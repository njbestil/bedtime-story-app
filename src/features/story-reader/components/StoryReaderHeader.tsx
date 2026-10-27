import { FaBookSkull, FaBookmark, FaRegBookmark } from 'react-icons/fa6'
import { useNavigate } from 'react-router'
import { APP_PATHS } from '../../../routes/paths'
import { useReadingProgressContext } from '../hooks/useReadingProgressContext'

function StoryReaderHeader() {
  const navigate = useNavigate()
  const { isBookmarked, toggleBookmarked } = useReadingProgressContext()

  return (
    <header className="feature-header">
      <button
        type="button"
        className="text-content-primary flex min-h-11 items-center gap-1 justify-self-start text-sm"
        onClick={() => navigate(APP_PATHS.library, { viewTransition: true })}
      >
        <FaBookSkull aria-hidden="true" />
        <span>Library</span>
      </button>

      <button
        type="button"
        className="text-brand-highlight col-start-3 flex min-h-11 items-center gap-1 justify-self-end text-sm"
        aria-label="Save reading progress"
        aria-pressed={isBookmarked ? 'true' : 'false'}
        onClick={toggleBookmarked}
      >
        {isBookmarked ? <FaBookmark aria-hidden="true" /> : <FaRegBookmark aria-hidden="true" />}
        <span>{isBookmarked ? 'Saved' : 'Save'}</span>
      </button>
    </header>
  )
}

export default StoryReaderHeader
