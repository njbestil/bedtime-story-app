export const APP_PATHS = {
  loading: '/',
  library: '/library',
  storyGenerator: '/stories/new',
  storyReader: '/stories/:id',
} as const

export function getStoryReaderPath(id: string) {
  return APP_PATHS.storyReader.replace(':id', id)
}
