import type { Story, StorySummary } from '../types/story'
import { apiClient } from './apiClient'

export function getSavedStories(signal?: AbortSignal): Promise<StorySummary[]> {
  return apiClient<StorySummary[]>('/stories', { signal })
}

export function getStory(id: string, signal?: AbortSignal): Promise<Story> {
  return apiClient<Story>(`/stories/${id}`, { signal })
}

export function updateStoryProgress(
  id: string,
  currentPage: number,
  { signal, keepalive }: Pick<RequestInit, 'signal' | 'keepalive'> = {},
): Promise<void> {
  return apiClient<void>(`/stories/${id}/progress`, {
    method: 'PATCH',
    body: { currentPage },
    signal,
    keepalive,
  })
}
