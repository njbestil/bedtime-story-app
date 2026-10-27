export type StorySummary = {
  id: string
  title: string
  genre: string
  summary: string | null
  coverImageUrl: string | null
  coverImageAltText: string | null
  createdAt: string
}

export type StoryPage = {
  pageNumber: number
  content: string
  imageUrl: string | null
  imageAltText: string | null
}

export type Story = {
  id: string
  title: string
  genre: string
  summary: string | null
  coverImageUrl: string | null
  coverImageAltText: string | null
  createdAt: string
  saved: boolean
  pages: StoryPage[]
  currentPage: number
}
