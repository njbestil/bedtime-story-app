import type { PIRATE_MESSAGES } from '../../assets/pirateMessages'

export type PirateMessage = (typeof PIRATE_MESSAGES)[number]

export type LoadingScreenProps = {
  progress: number
  message: string
}

export type LoadingProgressUpdater = (progress: number) => void
