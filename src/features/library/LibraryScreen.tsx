import pirateBoySearching from '../../assets/pirate-boy-searching.png'
import { SAVED_STORIES } from './library.constants'
import { useNavigate } from 'react-router'
import StorySearchSection from './components/StorySearchSection'
import StoryInventorySection from './components/StoryInventorySection'

function LibraryScreen() {
  const navigate = useNavigate()

  function handleNavigate(path: string) {
    navigate(path)
  }

  return (
    <>
      <StorySearchSection imgSrc={pirateBoySearching} navigate={handleNavigate} />
    
      <StoryInventorySection stories={SAVED_STORIES} navigate={handleNavigate} />
    </>
  )
}

export default LibraryScreen
