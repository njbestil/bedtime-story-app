import type { ReactNode } from 'react'
import { Route, Routes } from 'react-router'
import LibraryScreen from '../features/library/LibraryScreen'
import LoadingRoute from '../features/loading/LoadingRoute'
import StoryGeneratorScreen from '../features/story-generator/StoryGeneratorScreen'
import StoryReaderScreen from '../features/story-reader/StoryReaderScreen'
import { APP_PATHS } from './paths'

type AppRoutesProps = {
  layout: ReactNode
}

function AppRoutes({ layout }: AppRoutesProps) {
  return (
    <Routes>
      <Route path={APP_PATHS.loading} element={<LoadingRoute />} />

      <Route element={layout}>
        <Route path={APP_PATHS.library} element={<LibraryScreen />} />
        <Route path={APP_PATHS.storyGenerator} element={<StoryGeneratorScreen />} />
        <Route path={APP_PATHS.storyReader} element={<StoryReaderScreen />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
