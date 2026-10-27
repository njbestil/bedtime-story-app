import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import AppLayout from '../components/layouts/AppLayout'
import ContentLayout from '../components/layouts/ContentLayout'
import LibraryHeader from '../features/library/components/LibraryHeader'
import LibraryScreen from '../features/library/LibraryScreen'
import SettingsHeader from '../features/settings/components/SettingsHeader'
import SettingsScreen from '../features/settings/SettingsScreen'
import StartupRoute from '../features/startup/StartupRoute'
import StoryGeneratorHeader from '../features/story-generator/components/StoryGeneratorHeader'
import StoryGeneratorScreen from '../features/story-generator/StoryGeneratorScreen'
import StoryReaderScreen from '../features/story-reader/StoryReaderScreen'
import StoryReaderRoute from '../features/story-reader/StoryReaderRoute'
import { APP_PATHS } from './paths'

const appRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path={APP_PATHS.loading} element={<StartupRoute />} />

      <Route element={<AppLayout />}>
        <Route element={<ContentLayout header={<LibraryHeader />} />}>
          <Route path={APP_PATHS.library} element={<LibraryScreen />} />
        </Route>

        <Route element={<ContentLayout header={<SettingsHeader />} />}>
          <Route path={APP_PATHS.settings} element={<SettingsScreen />} />
        </Route>

        <Route element={<ContentLayout header={<StoryGeneratorHeader />} />}>
          <Route path={APP_PATHS.storyGenerator} element={<StoryGeneratorScreen />} />
        </Route>

        <Route element={<StoryReaderRoute />}>
          <Route path={APP_PATHS.storyReader} element={<StoryReaderScreen />} />
        </Route>
      </Route>
    </>,
  ),
)

function AppRoutes() {
  return <RouterProvider router={appRouter} />
}

export default AppRoutes
