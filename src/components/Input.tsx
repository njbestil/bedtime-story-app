import { forwardRef, type ComponentPropsWithoutRef, useId } from 'react'

type InputProps = ComponentPropsWithoutRef<'input'> & {
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { 'aria-describedby': ariaDescribedBy, className = '', error, id, ...props },
  ref,
) {
  const fallbackId = useId()
  const errorId = `${id ?? fallbackId}-error`
  const describedBy = [ariaDescribedBy, error ? errorId : undefined].filter(Boolean).join(' ') || undefined

  return (
    <div>
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`
          type-body
          bg-app-surface
          ${error ? 'border-red-600' : 'border-outline-muted'}
          text-content-primary
          placeholder:text-content-muted
          min-h-11
          w-full
          rounded-2xl
          border
          px-4
          py-3
          outline-none
          transition-colors
          focus:border-brand-highlight
          focus:ring-1
          focus:ring-brand-highlight
          disabled:cursor-not-allowed
          disabled:opacity-50
          ${className}
        `}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-red-600 pl-2 pt-1 text-xs" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  )
})

export default Input
