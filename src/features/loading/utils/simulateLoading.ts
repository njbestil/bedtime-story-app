import { SIMULATED_LOADING_DURATION_MS } from '../loading.constants'
import type { LoadingProgressUpdater } from '../loading.types'

export function simulateLoading(
  updateProgress: LoadingProgressUpdater,
  durationMs = SIMULATED_LOADING_DURATION_MS,
) {
  let progress = 0
  const safeDuration =
    Number.isFinite(durationMs) && durationMs > 0
      ? durationMs
      : SIMULATED_LOADING_DURATION_MS
  const intervalMs = safeDuration / 100

  const intervalId = window.setInterval(() => {
    progress = Math.min(progress + 1, 100)
    updateProgress(progress)

    if (progress === 100) {
      window.clearInterval(intervalId)
    }
  }, intervalMs)

  return () => {
    window.clearInterval(intervalId)
  }
}
