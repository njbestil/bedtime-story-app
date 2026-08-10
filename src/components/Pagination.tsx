import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6'

type PaginationProps = {
  currentPage: number
  totalPages: number
  status?: string
  className?: string
  onPrevious: () => void
  onNext: () => void
}

function Pagination({
  currentPage,
  totalPages,
  status,
  className = '',
  onPrevious,
  onNext,
}: PaginationProps) {
  if (totalPages < 1) {
    return null
  }

  const displayPage = Math.min(Math.max(currentPage, 1), totalPages)
  const isFirstPage = displayPage === 1
  const isLastPage = displayPage === totalPages

  return (
    <nav
      className={`bg-app-background/95 border-outline-muted grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 border-t px-3 py-3 backdrop-blur-sm ${className}`}
      aria-label="Story pagination"
    >
      <button
        type="button"
        className="type-caption text-content-primary flex min-h-11 items-center justify-self-start gap-1 rounded-lg px-1.5 disabled:cursor-not-allowed disabled:text-content-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
        aria-label="Previous page"
        disabled={isFirstPage}
        onClick={onPrevious}
      >
        <FaAngleLeft aria-hidden="true" />
        <span>Previous</span>
      </button>

      <div className="text-center" aria-live="polite">
        <p className="type-caption text-brand-accent font-semibold">
          Page {displayPage} of {totalPages}
        </p>
        {status && <p className="type-micro text-content-muted mt-0.5">{status}</p>}
      </div>

      <button
        type="button"
        className="type-caption border-outline-strong text-brand-accent flex min-h-11 items-center justify-self-end gap-1 rounded-2xl border px-3 disabled:cursor-not-allowed disabled:border-outline-muted disabled:text-content-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
        aria-label="Next page"
        disabled={isLastPage}
        onClick={onNext}
      >
        <span>Next</span>
        <FaAngleRight aria-hidden="true" />
      </button>
    </nav>
  )
}

export default Pagination
