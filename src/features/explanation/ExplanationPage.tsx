import { useState } from 'react'
import { RouteState } from '../learning-goal/RouteState'
import { useJob } from '../../app/providers'

export function ExplanationPage() {
  return <RouteState><ExplanationReady /></RouteState>
}

function ExplanationReady() {
  const result = useJob().result
  const explanation = result?.explanation
  const resources = result?.resources ?? []
  if (!explanation) return <div className="panel"><p>No explanation was returned.</p></div>
  return <div className="panel">
    <p className="eyebrow">CONCEPT BRIEF</p>
    <h2>{explanation.topic}</h2>
    <p>{explanation.summary}</p>
    {explanation.sections.map((section) => {
      const citations = section.citation_resource_ids.map((id) => resources.find((resource) => resource.resource_id === id)).filter(Boolean)
      return <section className="explanation-section" key={section.title}>
        <h3>{section.title}</h3>
        <p>{section.content}</p>
        <div className="citation-list">
          {citations.map((resource) => <CitationChip key={resource!.resource_id} resource={resource!} />)}
          {!citations.length && <span className="badge badge-amber">Not backed by sources</span>}
        </div>
      </section>
    })}
  </div>
}

function CitationChip({ resource }: { resource: NonNullable<ReturnType<typeof useJob>['result']>['resources'][number] }) {
  const [expanded, setExpanded] = useState(false)
  const supported = !resource.is_rejected && resource.reliability >= 0.6
  const link = /^https?:\/\//i.test(resource.url) ? resource.url : undefined
  return <span className="citation-wrap">
    {link ? <a className="citation" href={link} target="_blank" rel="noreferrer" onMouseEnter={() => setExpanded(true)} onFocus={() => setExpanded(true)} onClick={() => setExpanded(!expanded)}>{resource.title}</a> : <button className="citation" onClick={() => setExpanded(!expanded)}>{resource.title}</button>}
    <span className={`badge ${supported ? 'badge-lime' : 'badge-amber'}`}>{supported ? 'Supported' : 'Weakly supported'}</span>
    {expanded && resource.anchored_quote && <span className="citation-popover">“{resource.anchored_quote}”</span>}
  </span>
}
