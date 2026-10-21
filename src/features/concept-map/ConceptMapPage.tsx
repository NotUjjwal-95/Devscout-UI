import { RouteState } from '../../app/App'
import { useJob } from '../../app/providers'

export function ConceptMapPage() { return <RouteState><MapReady /></RouteState> }
function MapReady() { const nodes = useJob().result?.concept_nodes ?? []; return <div className="panel"><p className="eyebrow">KNOWLEDGE GRAPH</p><h2>Concept map</h2><div className="concept-map">{nodes.map((node) => <div className="concept-node" key={node.id}><strong>{node.label}</strong><small>{node.difficulty}</small></div>)}</div></div> }
