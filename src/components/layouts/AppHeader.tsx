import { type MouseEvent, type ReactNode, useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { FaAnchor, FaBars, FaXmark } from 'react-icons/fa6'
import { APP_PATHS, getStoryReaderPath } from '../../routes/paths'

const MENU_ITEMS = [
  { label: 'Settings', to: APP_PATHS.settings },
  { label: 'Find a Story', to: APP_PATHS.storyGenerator },
  { label: 'Continue Reading', to: getStoryReaderPath('moonlit-map') },
] as const

type MenuState = 'closed' | 'open' | 'closing'

type AppHeaderProps = {
  start?: ReactNode
  center?: ReactNode
  end?: ReactNode
}

type MenuNavigationProps = {
  isClosing: boolean
  onCloseMenu: () => void
  onAnimationEnd: () => void
  onNavigate: (to: string) => (event: MouseEvent<HTMLAnchorElement>) => void
}

type MenuButtonProps = {
  isOpen: boolean
  onClick?: () => void
}

function AppBrand() {
  return (

    <p className="type-brand text-brand-accent flex items-center gap-2">
      <FaAnchor
        className="text-brand-highlight font-sans text-base"
        aria-hidden="true"
      />
      Voyage Tales
    </p>
  )
}

function MenuButton({ isOpen, onClick }: MenuButtonProps) {
  return (
    <button
      type="button"
      className="text-content-primary flex items-center gap-2 px-1 text-sm"
      aria-expanded={isOpen}
      aria-controls="primary-navigation"
      onClick={onClick}
    >
      <FaBars className="text-base leading-none" aria-hidden="true" />
      <span>Menu</span>
    </button>
  )
}

function MenuNavigation({
  isClosing,
  onCloseMenu,
  onAnimationEnd,
  onNavigate,
}: MenuNavigationProps) {
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
      <button
        type="button"
        className='fixed top-3 right-3'
        aria-label="Close menu"
        onClick={onCloseMenu}
      >
        <FaXmark className="text-lg" aria-hidden="true" />
      </button>
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

function AppHeader({ start, center, end }: AppHeaderProps) {
  const [menuState, setMenuState] = useState<MenuState>('closed')

  const navigate = useNavigate()

  const isMenuOpen = menuState !== 'closed'
  const isMenuClosing = menuState === 'closing'
  const usesDefaultContent = start === undefined && center === undefined && end === undefined

  const resolvedStart = usesDefaultContent ? <AppBrand /> : start
  const resolvedCenter = usesDefaultContent ? undefined : center
  const resolvedEnd = usesDefaultContent ? <MenuButton isOpen={isMenuOpen} onClick={toggleMenu} /> : end

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
    <>
      <div className="bg-app-background fixed inset-x-0 top-0 z-40 w-full">
        <header
          className="
            bg-app-surface
            border-outline-muted
            relative
            z-[60]
            grid
            min-h-11
            grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]
            items-center
            border-b
            px-2.5
            py-[max(0.5rem,calc(env(safe-area-inset-top)+0.25rem))]
          "
        >
          <div className="min-w-0 justify-self-start">{resolvedStart}</div>
          <div className="min-w-0 justify-self-center">{resolvedCenter}</div>
          <div className="min-w-0 justify-self-end">{resolvedEnd}</div>
        </header>
      </div>

      { isMenuOpen && (
        <MenuNavigation
          isClosing={isMenuClosing}
          onCloseMenu={toggleMenu}
          onAnimationEnd={handleMenuAnimationEnd}
          onNavigate={handleMenuNavigation}
        />
      )}
    </>
    
  )
}

export default AppHeader
