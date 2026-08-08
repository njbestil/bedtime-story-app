import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type RadioButtonProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'children' | 'className' | 'type'
> & {
  children: ReactNode
  className?: string
}

function RadioButton({ children, className = '', ...props }: RadioButtonProps) {
  return (
    <label className={`inline-flex min-h-9 cursor-pointer ${className}`}>
      <input type="radio" className="peer sr-only" {...props} />
      <span
        className="
          type-card-title 
          border-outline-muted 
          bg-app-surface 
          text-content-secondary 
          flex 
          w-full 
          items-center 
          justify-center 
          rounded-full 
          border 
          px-4 
          transition-colors 
          peer-checked:border-brand-highlight 
          peer-checked:bg-brand-highlight 
          peer-checked:text-app-canvas 
          peer-checked:hover:text-app-canvas
          peer-focus-visible:outline-2 
          peer-focus-visible:outline-offset-2 
          peer-focus-visible:outline-brand-accent 
          peer-disabled:cursor-not-allowed 
          peer-disabled:opacity-50
          hover:border-brand-highlight
          hover:text-brand-accent"
      >
        {children}
      </span>
    </label>
  )
}

export default RadioButton
