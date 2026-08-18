import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router'

function AppLayout() {
  const mainRef = useRef<HTMLElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    mainRef.current?.focus()
  }, [pathname])

  return (
    <main
      id="main-content"
      ref={mainRef}
      tabIndex={-1}
      className="bg-app-background text-content-primary min-h-svh focus:outline-none"
    >
      <Outlet />
    </main>
  )
}

export default AppLayout
