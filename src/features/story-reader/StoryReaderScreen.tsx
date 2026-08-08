import { useParams } from 'react-router'

function StoryReaderScreen() {
  const { id } = useParams()

  return (
    <section className="py-12 text-center" aria-labelledby="reader-title">
      <p className="type-eyebrow text-brand-accent">
        Continue reading
      </p>
      <h1
        id="reader-title"
        className="type-screen-title text-brand-accent mt-3"
      >
        Story reader
      </h1>
      <p className="type-body mx-auto mt-3 max-w-sm">
        Opening {id ?? 'this story'} will be available when the reader is
        implemented.
      </p>
    </section>
  )
}

export default StoryReaderScreen
