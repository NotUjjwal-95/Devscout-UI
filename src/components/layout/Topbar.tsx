import { useNavigate } from 'react-router-dom'
import { routes } from '../../app/routes'
import { useJob } from '../../app/providers'
import { MenuIcon } from '../ui/icons'

export function Topbar({ open }: { open: () => void }) {
  const navigate = useNavigate()
  const job = useJob()
  return <header className="topbar"><button className="mobile-menu" onClick={open}><MenuIcon /></button><h1>DEVSCOUT</h1><button className="button-primary" onClick={() => { job.setRequest({ goal: '', description: '', experience_level: 'beginner', tech_stack: [] }); navigate(routes.overview) }}>New goal</button></header>
}
