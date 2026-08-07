type LoadingScreenProps = {
  progress: number
}

function LoadingScreen({ progress }: LoadingScreenProps) {
  const normalizedProgress = Math.min(100, Math.max(0, progress))

  return (
    <main
      className="bg-app-background text-content-primary min-h-svh text-center"
      aria-busy="true"
    >
      <div className="mx-auto flex min-h-svh w-full max-w-[430px] flex-col px-8 pt-[clamp(6rem,30svh,16rem)] pb-[max(clamp(2rem,calc(16svh-3.375rem),5rem),env(safe-area-inset-bottom))]">
        <section aria-labelledby="loading-title">
          <div
            className="border-outline-muted text-content-muted mx-auto flex h-44 w-48 items-center justify-center border-2 border-dashed text-sm leading-6"
            aria-hidden="true"
          >
            Pirate / ship
            <br />
            illustration
          </div>

          <p className="text-brand-accent mt-8 flex items-center justify-center gap-2 text-xs font-medium tracking-[0.22em] uppercase">
            <span className="text-base leading-none" aria-hidden="true">
              ⚓︎
            </span>
            Voyage Tales
          </p>

          <h1
            id="loading-title"
            className="font-pirate text-heading-accent mt-2 text-[clamp(1.5rem,6vw,1.9rem)] leading-tight font-semibold"
          >
            Preparing the voyage...
          </h1>

          <p
            className="text-content-primary mx-auto mt-3 max-w-[290px] text-sm leading-6"
            role="status"
            aria-live="polite"
          >
            A short message while the app or AI story loads.
          </p>
        </section>

        <div
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

          <p className="text-content-muted mt-3 text-[10px] tracking-[0.18em]">
            {Math.round(normalizedProgress)}%
          </p>
        </div>

      </div>
    </main>
  )
}

export default LoadingScreen
