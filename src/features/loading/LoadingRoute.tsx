import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { APP_PATHS } from '../../routes/paths'
import LoadingScreen from './LoadingScreen'
import { getPirateMessageSequence } from './utils/getRandomPirateMessages'
import { simulateLoading } from './utils/simulateLoading'

const LOADING_MESSAGE_INTERVAL = 20
const LAUNCH_MESSAGE = 'Land ho! Storytime awaits'

function LoadingRoute() {
  const navigate = useNavigate()
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [pirateMessages] = useState(() => getPirateMessageSequence(5))

  useEffect(() => simulateLoading(setLoadingProgress), [])

  useEffect(() => {
    if (loadingProgress === 100) {
      navigate(APP_PATHS.library, { replace: true })
    }
  }, [loadingProgress, navigate])

  const message =
    loadingProgress === 100
      ? LAUNCH_MESSAGE
      : pirateMessages[
          Math.min(
            Math.floor(loadingProgress / LOADING_MESSAGE_INTERVAL),
            pirateMessages.length - 1,
          )
        ]

  return <LoadingScreen progress={loadingProgress} message={message} />
}

export default LoadingRoute
