import { RouteState } from '../learning-goal/RouteState'
import { useJob } from '../../app/providers'

export function SourcesPage() {
  return <RouteState><SourcesReady /></RouteState>
}

function SourcesReady() {
  const result = useJob().result!
  const groups = result.resources.reduce<Record<string, typeof result.resources>>((acc, resource) => {
    const status = resource.status ?? (resource.is_rejected ? 'rejected' : resource.uncertainty_flag ? 'uncertain' : 'accepted')
    ;(acc[status] ??= []).push(resource)
    return acc
  }, {})
  return <div>
    <p className="eyebrow">RESEARCH TRACE</p>
    <h2>Source library</h2>
    {result.evidence_status === 'insufficient' && <EvidenceNotice result={result} />}
    {Object.entries(groups).map(([status, resources]) => <section className="source-group" key={status}>
      <h3>{status.replaceAll('_', ' ')}</h3>
      <div className="card-grid">{resources.map((resource) => <ResourceCard key={resource.resource_id} resource={resource} />)}</div>
    </section>)}
    {!result.resources.length && <EvidenceNotice result={result} />}
  </div>
}

function ResourceCard({ resource }: { resource: NonNullable<ReturnType<typeof useJob>['result']>['resources'][number] }) {
  const link = /^https?:\/\//i.test(resource.url) ? resource.url : undefined
  return <article className="panel source-card">
    <div className="source-meta"><span className="badge">{resource.type}</span><span className="badge">{resource.origin ?? originOf(resource.url)}</span>{resource.uncertainty_flag && <span className="badge badge-amber">Uncertain</span>}{resource.is_rejected && <span className="badge badge-amber">Rejected</span>}</div>
    <h3>{resource.title}</h3>
    <p>{resource.summary}</p>
    {resource.is_rejected && <p className="error-text">{resource.rejection_reason ?? 'Rejected by evidence review.'}</p>}
    <Meter label="Freshness" value={resource.freshness_score} /><Meter label="Reliability" value={resource.reliability} />
    {link && <a className="button-secondary source-link" href={link} target="_blank" rel="noreferrer">Open source</a>}
  </article>
}

function EvidenceNotice({ result }: { result: NonNullable<ReturnType<typeof useJob>['result']> }) {
  const summary = result.evidence_summary
  return <div className="panel evidence-notice"><h3>Insufficient evidence</h3><p>Evidence status: <strong>{result.evidence_status ?? 'unknown'}</strong></p>{result.warnings?.map((warning) => <p className={warning.severity === 'critical' ? 'error-text' : 'warning-text'} key={warning.message}>{warning.message}</p>)}{summary && <><p>Discovered {summary.discovered} · fetched {summary.fetched} · accepted {summary.accepted}</p>{summary.rejected.map((item) => <p key={item.url}><code>{item.url}</code> — {item.reason}</p>)}</>}</div>
}

function originOf(url: string) {
  try { return new URL(url).hostname } catch { return 'Unknown origin' }
}

function Meter({ label, value }: { label: string; value: number }) {
  return <div className="meter"><span>{label}</span><span>{Math.round(value * 100)}%</span><div><i style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }} /></div></div>
}
