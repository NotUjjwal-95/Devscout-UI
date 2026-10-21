import { RouteState } from '../../app/App'
import { useJob } from '../../app/providers'

export function SourcesPage() { return <RouteState><SourcesReady /></RouteState> }
function SourcesReady() {
  const result = useJob().result!
  if (!result.resources.length) return <div className={`panel ${result.evidence_status === 'insufficient' ? 'error-state' : ''}`}><h2>No reliable sources found</h2><p>Evidence status: <strong>{result.evidence_status ?? 'unknown'}</strong></p>{result.evidence_summary && <div className="evidence-summary"><p>Discovered {result.evidence_summary.discovered} · fetched {result.evidence_summary.fetched} · accepted {result.evidence_summary.accepted}</p>{result.evidence_summary.rejected.map((item) => <p key={item.url}><code>{item.url}</code> — {item.reason}</p>)}</div>}</div>
  return <div><p className="eyebrow">RESEARCH TRACE</p><h2>Source library</h2><div className="card-grid">{result.resources.map((resource) => <article className="panel" key={resource.resource_id}><span className="badge">{resource.type}</span><h3>{resource.title}</h3><p>{resource.summary}</p><Meter label="Freshness" value={resource.freshness_score} /><Meter label="Reliability" value={resource.reliability} /></article>)}</div></div>
}
function Meter({ label, value }: { label: string; value: number }) { return <div className="meter"><span>{label}</span><span>{Math.round(value * 100)}%</span><div><i style={{ width: `${value * 100}%` }} /></div></div> }
