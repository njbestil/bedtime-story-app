import { FaAngleLeft } from 'react-icons/fa6'
import { useNavigate } from 'react-router'
import AppHeader from '../AppHeader'

type BackHeaderProps = {
  title: string
  backTo: string
}

function BackHeader({ title, backTo }: BackHeaderProps) {
  const navigate = useNavigate()

  return (
    <AppHeader
      start={
        <button
          type="button"
          className="text-content-primary flex items-center gap-1 text-sm"
          onClick={() => navigate(backTo)}
        >
          <FaAngleLeft aria-hidden="true" />
          <span>Library</span>
        </button>
      }
      center={<p className="type-brand text-brand-accent">{title}</p>}
    />
  )
}

export default BackHeader
