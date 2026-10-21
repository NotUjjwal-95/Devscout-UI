import { useNavigate } from 'react-router-dom'
import { routes } from '../../app/routes'
import { useJob } from '../../app/providers'
import { MenuIcon } from '../ui/icons'

export function Topbar({ open }: { open: () => void }) {
  const navigate = useNavigate()
  const job = useJob()
  const metrics = job.result?.metrics ?? []
  const tokens = metrics.reduce((total, metric) => total + (metric.prompt_tokens ?? 0) + (metric.completion_tokens ?? 0), 0)
  const quota = job.quota
  const quotaText = quota ? `${quota.remaining ?? Math.max(0, (quota.limit ?? quota.tokens_limit ?? 0) - (quota.used ?? quota.tokens_used ?? 0))} left` : 'Quota unavailable'
  return <header className="topbar"><button className="mobile-menu" onClick={open}><MenuIcon /></button><div><h1>DEVSCOUT</h1><div className="header-metrics"><span className="metric">Tokens {tokens.toLocaleString()}</span><span className="metric">Quota {quotaText}</span>{quota?.cost !== undefined && <span className="metric">Cost {quota.currency ?? '$'}{quota.cost.toFixed(4)}</span>}</div></div><button className="button-primary" onClick={() => { job.resetGoal(); navigate(routes.overview) }}>New goal</button></header>
}
