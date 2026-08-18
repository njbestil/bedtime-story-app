import type { ReactNode } from 'react'
import { Outlet } from 'react-router'

type ContentLayoutProps = {
  header: ReactNode
}

function ContentLayout({ header }: ContentLayoutProps) {
  return (
    <>
      {header}
      <div className="mx-auto w-full px-4 pt-11 md:max-w-svh">
        <Outlet />
      </div>
    </>
  )
}

export default ContentLayout
