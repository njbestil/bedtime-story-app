import type { PIRATE_MESSAGES } from './loading.constants'

export type PirateMessage = (typeof PIRATE_MESSAGES)[number]

export type LoadingScreenProps = {
  progress: number
  message: string
}

export type LoadingProgressUpdater = (progress: number) => void
