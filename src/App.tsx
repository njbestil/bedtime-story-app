import { useState } from "react"
import LoadingScreen from './features/loading/LoadingScreen'

function App() {
  const [loadingProgress, setLoadingProgress] = useState(0)

  return <LoadingScreen progress={loadingProgress} />
}


export default App
