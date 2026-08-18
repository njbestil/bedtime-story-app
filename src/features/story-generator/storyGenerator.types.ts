import type { ChangeEvent } from 'react'

export type StoryFormValues = {
  category: string
  description: string
  childName: string
  ageRange: string
  length: string
  lesson: string
}

export type StoryFormField = keyof StoryFormValues

export type StoryFormChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

export type StoryFormChangeHandler = (
  field: StoryFormField,
) => (event: StoryFormChangeEvent) => void
