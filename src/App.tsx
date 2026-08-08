import { Outlet } from 'react-router'
import Header from './components/layouts/Header'
import ScreenContent from './components/layouts/ScreenContent'
import AppRoutes from './routes/AppRoutes'

function AppLayout() {
  return (
    <main className="bg-app-background text-content-primary min-h-svh">
      <Header />
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
