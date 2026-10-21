import type { PropsWithChildren } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJob } from '../../app/providers'
import { routes } from '../../app/routes'

export function RouteState({ children }: PropsWithChildren) {
  const job = useJob()
  const navigate = useNavigate()

  if (job.status === 'idle') {
    return <div className="panel state-panel"><p>This page will show data after you start a learning goal.</p><button className="button-primary" onClick={() => navigate(routes.overview)}>Start a goal</button></div>
  }
  if (job.status === 'running') {
    return <div className="panel state-panel"><p>Your learning job is running.</p></div>
  }
  if (job.status === 'failed' && !job.result) {
    return <div className="panel state-panel error-state"><p>{job.error}</p><button className="button-secondary" onClick={() => void job.retry()}>Retry</button></div>
  }
  if (job.status === 'failed') {
    return <><div className="panel state-panel error-state"><p>{job.error}</p><button className="button-secondary" onClick={() => void job.retry()}>Retry</button></div>{children}</>
  }
  return <>{children}</>
}
