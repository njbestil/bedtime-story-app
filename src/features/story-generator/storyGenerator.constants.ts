import type { StoryFormValues } from './storyGenerator.types'

export const STORY_CATEGORIES = [
  'Adventure',
  'Fantasy',
  'Mystery',
  'Friendship',
  'Animals',
  'Ocean',
  'Space',
  'Forest',
]

export const STORY_LENGTHS = ['Short', 'Medium', 'Long']

export const INITIAL_FORM_VALUES: StoryFormValues = {
  category: 'Adventure',
  description: '',
  childName: '',
  ageRange: '',
  length: 'Medium',
  lesson: '',
}
