import { Outlet } from 'react-router'
import ScreenContent from './components/layouts/ScreenContent'
import AppRoutes from './routes/AppRoutes'

function AppLayout() {
  return (
    <main className="bg-app-background text-content-primary min-h-svh">
      <ScreenContent>
        <Outlet />
      </ScreenContent>
    </main>
  )
}

function App() {
  return <AppRoutes layout={<AppLayout />} />
}

export default App
