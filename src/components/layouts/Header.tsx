import { type MouseEvent, useEffect, useState } from 'react'
import { FaAnchor, FaAngleLeft, FaBars, FaXmark } from 'react-icons/fa6'
import { matchPath, NavLink, useLocation, useNavigate } from 'react-router'
import { APP_PATHS, getStoryReaderPath } from '../../routes/paths'

type MenuState = 'closed' | 'open' | 'closing'

type HeaderActionProps = {
  isMenuOpen: boolean
  onClick: () => void
  title: string
}

type MenuOverlayProps = {
  isClosing: boolean
  onAnimationEnd: () => void
  onNavigate: (to: string) => (event: MouseEvent<HTMLAnchorElement>) => void
}

const MENU_ITEMS = [
  { label: 'Library', to: APP_PATHS.library },
  { label: 'Find a Story', to: APP_PATHS.storyGenerator },
  { label: 'Continue Reading', to: getStoryReaderPath('moonlit-map') },
] as const

function getHeaderTitle(pathname: string): string {
  if (pathname === APP_PATHS.library) {
    return 'Menu'
  }

  if (pathname === APP_PATHS.storyGenerator) {
    return 'Find a Story'
  }

  if (matchPath(APP_PATHS.storyReader, pathname)) {
    return 'Story Reader'
  }

  return ''
}

function MainHeader({ onClick }: Pick<HeaderActionProps, 'onClick'>) {
  return (
    <>
      <p className="type-brand text-brand-accent flex items-center gap-2">
        <FaAnchor
          className="text-brand-highlight font-sans text-base"
          aria-hidden="true"
        />
        Voyage Tales
      </p>

      <button
        type="button"
        className="text-content-primary flex items-center gap-2 px-1 text-sm"
        aria-expanded="false"
        aria-controls="primary-navigation"
        onClick={onClick}
      >
        <FaBars className="text-base leading-none" aria-hidden="true" />
        Menu
      </button>
    </>
  )
}

function ContextualHeader({ isMenuOpen, onClick, title }: HeaderActionProps) {
  return (
    <>
      <button
        type="button"
        className="text-content-primary flex items-center gap-1 text-sm"
        aria-label={isMenuOpen ? 'Close menu' : 'Go back'}
        onClick={onClick}
      >
        {isMenuOpen ? (
          <FaXmark className="text-lg" aria-hidden="true" />
        ) : (
          <>
            <FaAngleLeft aria-hidden="true" />
            <span>Back</span>
          </>
        )}
      </button>
      <h1 className="type-brand text-brand-accent absolute left-1/2 -translate-x-1/2">
        {title}
      </h1>
    </>
  )
}

function MenuOverlay({
  isClosing,
  onAnimationEnd,
  onNavigate,
}: MenuOverlayProps) {
  const animationClass = isClosing
    ? 'motion-safe:animate-[menu-close_150ms_ease-in_forwards]'
    : 'motion-safe:animate-[menu-open_180ms_ease-out]'

  return (
    <nav
      id="primary-navigation"
      className={`bg-app-surface fixed inset-0 z-50 flex min-h-svh flex-col px-4 pt-[calc(env(safe-area-inset-top)+4rem)] pb-6 motion-reduce:animate-none ${animationClass}`}
      aria-label="Primary navigation"
      onAnimationEnd={onAnimationEnd}
    >
      <ul className="flex flex-1 flex-col items-center justify-center gap-4">
        {MENU_ITEMS.map((item) => (
          <li key={item.to} className="w-full max-w-sm">
            <NavLink
              to={item.to}
              onClick={onNavigate(item.to)}
              className={({ isActive }) =>
                `type-action flex min-h-14 w-full items-center justify-center rounded-xl px-4 text-center ${
                  isActive
                    ? 'bg-app-background text-brand-accent'
                    : 'text-content-primary hover:bg-app-background hover:text-brand-accent'
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function Header() {
  const [menuState, setMenuState] = useState<MenuState>('closed')
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const isMenuOpen = menuState !== 'closed'
  const isMenuClosing = menuState === 'closing'
  const isContextualHeader = isMenuOpen || pathname !== APP_PATHS.library
  const headerTitle = getHeaderTitle(pathname)

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMenuOpen])

  function closeMenu() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMenuState('closed')
      return
    }

    setMenuState('closing')
  }

  function toggleMenu() {
    if (isMenuOpen) {
      closeMenu()
      return
    }

    setMenuState('open')
  }

  function handleHeaderAction() {
    if (isMenuOpen) {
      closeMenu()
      return
    }

    navigate(-1)
  }

  function handleMenuNavigation(to: string) {
    return (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault()
      navigate(to)
      closeMenu()
    }
  }

  function handleMenuAnimationEnd() {
    if (isMenuClosing) {
      setMenuState('closed')
    }
  }

  return (
    <div className="bg-app-background sticky top-0 z-40">
      <header className="bg-app-surface border-outline-muted relative z-[60] flex min-h-11 items-center justify-between border-b px-2.5 py-[max(0.5rem,calc(env(safe-area-inset-top)+0.25rem))]">
        {isContextualHeader ? (
          <ContextualHeader
            isMenuOpen={isMenuOpen}
            onClick={handleHeaderAction}
            title={headerTitle}
          />
        ) : (
          <MainHeader onClick={toggleMenu} />
        )}
      </header>

      {isMenuOpen && (
        <MenuOverlay
          isClosing={isMenuClosing}
          onAnimationEnd={handleMenuAnimationEnd}
          onNavigate={handleMenuNavigation}
        />
      )}
    </div>
  )
}

export default Header
