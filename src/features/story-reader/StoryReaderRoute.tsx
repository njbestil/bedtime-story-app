import { useParams } from 'react-router'
import ContentLayout from '../../components/layouts/ContentLayout'
import StoryReaderHeader from './components/StoryReaderHeader'
import { ReadingProgressProvider } from './contexts/ReadingProgressProvider'

function StoryReaderRoute() {
  const { id: storyId } = useParams()

  return (
    <ReadingProgressProvider key={storyId}>
      <ContentLayout header={<StoryReaderHeader />} />
    </ReadingProgressProvider>
  )
}

export default StoryReaderRoute
