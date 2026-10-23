import { NavLink } from 'react-router-dom';
import { routes } from '../../app/routes';
import { useJob } from '../../app/providers';
import {
  DashboardIcon,
  ExplanationIcon,
  MapIcon,
  PipelineIcon,
  PlanIcon,
  PracticeIcon,
  SourcesIcon,
} from '../ui/icons';

const items = [
  [routes.overview, 'Overview', DashboardIcon],
  [routes.pipeline, 'Pipeline', PipelineIcon],
  [routes.plan, 'Learning plan', PlanIcon],
  [routes.sources, 'Sources', SourcesIcon],
  [routes.explanation, 'Explanation', ExplanationIcon],
  [routes.conceptMap, 'Concept map', MapIcon],
  [routes.practice, 'Practice gate', PracticeIcon],
] as const;

export function Sidebar({ close }: { close: () => void }) {
  const job = useJob();
  return (
    <aside className="sidebar">
      <div className="brand">
        DEV<span>SCOUT</span>
        <small>Learn while you build</small>
      </div>
      <nav>
        {items.map(([to, label, Icon]) => (
          <NavLink
            key={to}
            to={to}
            onClick={close}
            className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
          >
            <Icon />
            {label}
            {to === routes.sources && job.result?.resources?.length ? <b>{job.result.resources.length}</b> : null}
            {to === routes.plan && job.result?.learning_plan?.milestones?.length ? (
              <b>{job.result.learning_plan.milestones.length}</b>
            ) : null}
          </NavLink>
        ))}
      </nav>
      <div className="backend-status">
        <span className={job.backendConnected ? 'online' : 'offline'} />
        {job.backendConnected === null
          ? 'Checking backend…'
          : job.backendConnected
            ? 'Backend connected'
            : 'API unreachable'}
        <p>Each explanation section lists the sources it cites.</p>
        {job.isMock && <p className="mock-note">Demo data only</p>}
      </div>
    </aside>
  );
}
