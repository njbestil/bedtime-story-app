const SIMULATED_LOADING_DURATION_MS = 4000

export function simulateLoading(
  updateProgress: (progress: number) => void,
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
