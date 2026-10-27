import { FaAngleLeft } from 'react-icons/fa6'
import { useNavigate } from 'react-router'
import { APP_PATHS } from '../../../routes/paths'

function SettingsHeader() {
  const navigate = useNavigate()

  return (
    <header className="feature-header">
      <button
        type="button"
        className="text-content-primary flex min-h-11 items-center gap-1 justify-self-start text-sm"
        onClick={() => navigate(APP_PATHS.library, { viewTransition: true })}
      >
        <FaAngleLeft aria-hidden="true" />
        <span>Library</span>
      </button>

      <p className="type-brand text-brand-accent justify-self-center">Settings</p>
    </header>
  )
}

export default SettingsHeader
