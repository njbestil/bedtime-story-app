import { useState } from 'react'
import { FaBookSkull, FaBookmark, FaRegBookmark } from 'react-icons/fa6'
import { useNavigate } from 'react-router'
import { APP_PATHS } from '../../../routes/paths'
import AppHeader from '../AppHeader'

type StoryReaderHeaderProps = {
  initiallyBookmarked?: boolean
}

function StoryReaderHeader({ initiallyBookmarked = false }: StoryReaderHeaderProps) {
  const navigate = useNavigate()
  const [isBookmarked, setIsBookmarked] = useState(initiallyBookmarked)

  return (
    <AppHeader
      start={
        <button
          type="button"
          className="text-content-primary flex items-center gap-1 text-sm"
          onClick={() => navigate(APP_PATHS.library)}
        >
          <FaBookSkull aria-hidden="true" />
          <span>Library</span>
        </button>
      }
      end={
        <button
          type="button"
          className="text-brand-highlight flex items-center gap-1 text-sm"
          aria-label={isBookmarked ? 'Remove bookmark' : 'Save story'}
          onClick={() => setIsBookmarked((isBookmarked) => !isBookmarked)}
        >
          {isBookmarked ? <FaBookmark aria-hidden="true" /> : <FaRegBookmark aria-hidden="true" />}
          <span>{isBookmarked ? 'Saved' : 'Save'}</span>
        </button>
      }
    />
  )
}

export default StoryReaderHeader
