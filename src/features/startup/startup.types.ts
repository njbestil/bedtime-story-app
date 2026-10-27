export type StartupScreenProps = {
  isLoading: boolean
  progress: number
  message: string
  errorMessage?: string
  onRetry: () => void
}
