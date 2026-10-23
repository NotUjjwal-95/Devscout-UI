import { RouteState } from '../learning-goal/RouteState';
import { useJob } from '../../app/providers';

export function PlanPage() {
  return (
    <RouteState>
      <PlanReady />
    </RouteState>
  );
}
function PlanReady() {
  const plan = useJob().result?.learning_plan;
  return (
    <div className="panel">
      <p className="eyebrow">THE ROUTE</p>
      <h2>Learning plan</h2>
      {(plan?.milestones ?? []).map((milestone) => (
        <article className="milestone" key={milestone.milestone_id}>
          <strong>{milestone.title}</strong>
          <p>{milestone.description}</p>
          <small>{milestone.target_outcome}</small>
        </article>
      ))}
    </div>
  );
}
