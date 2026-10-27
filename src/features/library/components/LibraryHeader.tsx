import { useEffect, useState } from 'react'
import { FaAnchor, FaBars, FaXmark } from 'react-icons/fa6'
import { NavLink } from 'react-router'
import { APP_PATHS, getStoryReaderPath } from '../../../routes/paths'

const MENU_ITEMS = [
  { label: 'Settings', to: APP_PATHS.settings },
  { label: 'Find a Story', to: APP_PATHS.storyGenerator },
  { label: 'Continue Reading', to: getStoryReaderPath('moonlit-map') },
] as const

type MenuState = 'closed' | 'open' | 'closing'

function LibraryHeader() {
  const [menuState, setMenuState] = useState<MenuState>('closed')
  const isMenuOpen = menuState !== 'closed'
  const isMenuClosing = menuState === 'closing'

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

  function handleMenuAnimationEnd() {
    if (isMenuClosing) {
      setMenuState('closed')
    }
  }

  const animationClass = isMenuClosing
    ? 'motion-safe:animate-[menu-close_150ms_ease-in_forwards]'
    : 'motion-safe:animate-[menu-open_180ms_ease-out]'

  return (
    <>
      <header className="feature-header">
        <p className="type-brand text-brand-accent flex items-center gap-2 justify-self-start">
          <FaAnchor className="text-brand-highlight font-sans text-base" aria-hidden="true" />
          Voyage Tales
        </p>

        <button
          type="button"
          className="text-content-primary col-start-3 flex items-center gap-2 justify-self-end px-1 text-sm"
          aria-expanded={isMenuOpen ? 'true' : 'false'}
          aria-controls="primary-navigation"
          onClick={toggleMenu}
        >
          <FaBars className="text-base leading-none" aria-hidden="true" />
          <span>Menu</span>
        </button>
      </header>

      {isMenuOpen && (
        <nav
          id="primary-navigation"
          className={`bg-app-surface fixed inset-0 z-50 flex min-h-svh flex-col px-4 pt-[calc(env(safe-area-inset-top)+4rem)] pb-6 motion-reduce:animate-none ${animationClass}`}
          aria-label="Primary"
          onAnimationEnd={handleMenuAnimationEnd}
        >
          <button
            type="button"
            className="text-content-primary fixed top-3 right-3 flex min-h-11 min-w-11 items-center justify-center"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            <FaXmark className="text-lg" aria-hidden="true" />
          </button>

          <ul className="flex flex-1 flex-col items-center justify-center gap-4">
            {MENU_ITEMS.map((item) => (
              <li key={item.to} className="w-full max-w-sm">
                <NavLink
                  to={item.to}
                  viewTransition
                  onClick={closeMenu}
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
      )}
    </>
  )
}

export default LibraryHeader
