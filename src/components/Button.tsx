import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  leadingIcon?: ReactNode
}

function Button({
  children,
  className = '',
  leadingIcon,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`
        type-action 
        bg-brand-highlight 
        text-app-canvas 
        flex 
        min-h-14 
        w-full 
        items-center 
        justify-center 
        gap-3 
        rounded-2xl 
        px-6 
        transition 
        hover:brightness-110 
        motion-safe:transition-transform 
        motion-safe:duration-100 
        motion-safe:ease-out 
        motion-safe:active:scale-[0.97] 
        focus-visible:outline-2 
        focus-visible:outline-offset-2 
        focus-visible:outline-brand-accent 
        disabled:cursor-not-allowed 
        disabled:opacity-50 
        ${className}`}
      {...props}
    >
      {leadingIcon && (
        <span className="flex size-5 items-center justify-center" aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      {children}
    </button>
  )
}

export default Button
