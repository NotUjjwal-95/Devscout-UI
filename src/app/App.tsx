import { Link, useNavigate } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { routes } from './routes'
import { useJob } from './providers'
import { GoalPage } from '../features/learning-goal/GoalPage'
import { PipelinePage } from '../features/pipeline/PipelinePage'
import { SourcesPage } from '../features/sources/SourcesPage'
import { ExplanationPage } from '../features/explanation/ExplanationPage'
import { ConceptMapPage } from '../features/concept-map/ConceptMapPage'
import { PracticeGatePage } from '../features/practice-gate/PracticeGatePage'
import { PlanPage } from '../features/pipeline/PlanPage'

export default AppShell
export { GoalPage as OverviewPage, PipelinePage, PlanPage, SourcesPage, ExplanationPage, ConceptMapPage, PracticeGatePage }

export function EmptyPage() {
  return <div className="panel state-panel"><h2>Page not found</h2><p>This route does not exist in the learning workspace.</p><Link className="button-primary" to={routes.overview}>Return home</Link></div>
}

export function RouteState({ children }: { children: React.ReactNode }) {
  const job = useJob()
  const navigate = useNavigate()
  if (job.status === 'idle') return <div className="panel state-panel"><p>This page will show data after you start a learning goal.</p><button className="button-primary" onClick={() => navigate(routes.overview)}>Start a goal</button></div>
  if (job.status === 'running') return <div className="panel state-panel"><p>Your learning job is running.</p></div>
  if (job.status === 'failed') return <div className="panel state-panel error-state"><p>{job.error}</p><button className="button-secondary" onClick={() => void job.retry()}>Retry</button></div>
  return <>{children}</>
}
