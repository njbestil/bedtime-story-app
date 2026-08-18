import { useCallback, useEffect, useLayoutEffect, useMemo, useState, type RefObject } from 'react'
import type { StoryReaderPage } from '../storyReader.types'
import { splitParagraphIntoSentences, splitStoryIntoParagraphs } from '../utils/splitStoryIntoParagraphs'

function haveSamePages(currentPages: StoryReaderPage[], nextPages: StoryReaderPage[]) {
  return (
    currentPages.length === nextPages.length &&
    currentPages.every(
      (page, pageIndex) =>
        page.length === nextPages[pageIndex].length &&
        page.every((paragraph, paragraphIndex) => paragraph === nextPages[pageIndex][paragraphIndex]),
    )
  )
}

function createPageMeasurer(contentElement: HTMLDivElement) {
  const measurer = document.createElement('div')
  const computedStyles = window.getComputedStyle(contentElement)

  measurer.style.position = 'fixed'
  measurer.style.top = '0'
  measurer.style.left = '-9999px'
  measurer.style.visibility = 'hidden'
  measurer.style.pointerEvents = 'none'
  measurer.style.width = `${contentElement.clientWidth}px`
  measurer.style.fontFamily = computedStyles.fontFamily
  measurer.style.fontSize = computedStyles.fontSize
  measurer.style.fontWeight = computedStyles.fontWeight
  measurer.style.lineHeight = computedStyles.lineHeight
  measurer.style.letterSpacing = computedStyles.letterSpacing
  measurer.style.wordBreak = computedStyles.wordBreak
  measurer.style.overflowWrap = computedStyles.overflowWrap

  document.body.append(measurer)

  const doesFit = (paragraphs: readonly string[]) => {
    measurer.replaceChildren(
      ...paragraphs.map((paragraph, index) => {
        const element = document.createElement('p')
        element.textContent = paragraph
        element.style.margin = '0'

        if (index < paragraphs.length - 1) {
          element.style.marginBottom = '1rem'
        }

        return element
      }),
    )

    return measurer.scrollHeight <= contentElement.clientHeight
  }

  return { doesFit, remove: () => measurer.remove() }
}

function paginateStory(paragraphs: readonly string[], doesFit: (page: readonly string[]) => boolean) {
  const pages: StoryReaderPage[] = []
  let currentPage: string[] = []

  for (const paragraph of paragraphs) {
    const blocks = doesFit([paragraph]) ? [paragraph] : splitParagraphIntoSentences(paragraph)

    for (const block of blocks) {
      if (doesFit([...currentPage, block])) {
        currentPage.push(block)
        continue
      }

      if (currentPage.length > 0) {
        pages.push(currentPage)
        currentPage = []
      }

      currentPage.push(block)
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage)
  }

  return pages
}

export function useStoryPagination(
  story: string,
  contentRef: RefObject<HTMLDivElement | null>,
): StoryReaderPage[] {
  const paragraphs = useMemo(() => splitStoryIntoParagraphs(story), [story])
  const [pages, setPages] = useState<StoryReaderPage[]>(() => [paragraphs])

  const measurePages = useCallback(() => {
    const contentElement = contentRef.current

    if (!contentElement || contentElement.clientWidth === 0 || contentElement.clientHeight === 0) {
      return
    }

    const measurer = createPageMeasurer(contentElement)
    const nextPages = paginateStory(paragraphs, measurer.doesFit)
    measurer.remove()

    setPages((currentPages) =>
      haveSamePages(currentPages, nextPages) ? currentPages : nextPages,
    )
  }, [contentRef, paragraphs])

  useLayoutEffect(() => {
    measurePages()
  }, [measurePages])

  useEffect(() => {
    const contentElement = contentRef.current

    if (!contentElement) {
      return
    }

    const resizeObserver = new ResizeObserver(measurePages)
    resizeObserver.observe(contentElement)

    return () => resizeObserver.disconnect()
  }, [contentRef, measurePages])

  return pages
}
