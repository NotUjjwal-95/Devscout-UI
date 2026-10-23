import { RouteState } from '../learning-goal/RouteState';
import { useJob } from '../../app/providers';

type Point = { x: number; y: number };

export function ConceptMapPage() {
  return (
    <RouteState>
      <MapReady />
    </RouteState>
  );
}

function MapReady() {
  const result = useJob().result!;
  const nodes = result.concept_nodes ?? [];
  const edges = result.concept_edges ?? [];
  const layers = layeredNodes(
    nodes.map((node) => node.id),
    edges,
  );
  const positions = new Map<string, Point>();
  layers.forEach((layer, layerIndex) =>
    layer.forEach((id, index) => positions.set(id, { x: 120 + layerIndex * 220, y: 70 + index * 110 })),
  );
  const mapWidth = Math.max(700, layers.length * 220 + 100);
  const mapHeight = Math.max(240, Math.max(1, ...layers.map((layer) => layer.length)) * 110 + 80);
  return (
    <div className="panel">
      <p className="eyebrow">KNOWLEDGE GRAPH</p>
      <h2>Concept map</h2>
      {!nodes.length ? (
        <p>No concept relationships were returned.</p>
      ) : (
        <div className="concept-map-wrap">
          <svg
            className="concept-map-svg"
            viewBox={`0 0 ${mapWidth} ${mapHeight}`}
            role="img"
            aria-label="Concept relationship map"
          >
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L7,3 z" className="fill-fog" />
              </marker>
            </defs>
            {edges.map((edge) => {
              const source = positions.get(edge.source);
              const target = positions.get(edge.target);
              return source && target ? (
                <g key={`${edge.source}-${edge.target}`}>
                  <line
                    className="concept-edge"
                    x1={source.x + 70}
                    y1={source.y + 25}
                    x2={target.x - 70}
                    y2={target.y + 25}
                  />
                  <text className="concept-edge-label" x={(source.x + target.x) / 2} y={(source.y + target.y) / 2 - 6}>
                    {edge.relation}
                  </text>
                </g>
              ) : null;
            })}
            {nodes.map((node) => {
              const point = positions.get(node.id)!;
              return (
                <g key={node.id} transform={`translate(${point.x - 70},${point.y})`}>
                  <rect className="concept-node-shape" width="140" height="52" rx="10" />
                  <text className="concept-node-label" x="70" y="22">
                    {node.label}
                  </text>
                  <text className="concept-node-level" x="70" y="40">
                    {node.difficulty}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
}

function layeredNodes(nodeIds: string[], edges: { source: string; target: string }[]) {
  const incoming = new Map(nodeIds.map((id) => [id, 0]));
  edges.forEach((edge) => incoming.set(edge.target, (incoming.get(edge.target) ?? 0) + 1));
  const remaining = new Set(nodeIds);
  const layers: string[][] = [];
  while (remaining.size) {
    const layer = [...remaining].filter((id) => (incoming.get(id) ?? 0) === 0);
    const current = layer.length ? layer : [...remaining];
    layers.push(current);
    current.forEach((id) => remaining.delete(id));
    edges.forEach((edge) => {
      if (current.includes(edge.source)) incoming.set(edge.target, Math.max(0, (incoming.get(edge.target) ?? 1) - 1));
    });
  }
  return layers;
}
