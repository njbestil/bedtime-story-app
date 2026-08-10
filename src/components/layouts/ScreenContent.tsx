import type { HTMLAttributes, PropsWithChildren } from 'react'

type ScreenContentProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    padding?: 'standard' | 'wide'
  }
>

const PADDING_CLASSES = {
  standard: 'px-4',
  wide: 'px-8',
} as const

const CONTENT_WIDTH_CLASSES = "w-full md:max-w-svh md:mx-auto pt-11"

function ScreenContent({
  children,
  className,
  padding = 'standard',
  ...props
}: ScreenContentProps) {
  return (
    <div className={` ${CONTENT_WIDTH_CLASSES} ${PADDING_CLASSES[padding]}  ${className ?? ''}`} {...props}>
      {children}
    </div>
  )
}

export default ScreenContent
