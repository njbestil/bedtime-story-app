export function splitStoryIntoParagraphs(story: string): string[] {
  return story
    .trim()
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

export function splitParagraphIntoSentences(paragraph: string): string[] {
  return paragraph.match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g)?.map((sentence) => sentence.trim()) ?? [paragraph]
}
