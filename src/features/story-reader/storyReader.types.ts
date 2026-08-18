export type Story = {
  id: number,
  isBookmark: boolean
  img: string
  category: string
  title: string
  story: string
}

export type StoryReaderPage = readonly string[]
