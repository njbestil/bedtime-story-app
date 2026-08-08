import { FaRegCompass } from 'react-icons/fa6'
import Button from '../../components/Button'

function StoryGeneratorScreen() {
  return (
    <section className="py-12 text-center" aria-labelledby="generator-title">
      <p className="type-eyebrow text-brand-accent">
        New adventure
      </p>
      <h1
        id="generator-title"
        className="type-screen-title text-brand-accent mt-3"
      >
        Create a story
      </h1>
      <p className="type-body mx-auto mt-3 max-w-sm">
        The story-creation form will be added in the next phase.
      </p>



<Button leadingIcon={<FaRegCompass />}>
  Generate Story
</Button>
    </section>
  )
}

export default StoryGeneratorScreen
