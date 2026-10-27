import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { APP_PATHS } from '../../routes/paths'
import { STARTUP_MESSAGES } from './startup.constants'
import { useStartupInitialization } from './hooks/useStartupInitialization'
import StartupScreen from './StartupScreen'

function StartupRoute() {
  const navigate = useNavigate()
  const { isLoading, progress, errorMessage, initialStories, isReadyToNavigate, retry } =
    useStartupInitialization()

  useEffect(() => {
    if (!isReadyToNavigate || initialStories === null) {
      return
    }

    navigate(APP_PATHS.library, {
      replace: true,
      state: { initialStories },
      viewTransition: true,
    })
  }, [initialStories, isReadyToNavigate, navigate])

  return (
    <StartupScreen
      isLoading={isLoading}
      progress={progress}
      message={progress < 50 ? STARTUP_MESSAGES.loadingStories : STARTUP_MESSAGES.preparingApp}
      errorMessage={errorMessage}
      onRetry={retry}
    />
  )
}

export default StartupRoute
