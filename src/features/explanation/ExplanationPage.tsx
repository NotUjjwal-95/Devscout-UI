import { useState } from 'react';
import { useJob } from '../../app/providers';
import type { LearningResponse } from '../../api/client';
import { RouteState } from '../learning-goal/RouteState';

export function ExplanationPage() {
  return (
    <RouteState>
      <ExplanationReady />
    </RouteState>
  );
}

function ExplanationReady() {
  const result = useJob().result;
  const explanation = result?.explanation;
  if (!explanation) {
    return (
      <div className="panel">
        <p>No explanation was returned.</p>
      </div>
    );
  }
  return (
    <div className="panel">
      <p className="eyebrow">CONCEPT BRIEF</p>
      <h2>{explanation.topic}</h2>
      <p>{explanation.summary}</p>
      {explanation.sections.map((section) => (
        <ExplanationSection key={section.title} section={section} resources={result.resources} />
      ))}
    </div>
  );
}

function ExplanationSection({
  section,
  resources,
}: {
  section: LearningResponse['explanation'] extends infer Explanation
    ? Explanation extends { sections: infer Sections }
      ? Sections extends Array<infer Section>
        ? Section
        : never
      : never
    : never;
  resources: LearningResponse['resources'];
}) {
  const status = section.support_status;
  const badgeClass =
    status === 'supported' ? 'badge-lime' : status === 'weakly_supported' ? 'badge-amber' : 'badge-red';
  const badgeText = status === 'unsupported' ? 'Not backed by sources' : status.replaceAll('_', ' ');
  return (
    <section className="explanation-section">
      <h3>{section.title}</h3>
      <p>{section.content}</p>
      <div className="citation-list">
        <span className={`badge ${badgeClass}`}>{badgeText}</span>
        {section.citations.map((citation) => {
          const resource = resources.find((item) => item.resource_id === citation.resource_id);
          return resource ? <CitationChip key={citation.resource_id} citation={citation} resource={resource} /> : null;
        })}
      </div>
    </section>
  );
}

function CitationChip({
  citation,
  resource,
}: {
  citation: { resource_id: string; supporting_quote: string };
  resource: LearningResponse['resources'][number];
}) {
  const [expanded, setExpanded] = useState(false);
  const link = /^https?:\/\//i.test(resource.url) ? resource.url : undefined;
  return (
    <span className="citation-wrap">
      {link ? (
        <a className="citation" href={link} target="_blank" rel="noreferrer" onClick={() => setExpanded(!expanded)}>
          {resource.title}
        </a>
      ) : (
        <button className="citation" type="button" onClick={() => setExpanded(!expanded)}>
          {resource.title}
        </button>
      )}
      {citation.supporting_quote && (
        <button className="citation-quote-toggle" type="button" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Hide quote' : 'Show quote'}
        </button>
      )}
      {expanded && citation.supporting_quote && <span className="citation-popover">“{citation.supporting_quote}”</span>}
    </span>
  );
}
