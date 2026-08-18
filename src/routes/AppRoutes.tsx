import { Route, Routes } from 'react-router'
import AppHeader from '../components/layouts/AppHeader'
import AppLayout from '../components/layouts/AppLayout'
import ContentLayout from '../components/layouts/ContentLayout'
import BackHeader from '../components/layouts/headers/BackHeader'
import StoryReaderHeader from '../components/layouts/headers/StoryReaderHeader'
import LibraryScreen from '../features/library/LibraryScreen'
import LoadingRoute from '../features/loading/LoadingRoute'
import SettingsScreen from '../features/settings/SettingsScreen'
import StoryGeneratorScreen from '../features/story-generator/StoryGeneratorScreen'
import StoryReaderScreen from '../features/story-reader/StoryReaderScreen'
import { MOONLIT_MAP_STORY } from '../features/story-reader/storyReader.constants'
import { APP_PATHS } from './paths'

function AppRoutes() {
  return (
    <Routes>
      <Route path={APP_PATHS.loading} element={<LoadingRoute />} />

      <Route element={<AppLayout />}>
        <Route element={<ContentLayout header={<AppHeader />} />}>
          <Route path={APP_PATHS.library} element={<LibraryScreen />} />
        </Route>

        <Route
          element={
            <ContentLayout
              header={<BackHeader title="Settings" backTo={APP_PATHS.library} />}
            />
          }
        >
          <Route path={APP_PATHS.settings} element={<SettingsScreen />} />
        </Route>

        <Route
          element={
            <ContentLayout
              header={<BackHeader title="Find a Story" backTo={APP_PATHS.library} />}
            />
          }
        >
          <Route path={APP_PATHS.storyGenerator} element={<StoryGeneratorScreen />} />
        </Route>

        <Route
          element={
            <ContentLayout
              header={<StoryReaderHeader initiallyBookmarked={MOONLIT_MAP_STORY.isBookmark} />}
            />
          }
        >
          <Route path={APP_PATHS.storyReader} element={<StoryReaderScreen />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
