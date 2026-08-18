import pirateShipLoading from '../../assets/pirate-ship-loading.gif'
import { FaAnchor } from "react-icons/fa6";
import type { LoadingScreenProps } from './loading.types'

function LoadingScreen({ progress, message }: LoadingScreenProps) {
  const normalizedProgress = Math.min(100, Math.max(0, progress))

  return (
    <main
      className="bg-app-background text-content-primary min-h-svh text-center"
      aria-busy="true"
    >
      <div className="mx-auto flex min-h-svh w-full max-w-[430px] flex-col px-8 pb-[max(clamp(2rem,calc(16svh-3.375rem),5rem),env(safe-area-inset-bottom))]">
        <section
          className="flex flex-1 flex-col items-center justify-center"
          aria-labelledby="loading-title"
        >
          <img
            src={pirateShipLoading}
            alt=""
            className="size-[clamp(11rem,26svh,14rem)] object-contain"
            aria-hidden="true"
          />

          <p className="type-eyebrow text-brand-highlight mt-8 flex items-center justify-center gap-2 font-medium">
            <FaAnchor className="text-brand-highlight text-base leading-none" aria-hidden="true" />
            Voyage Tales
          </p>

          <h1
            id="loading-title"
            className="type-pirate-heading text-brand-accent mt-2 font-semibold"
          >
            Preparing the voyage...
          </h1>

          <p
            className="type-body text-content-primary mx-auto mt-3 max-w-[290px]"
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        </section>

        <div
          className="mx-auto w-full max-w-[308px] pb-4"
          role="progressbar"
          aria-label="Preparing the application"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={normalizedProgress}
        >
          <div className="bg-progress-track h-[3px] overflow-hidden rounded-full">
            <div
              className="
              bg-progress-value
                h-full
                origin-left
                rounded-full
                motion-safe:transition-transform
                motion-safe:duration-500
                motion-safe:ease-out
                motion-reduce:transition-none
              "
              style={{
                transform: `scaleX(${normalizedProgress / 100})`,
              }}
            />
          </div>

          <p className="type-micro text-content-muted mt-3 tracking-progress">
            {Math.round(normalizedProgress)}%
          </p>
        </div>

      </div>
    </main>
  )
}

export default LoadingScreen
