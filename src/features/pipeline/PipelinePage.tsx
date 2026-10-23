import { RouteState } from '../learning-goal/RouteState';
import { useJob } from '../../app/providers';
import { PipelineStepper } from './PipelineStepper';

export function PipelinePage() {
  return (
    <RouteState showRunning>
      <PipelineReady />
    </RouteState>
  );
}
function PipelineReady() {
  const job = useJob();
  return (
    <div className="panel">
      <p className="eyebrow">JOB PIPELINE</p>
      <h2>9-stage learning pipeline</h2>
      <PipelineStepper result={job.result} />
    </div>
  );
}
