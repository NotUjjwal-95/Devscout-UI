import { RouteState } from '../../app/App'
import { useJob } from '../../app/providers'

export function ExplanationPage() { return <RouteState><ExplanationReady /></RouteState> }
function ExplanationReady() { const explanation = useJob().result?.explanation; if (!explanation) return <div className="panel"><p>No explanation was returned.</p></div>; return <div className="panel"><p className="eyebrow">CONCEPT BRIEF</p><h2>{explanation.topic}</h2><p>{explanation.summary}</p>{explanation.sections.map((section) => <section className="explanation-section" key={section.title}><h3>{section.title}</h3><p>{section.content}</p><small>Sources: {section.citation_resource_ids.join(', ')}</small></section>)}</div> }
