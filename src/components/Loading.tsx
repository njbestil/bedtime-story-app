import Button from './Button'
import pirateShipLoading from '../assets/pirate-ship-loading.gif'
import { useLoadingVisibility } from '../hooks/useLoadingVisibility'

type LoadingProps = {
  isLoading: boolean
  message: string
  errorMessage?: string
  onRetry?: () => void
}

function Loading({ isLoading, message = "Loading...", errorMessage, onRetry }: LoadingProps) {
  const hasError = Boolean(errorMessage)
  const isVisible = useLoadingVisibility(isLoading)

  return (
    <>
      {(isVisible || hasError) && (
        <div className="
          overlay-screen
          flex 
          items-center 
          justify-center 
          bg-app-background/80 
          text-content-primary 
          backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-3">
            <img
              src={pirateShipLoading}
              alt=""
              className="size-[clamp(11rem,26svh,14rem)] object-contain"
              aria-hidden="true"
            />
            <p className="text-sm font-medium">
              {isLoading ? message : ''}
            </p>

            <p className="type-caption" role="alert">
              {errorMessage ?? ''}
            </p>

            {hasError && onRetry && (
              <Button type="button" className="mt-5 max-w-40" onClick={onRetry}>
                Try again
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Loading
