import type { HTMLAttributes, PropsWithChildren } from 'react'

type ScreenContentProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    padding?: 'standard' | 'wide'
  }
>

const PADDING_CLASSES = {
  standard: 'px-5',
  wide: 'px-8',
} as const

function ScreenContent({
  children,
  className,
  padding = 'standard',
  ...props
}: ScreenContentProps) {
  return (
    <div className={`${PADDING_CLASSES[padding]} ${className ?? ''}`} {...props}>
      {children}
    </div>
  )
}

export default ScreenContent
